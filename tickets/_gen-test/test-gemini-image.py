import json, os, sys, base64, urllib.request, urllib.error

ENV = r"C:\Users\veria\AppData\Local\hermes\.env"
key = None
with open(ENV, encoding="utf-8", errors="ignore") as f:
    for line in f:
        line = line.strip()
        if line.startswith("GOOGLE_API_KEY"):
            key = line.split("=", 1)[1].strip().strip('"').strip("'")
            break
if not key:
    print("NO KEY FOUND")
    sys.exit(2)
print("key loaded, length", len(key), "(not printed)")

OUT = r"C:\Users\veria\Desktop\AI STUFF DIFFERENT AGENTS\amsterdam-nautic-cinematic\tickets\_gen-test"
os.makedirs(OUT, exist_ok=True)

models = ["gemini-2.5-flash-image", "gemini-3-pro-image-preview"]
prompt = ("Warm golden-hour Amsterdam canal with moored boats, painterly vintage "
          "travel-poster illustration, terracotta and teal palette, no text, no watermark")

ok = False
for model in models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }
    req = urllib.request.Request(
        url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            data = json.loads(r.read())
        img_b64 = None
        for cand in data.get("candidates", []):
            for part in cand.get("content", {}).get("parts", []):
                blob = part.get("inlineData") or part.get("inline_data") or {}
                if blob.get("data"):
                    img_b64 = blob["data"]
        if img_b64:
            p = os.path.join(OUT, model + ".png")
            with open(p, "wb") as f:
                f.write(base64.b64decode(img_b64))
            print(f"{model}: SUCCESS -> {p} ({os.path.getsize(p)} bytes)")
            ok = True
            break
        else:
            print(model, ": HTTP 200 but no image ->", json.dumps(data)[:400])
    except urllib.error.HTTPError as e:
        snippet = e.read().decode(errors="replace")[:400]
        print(f"{model}: HTTP {e.code} -> {snippet}")
    except Exception as e:
        print(f"{model}: {type(e).__name__}: {e}")

print("RESULT:", "GEMINI_IMAGE_OK" if ok else "GEMINI_IMAGE_FAILED")
sys.exit(0 if ok else 1)
