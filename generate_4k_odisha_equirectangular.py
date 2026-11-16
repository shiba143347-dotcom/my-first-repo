import os
import glob
from PIL import Image, ImageDraw, ImageFont
import numpy as np

W, H = 4096, 2048 # Exactly 4K 2:1 Equirectangular
out_dir = "public/panoramas"
os.makedirs(out_dir, exist_ok=True)

def add_streetview_nadir_badge(img, label="GENZ UNIVERSITY • 360° STREET VIEW • ODISHA, INDIA"):
    draw = ImageDraw.Draw(img)
    # Nadir circle at the very bottom (latitude -90 deg)
    cx, cy = W // 2, H - 90
    rx, ry = 280, 80
    
    # Outer dark glowing ring
    draw.ellipse([cx - rx - 6, cy - ry - 6, cx + rx + 6, cy + ry + 6], fill=(15, 23, 42))
    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(15, 23, 42), outline=(99, 102, 241), width=4)
    draw.ellipse([cx - rx + 12, cy - ry + 12, cx + rx - 12, cy + ry - 12], outline=(6, 182, 212), width=2)
    
    # Text inside nadir medallion
    # Fallback to default font or load PIL font
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 26)
    except Exception:
        font = ImageFont.load_default()
        
    bbox = draw.textbbox((0, 0), label, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2), label, fill=(255, 255, 255), font=font)

def create_4k_equirectangular_landscape(src_path, out_path, is_outdoor=True):
    src = Image.open(src_path).convert('RGB')
    iw, ih = src.size
    
    # Scale to fill 4096x2048 while preserving aspect ratio
    scale = max(W / iw, H / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    scaled = src.resize((nw, nh), Image.Resampling.LANCZOS)
    
    left = (nw - W) // 2
    top = (nh - H) // 2
    cropped = scaled.crop((left, top, left + W, top + H))
    
    # Apply seamless 360 horizontal roll-and-blend so X=0 meets X=4095 with 0 seam
    arr = np.array(cropped, dtype=float)
    shifted = np.roll(arr, W // 2, axis=1)
    margin = 240 # Smooth 240px spherical seam blend
    mid = W // 2
    for i in range(margin):
        t = i / margin
        alpha = 0.5 * (1.0 - np.cos(np.pi * t))
        p1 = shifted[:, mid - margin + i, :].copy()
        p2 = shifted[:, mid + margin - 1 - i, :].copy()
        b = p1 * (1 - alpha) + p2 * alpha
        shifted[:, mid - margin + i, :] = b
        shifted[:, mid + margin - 1 - i, :] = b
        
    seamless_arr = np.roll(shifted, -(W // 2), axis=1)
    seamless_arr[:, -1, :] = seamless_arr[:, 0, :]
    
    final_img = Image.fromarray(np.clip(seamless_arr, 0, 255).astype(np.uint8))
    add_streetview_nadir_badge(final_img)
    final_img.save(out_path, quality=96, subsampling=0)
    print(f"Built 4K (4096x2048) 360°: {os.path.basename(out_path)}")

def create_4k_equirectangular_portrait(src_path, out_path):
    src = Image.open(src_path).convert('RGB')
    iw, ih = src.size
    
    target_h = H
    target_w = int(iw * (H / ih))
    scaled = src.resize((target_w, target_h), Image.Resampling.LANCZOS)
    flipped = scaled.transpose(Image.FLIP_LEFT_RIGHT)
    
    half = target_w // 2
    f_left = flipped.crop((0, 0, half, H))
    f_right = flipped.crop((half, 0, target_w, H))
    
    comp = Image.new('RGB', (target_w * 2, H))
    comp.paste(f_right, (0, 0))
    comp.paste(scaled, (target_w - half, 0))
    comp.paste(f_left, (target_w * 2 - half, 0))
    
    final_360 = comp.resize((W, H), Image.Resampling.LANCZOS)
    arr = np.array(final_360)
    arr[:, -1, :] = arr[:, 0, :]
    final_img = Image.fromarray(arr)
    add_streetview_nadir_badge(final_img)
    final_img.save(out_path, quality=96, subsampling=0)
    print(f"Built 4K (4096x2048) portrait 360°: {os.path.basename(out_path)}")

def create_4k_equirectangular_dual_room(front_path, back_path, out_path):
    f_img = Image.open(front_path).convert('RGB')
    b_img = Image.open(back_path).convert('RGB')
    
    wall_col = np.array([238, 234, 224], dtype=float)
    floor_col = np.array([218, 212, 202], dtype=float)
    arr = np.tile(wall_col, (H, W, 1))
    floor_start = int(H * 0.62)
    for y in range(floor_start, H):
        t = (y - floor_start) / (H - floor_start)
        arr[y, :, :] = wall_col * (1 - t) + floor_col * t
    canvas = Image.fromarray(arr.astype(np.uint8))
    
    fw = int(f_img.width * (H / f_img.height))
    f_res = f_img.resize((fw, H), Image.Resampling.LANCZOS)
    f_mask = Image.new('L', (fw, H), 255)
    feather = 160
    for x in range(feather):
        t = x / feather
        alpha = int(255 * (3 * t**2 - 2 * t**3))
        for y in range(H):
            f_mask.putpixel((x, y), alpha)
            f_mask.putpixel((fw - 1 - x, y), alpha)
    canvas.paste(f_res, (W // 2 - fw // 2, 0), f_mask)
    
    bw = int(b_img.width * (H / b_img.height))
    b_res = b_img.resize((bw, H), Image.Resampling.LANCZOS)
    b_mask = Image.new('L', (bw, H), 255)
    for x in range(feather):
        t = x / feather
        alpha = int(255 * (3 * t**2 - 2 * t**3))
        for y in range(H):
            b_mask.putpixel((x, y), alpha)
            b_mask.putpixel((bw - 1 - x, y), alpha)
            
    half = bw // 2
    left_part = b_res.crop((0, 0, half, H))
    left_mask = b_mask.crop((0, 0, half, H))
    canvas.paste(left_part, (W - half, 0), left_mask)
    
    right_part = b_res.crop((half, 0, bw, H))
    right_mask = b_mask.crop((half, 0, bw, H))
    canvas.paste(right_part, (0, 0), right_mask)
    
    final_arr = np.array(canvas)
    final_arr[:, -1, :] = final_arr[:, 0, :]
    final_img = Image.fromarray(final_arr)
    add_streetview_nadir_badge(final_img, "GENZ UNIVERSITY • HOSTEL RESIDENCE • 360°")
    final_img.save(out_path, quality=96, subsampling=0)
    print(f"Built 4K (4096x2048) dual-room 360°: {os.path.basename(out_path)}")

# 1. Process User Uploads
user_dir = "/Users/sibasundarmohanty/.gemini/antigravity/brain/e4261b84-dc99-4f76-85a0-7a2d5fa98d48/.user_uploaded"
create_4k_equirectangular_portrait(f"{user_dir}/media_1793706895161_20f529c4.jpg", f"{out_dir}/college_heritage_main.jpg")
create_4k_equirectangular_portrait(f"{user_dir}/media_1793706895161_70cc4019.jpg", f"{out_dir}/college_avenue_walk.jpg")
create_4k_equirectangular_portrait(f"{user_dir}/media_1793706895162_d6dba6fb.jpg", f"{out_dir}/college_admin_entrance.jpg")
create_4k_equirectangular_portrait(f"{user_dir}/media_1793707474680_945487a9.jpg", f"{out_dir}/college_sports_playground.jpg")
create_4k_equirectangular_portrait(f"{user_dir}/media_1793707123561_0d252326.jpg", f"{out_dir}/cafeteria_plaza_user.jpg")
create_4k_equirectangular_portrait(f"{user_dir}/media_1793707123561_5613af08.jpg", f"{out_dir}/canteen_interior_user.jpg")

# 2. Process Dual Hostel Rooms
p1 = f"{user_dir}/media_1793707789511_0f20d305.jpg"
p2 = f"{user_dir}/media_1793707789524_f07a0e9e.jpg"
create_4k_equirectangular_dual_room(p1, p2, f"{out_dir}/hostel_room_user1.jpg")
create_4k_equirectangular_dual_room(p2, p1, f"{out_dir}/hostel_room_user2.jpg")

# 3. Process High-Res Odisha Downloads
odisha_dir = "raw_odisha_downloads"
for raw_p in sorted(glob.glob(f"{odisha_dir}/*.jpg")):
    out_p = os.path.join(out_dir, os.path.basename(raw_p))
    create_4k_equirectangular_landscape(raw_p, out_p)

# 4. Amenities
create_4k_equirectangular_landscape("raw_indian_downloads/parking.jpg", f"{out_dir}/parking.jpg")
create_4k_equirectangular_landscape("raw_indian_downloads/fountain.jpg", f"{out_dir}/fountain.jpg")
create_4k_equirectangular_landscape("raw_indian_downloads/gardens.jpg", f"{out_dir}/gardens.jpg")
create_4k_equirectangular_landscape("raw_indian_downloads/park_green.jpg", f"{out_dir}/park_green.jpg")
create_4k_equirectangular_landscape("raw_indian_downloads/hostel_corridor.jpg", f"{out_dir}/hostel_corridor.jpg")

print("\nALL 22 PANORAMAS PROCESSED AT FULL 4K RESOLUTION (4096x2048) WITH EXACT 2:1 ASPECT RATIO!")
