# QSECURITY — Image Status & Remaining Generation (Higgsfield)

All images live in **`/public/qsecurity/`**. The page loads them from there; a missing file
falls back to a premium placeholder automatically (no code change). The old `/public/qsecimg/`
folder is superseded — you can ignore or delete it.

> The page applies its own warm vignette + thin gold frame over each photo, so generate
> **clean, natural, well-lit** images — do **not** tint them brown/gold or they'll double up.

---

## ✅ Wired now (Higgsfield set + 2 originals)

| Slot on page | File in `/public/qsecurity/` |
|---|---|
| Register step · Pain #1 (logbook) · MyKad-reader hardware | `register-nric.jpg` *(original, kept on request)* |
| Sentry section · Watch step · Pain #4 (CCTV) · Sentry-camera hardware | `sentry-cctv.jpg` *(original)* |
| Access step · Auto-Gate hardware | `qsc__0001_guard-turnstile.jpg` |
| Pain #2 (cards → face) · Verify step | `qsc__0000_faceid.jpg` |
| Who: Property & Condo | `qsc__0009_whos-property.jpg` |
| Who: Offices & Towers | `qsc__0008_whos-office.jpg` |
| Who: Factories & Worksites | `qsc__0007_whos-factory.jpg` |
| Who: Guarding & Facility firms | `qsc__0006_flow-customized.jpg` *(control-room shot — reused)* |
| Report step | `qsc__0005_flow-report.jpg` |
| Customized step | `qsc__0006_flow-customized.jpg` *(control room = multi-site command)* |
| Door-Lock hardware | `qsc__0002_hw-faceid.jpg` |
| Patrol step · Pain #3 (guard proof) · Guard tool "Geo-tagged photos" | `qsc__0004_guard-qr.jpg` *(it depicts a guard photographing a check-point — fits geo best)* |
| Guard tool "Panic / SOS" | `qsc__0003_guard-panic.jpg` |

**Note:** `qsc__0010_Background.jpg` came out **blank/white** — not used. See "Hero background" below.

---

## ⏳ Still to generate (2 placeholders left, both in the "On the ground" guard grid)

Save each at the **exact filename** in `/public/qsecurity/`, refresh `/qsecurity`, done.
Append the **Global style suffix** and use the **Negative prompt** (both below).

**`guard-qr-scan.jpg`** — aspect **landscape (16:9 / 3:2)** — *guard-tool "Dynamic, anti-spoof QR"*
```
Tight close-up in a dim building corridor at night: a security guard's hand holds a smartphone
right up to a small wall-mounted QR check-point tag, scanning it. The phone screen shows a
scanning frame over the QR code with a faint glow suggesting the code is refreshing (abstract,
no readable text). Cool fluorescent corridor light, shallow depth of field on the hand and the
tag, background falling into soft darkness. Precise, procedural mood.
[+ Global style suffix]
```

**`guard-occurrence.jpg`** — aspect **landscape (16:9 / 3:2)** — *guard-tool "Digital occurrence book"*
```
Inside a tidy guardhouse at night: a uniformed security officer sits at the desk logging an
incident on a rugged tablet — a simple digital form with an attached photo thumbnail and
time/location fields, kept soft and abstract (no legible text). A two-way radio and notebook
on the desk, a CCTV monitor glowing softly in the background. Warm desk lamp mixed with cool
monitor light. Diligent, end-of-shift calm. Medium close shot over the officer's shoulder.
[+ Global style suffix]
```

### Optional — Hero background (replaces the blank `0010`)
Currently the hero is a premium brown/gold gradient (looks good as-is). To put a photo behind it,
generate **`hero-bg.jpg`** (16:9, wide) and tell me — I'll wire it into the `Hero` layer.
```
A uniformed security guard standing in a sleek, dimly lit modern building lobby at dusk beside a
glowing face-ID turnstile, looking toward the entrance; cinematic, calm and authoritative, wide
establishing shot with negative space on one side for headline text.
[+ Global style suffix]
```

---

## Global style suffix (append to every prompt)
```
ultra realistic, photorealistic, hyper-detailed, shot on Sony A7 IV, 35mm f/1.4 lens,
natural available light, true-to-life skin tones and textures, sharp focus, high dynamic
range, professional commercial photography, subtle cinematic color grade, depth of field,
8k, no on-screen text, no captions, no watermark, no brand logos
```

## Negative prompt (use on every image)
```
cartoon, illustration, anime, 3d render, cgi, video-game, plastic skin, waxy, over-smooth,
distorted face, asymmetric eyes, extra fingers, deformed hands, mangled hardware, floating
objects, text, gibberish text, captions, watermark, logo, signage text, oversaturated, HDR
halos, harsh flash, fisheye, wide-angle distortion, low quality, blurry, jpeg artifacts
```

## Tips
- Keep faces **Malaysian / Southeast Asian**, generic (no real individuals).
- Keep any on-screen UI **soft/abstract** — AI renders fake interfaces badly; composite a real
  screenshot over `flow-report` / `guard-panic` later if you want legible dashboards.
- Two slots reuse images by design: **Who-Guarding** + **Customized** both use the control-room
  shot, and **Verify** reuses the face-ID scan. Generate dedicated versions anytime — just add the
  file and tell me the slot, or drop it at a new name and I'll point the slot to it.
