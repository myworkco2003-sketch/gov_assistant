import sys

import httpx

URL = "http://localhost:8000/api/chat"
questions = sys.argv[1:] or [
    "شو الأوراق المطلوبة لفض الختم عن مخالفة بناء؟",
    "كم رسم دخول السيارة لدمشق القديمة للتجاري؟",
    "كيف أقدم شكوى؟",
    "شو الفرق بين تأسيسي أقل من 8 شقق وتأسيسي 8 شقق وما فوق؟",
    "شو الطقس اليوم؟",
]

with open("answers.txt", "w", encoding="utf-8") as f:
    for q in questions:
        r = httpx.post(URL, json={"message": q}, timeout=300)
        data = r.json()
        f.write("س: " + q + "\n")
        f.write("ج: " + str(data.get("answer")) + "\n")
        for s in data.get("sources", []):
            f.write("   مصدر: " + s["service"] + "\n")
        f.write("-" * 40 + "\n")
print("تم، افتح answers.txt")