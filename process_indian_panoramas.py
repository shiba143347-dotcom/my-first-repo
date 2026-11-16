import os
import glob
from PIL import Image, ImageFilter
import numpy as np

W, H = 2048, 1024

def make_seamless_equirectangular(raw_path, out_path, feather=120):
    src = Image.open(raw_path).convert('RGB')
    sw, sh = src.size
    
    # Center sharp real photo preserving aspect ratio
    target_w = int(sw * (H / sh))
    if target_w > W:
        target_w = W
    sharp_resized = src.resize((target_w, H), Image.Resampling.LANCZOS)
    
    # Background ambient fill via seamless roll
    bg_base = src.resize((W, H), Image.Resampling.LANCZOS)
    bg_arr = np.array(bg_base, dtype=float)
    
    # Seam-blend via 180-deg roll
    shifted = np.roll(bg_arr, W // 2, axis=1)
    margin = 180
    mid = W // 2
    for i in range(margin):
        t = i / margin
        alpha = 0.5 * (1.0 - np.cos(np.pi * t))
        p1 = shifted[:, mid - margin + i, :].copy()
        p2 = shifted[:, mid + margin - 1 - i, :].copy()
        b = p1 * (1 - alpha) + p2 * alpha
        shifted[:, mid - margin + i, :] = b
        shifted[:, mid + margin - 1 - i, :] = b
    
    seamless_bg_arr = np.roll(shifted, -(W // 2), axis=1)
    seamless_bg = Image.fromarray(np.clip(seamless_bg_arr, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=18))
    
    canvas = seamless_bg.copy()
    
    mask = Image.new('L', (target_w, H), 255)
    for x in range(min(feather, target_w // 2)):
        t = x / feather
        alpha = int(255 * (3 * t**2 - 2 * t**3))
        for y in range(H):
            mask.putpixel((x, y), alpha)
            mask.putpixel((target_w - 1 - x, y), alpha)
            
    start_x = (W - target_w) // 2
    canvas.paste(sharp_resized, (start_x, 0), mask)
    
    # Exact seam match
    final_arr = np.array(canvas)
    final_arr[:, -1, :] = final_arr[:, 0, :]
    canvas = Image.fromarray(final_arr)
    
    diff = np.abs(final_arr[:, 0, :].astype(float) - final_arr[:, -1, :].astype(float))
    mean_diff = np.mean(diff)
    max_diff = np.max(diff)
    
    canvas.save(out_path, quality=95, subsampling=0)
    print(f"Processed Indian {os.path.basename(out_path)}: seam mean diff = {mean_diff:.2f}, max = {max_diff:.2f}")

raw_dir = "raw_indian_downloads"
out_dir = "public/panoramas"

for raw_file in sorted(glob.glob(f"{raw_dir}/*.jpg")):
    base_name = os.path.basename(raw_file)
    out_file = os.path.join(out_dir, base_name)
    make_seamless_equirectangular(raw_file, out_file)

print("\nAll Indian campus panoramas generated successfully!")
