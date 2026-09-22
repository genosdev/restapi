# ASSETS — GEN REST API

Author: GENOS

## File yang dibutuhkan

| File         | Fungsi                        | Wajib |
|--------------|-------------------------------|-------|
| `logo.png`   | FOTO yang muncul di loader    | tidak |
| `splash.mp4` | VIDEO yang muncul saat MULAI  | tidak |
| `favicon.svg`| Ikon tab browser              | tidak |

## Kalau file TIDAK ada

- `logo.png` → otomatis pakai SVG hexagon bawaan
- `splash.mp4` → otomatis pakai fallback teks "WELCOME / GEN REST API"

## Cara pakai

### Foto loader (logo.png)
1. Siapkan gambar PNG, background transparan lebih bagus.
2. Ukuran rekomendasi: **512x512** atau **1024x1024**.
3. Rename jadi `logo.png`, taruh di folder ini.
4. Foto akan muncul dengan efek aura gradient + pulse.

### Video splash (splash.mp4)
1. Siapkan video MP4 (H.264).
2. Resolusi: 1280x720 atau 1920x1080.
3. Durasi: 3–8 detik. Size: < 5 MB.
4. Rename jadi `splash.mp4`, taruh di folder ini.
5. Autoplay muted. Tombol SKIP muncul kanan bawah.
6. Timeout maks 12 detik → masuk dashboard.