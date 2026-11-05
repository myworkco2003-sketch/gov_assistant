# بيقرأ ملفات content/ ويحولها لقطع ويخزنها بقاعدة db/. شغّله كل ما عدّلت المحتوى.


import os
import pathlib
import re

import chromadb
import httpx

OLLAMA = os.getenv("OLLAMA_URL", "http://localhost:11434")
EMBED_MODEL = os.getenv("EMBED_MODEL", "bge-m3")
CONTENT_DIR = pathlib.Path("content")
MAX_CHARS = 1000


def embed(texts):
    r = httpx.post(
        f"{OLLAMA}/api/embed",
        json={"model": EMBED_MODEL, "input": texts},
        timeout=300,
    )
    r.raise_for_status()
    return r.json()["embeddings"]


def split_long(text):
    parts, cur = [], ""
    for line in text.split("\n"):
        if len(cur) + len(line) > MAX_CHARS and cur:
            parts.append(cur.strip())
            cur = ""
        cur += line + "\n"
    if cur.strip():
        parts.append(cur.strip())
    return parts


def parse(path):
    text = path.read_text(encoding="utf-8")
    m = re.search(r"^#\s+(.+)$", text, re.M)
    service = m.group(1).strip() if m else path.stem
    u = re.search(r"^آخر تحديث:\s*(\S+)", text, re.M)
    updated = u.group(1) if u else ""
    chunks = []
    for sec in re.split(r"^##\s+", text, flags=re.M)[1:]:
        title, _, body = sec.partition("\n")
        for part in split_long(body):
            if part:
                chunks.append((
                    f"{service} - {title.strip()}\n{part}",
                    {"service": service, "section": title.strip(),
                     "updated": updated, "file": path.name},
                ))
    return chunks


def main():
    client = chromadb.PersistentClient(path="db")
    try:
        client.delete_collection("services")
    except Exception:
        pass
    col = client.create_collection("services", metadata={"hnsw:space": "cosine"})

    ids, docs, metas = [], [], []
    for f in sorted(CONTENT_DIR.glob("*.md")):
        for i, (doc, meta) in enumerate(parse(f)):
            ids.append(f"{f.stem}-{i}")
            docs.append(doc)
            metas.append(meta)

    if not docs:
        print("no content found in content/")
        return

    for s in range(0, len(docs), 16):
        col.add(
            ids=ids[s:s + 16],
            documents=docs[s:s + 16],
            metadatas=metas[s:s + 16],
            embeddings=embed(docs[s:s + 16]),
        )
    print(len(docs), "chunks indexed")


if __name__ == "__main__":
    main()