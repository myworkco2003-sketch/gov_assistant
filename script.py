import argparse
import glob
import html
import os
import re

END_MARKERS = ("يمكنك العودة", "العودة إلى", "دليل خدمة", "التعليقات والاقتراحات")
HEADINGS = {"الرسوم": "fees", "الأوراق المطلوبة": "docs", "الخطوات": "steps"}
SKIP = {"طباعة الدليل", "نسخ رابط الخدمة", "ابدأ الخدمة", "تواصل معنا", "صفحة تواصل معنا"}
METHOD = "طريقة تقديم الطلب"
PLACE = "مكان تقديم الطلب"


def clean(s):
    s = s.replace("\u0640", "")  # حذف التطويل (ـ) مثل: ســــكني
    return re.sub(r"[ \t\u00a0]+", " ", s).strip()


def page_lines(path):
    s = open(path, encoding="utf-8", errors="replace").read()
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", s, flags=re.S | re.I)
    m = re.search(r"<body.*", s, flags=re.S | re.I)
    s = m.group(0) if m else s
    s = re.sub(r"<(br|/p|/div|/li|/h\d|/tr|/td|/th)[^>]*>", "\n", s, flags=re.I)
    s = html.unescape(re.sub(r"<[^>]+>", "", s))
    return [c for c in (clean(x) for x in s.split("\n")) if c]


def parse(path):
    L = page_lines(path)
    kind, start = None, None
    for i, l in enumerate(L):
        if l == "شرح الخدمة":
            kind, start = "paper", i
            break
        if l == "دليل الخدمة":
            kind, start = "electronic", i
            break
    if start is None or start + 1 >= len(L):
        return None

    d = {"kind": kind, "title": L[start + 1], "desc": [], "directorate": "",
         "method": "", "place": "", "fees": [], "docs": [], "steps": []}
    cur, pending = None, None
    for l in L[start + 2:]:
        key = l.rstrip(" :")
        if key in HEADINGS:
            cur = HEADINGS[key]
            continue
        if cur and l.startswith(END_MARKERS):
            break
        if cur:
            d[cur].append(l)
            continue
        if pending:
            d[pending] = l
            pending = None
        elif l.startswith(METHOD):
            d["method"] = l[len(METHOD):].strip(" :")
            pending = None if d["method"] else "method"
        elif l.startswith(PLACE):
            d["place"] = l[len(PLACE):].strip(" :")
            pending = None if d["place"] else "place"
        elif l.startswith("المديرية:"):
            d["directorate"] = l.split(":", 1)[1].strip()
        elif l in SKIP or l.startswith("العودة إلى"):
            continue
        elif l != d["title"]:
            d["desc"].append(l)
    return d


def block(lines):
    return "\n".join("- " + x for x in lines) if lines else "غير مذكور في الدليل"


def to_md(d, updated):
    out = [f"# {d['title']}"]
    if updated:
        out.append(f"آخر تحديث: {updated}")
    out.append("نوع الخدمة: " + ("معاملة ورقية" if d["kind"] == "paper" else "خدمة إلكترونية"))
    out.append("\n## نبذة")
    out.append("\n".join(d["desc"]) or d["title"])
    if d["directorate"]:
        out.append("المديرية: " + d["directorate"])
    if d["method"] or d["place"]:
        out.append("\n## طريقة ومكان تقديم الطلب")
        if d["method"]:
            out.append("طريقة تقديم الطلب: " + d["method"])
        if d["place"]:
            out.append("مكان تقديم الطلب: " + d["place"])
    out.append("\n## الرسوم\n" + block(d["fees"]))
    out.append("\n## الأوراق المطلوبة\n" + block(d["docs"]))
    out.append("\n## الخطوات\n" + block(d["steps"]))
    return "\n".join(out) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src", help="مجلد صفحات الخدمات (ملفات .html)")
    ap.add_argument("--out", default="content")
    ap.add_argument("--updated", default="", help="تاريخ آخر تحديث للمحتوى YYYY-MM-DD (اختياري)")
    a = ap.parse_args()

    os.makedirs(a.out, exist_ok=True)
    n = {"paper": 0, "electronic": 0}
    for path in sorted(glob.glob(os.path.join(a.src, "*.html"))):
        d = parse(path)
        if not d:
            print("SKIP:", os.path.basename(path))
            continue
        n[d["kind"]] += 1
        name = f"{d['kind']}_{n[d['kind']]:02d}.md"
        with open(os.path.join(a.out, name), "w", encoding="utf-8") as f:
            f.write(to_md(d, a.updated))
        print(name, "<-", d["title"])
        if "لا يوجد" in " ".join(d["fees"]) and "رسوم" in " ".join(d["steps"]):
            print("   تنبيه: الرسوم 'لا يوجد' لكن الخطوات تذكر رسومًا، راجعها مع الجهة")
    print("تم:", n)


if __name__ == "__main__":
    main()