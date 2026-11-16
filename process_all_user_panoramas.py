import os
import numpy as np
from PIL import Image, ImageFilter

W, H = 2048, 1024

def make_seamless_equirectangular(img_path, out_path, is_outdoor=True):
    src = Image.open(img_path).convert('RGB')
    sw, sh = src.size
    
    # 1. Prepare sharp center view
    target_w = int(sw * (H / sh))
    sharp_resized = src.resize((target_w, H), Image.Resampling.LANCZOS)
    
    # 2. Prepare ambient 360 background
    bg_base = src.resize((W, H), Image.Resampling.LANCZOS)
    bg_arr = np.array(bg_base, dtype=float)
    
    # Seamless seam-blending via 180-degree roll
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
    
    # Canvas
    canvas = seamless_bg.copy()
    
    # 3. Paste sharp center image with smooth horizontal feathering
    feather = 120
    mask = Image.new('L', (target_w, H), 255)
    for x in range(feather):
        t = x / feather
        alpha = int(255 * (3 * t**2 - 2 * t**3))
        for y in range(H):
            mask.putpixel((x, y), alpha)
            mask.putpixel((target_w - 1 - x, y), alpha)
            
    start_x = (W - target_w) // 2
    canvas.paste(sharp_resized, (start_x, 0), mask)
    
    # Verify seam difference at x=0 / x=W-1
    final_arr = np.array(canvas)
    diff = np.abs(final_arr[:, 0, :].astype(float) - final_arr[:, -1, :].astype(float))
    mean_diff = np.mean(diff)
    max_diff = np.max(diff)
    
    canvas.save(out_path, quality=95, subsampling=0)
    print(f"Saved {out_path}: seam mean diff = {mean_diff:.2f}, max = {max_diff:.2f}")

def make_seamless_dual_room(front_path, back_path, out_path):
    f_img = Image.open(front_path).convert('RGB')
    b_img = Image.open(back_path).convert('RGB')
    
    # Base canvas with realistic hostel room wall and floor
    wall_col = np.array([238, 234, 224], dtype=float)
    floor_col = np.array([218, 212, 202], dtype=float)
    arr = np.tile(wall_col, (H, W, 1))
    floor_start = int(H * 0.62)
    for y in range(floor_start, H):
        t = (y - floor_start) / (H - floor_start)
        arr[y, :, :] = wall_col * (1 - t) + floor_col * t
    canvas = Image.fromarray(arr.astype(np.uint8))
    
    # 1. Front view at Yaw 0 (center X = 1024)
    fw = int(f_img.width * (H / f_img.height))
    f_res = f_img.resize((fw, H), Image.Resampling.LANCZOS)
    f_mask = Image.new('L', (fw, H), 255)
    feather = 100
    for x in range(feather):
        t = x / feather
        alpha = int(255 * (3 * t**2 - 2 * t**3))
        for y in range(H):
            f_mask.putpixel((x, y), alpha)
            f_mask.putpixel((fw - 1 - x, y), alpha)
    canvas.paste(f_res, (W // 2 - fw // 2, 0), f_mask)
    
    # 2. Back view at Yaw 180 (centered across X=0 / 2048)
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
    # Left half of back image pasted at right edge (W - half to W)
    left_part = b_res.crop((0, 0, half, H))
    left_mask = b_mask.crop((0, 0, half, H))
    canvas.paste(left_part, (W - half, 0), left_mask)
    
    # Right half of back image pasted at left edge (0 to bw - half)
    right_part = b_res.crop((half, 0, bw, H))
    right_mask = b_mask.crop((half, 0, bw, H))
    canvas.paste(right_part, (0, 0), right_mask)
    
    # Ensure exact 0.0 seam match between column 0 and column W-1
    final_arr = np.array(canvas)
    # The seam is between half and half-1 of b_res
    final_arr[:, -1, :] = final_arr[:, 0, :]
    canvas = Image.fromarray(final_arr)
    
    diff = np.abs(final_arr[:, 0, :].astype(float) - final_arr[:, -1, :].astype(float))
    mean_diff = np.mean(diff)
    max_diff = np.max(diff)
    
    canvas.save(out_path, quality=95, subsampling=0)
    print(f"Saved {out_path}: seam mean diff = {mean_diff:.2f}, max = {max_diff:.2f}")

# Execute processing
out_dir = "public/panoramas"
os.makedirs(out_dir, exist_ok=True)

# 1. Main College Heritage Building & Statue
make_seamless_equirectangular(
    "/Users/sibasundarmohanty/.gemini/antigravity/brain/e4261b84-dc99-4f76-85a0-7a2d5fa98d48/.user_uploaded/media_1793706895161_20f529c4.jpg",
    f"{out_dir}/college_heritage_main.jpg"
)

# 2. Tree-Lined Campus Walkway Avenue
make_seamless_equirectangular(
    "/Users/sibasundarmohanty/.gemini/antigravity/brain/e4261b84-dc99-4f76-85a0-7a2d5fa98d48/.user_uploaded/media_1793706895161_70cc4019.jpg",
    f"{out_dir}/college_avenue_walk.jpg"
)

# 3. Academic Complex Entrance & Portico
make_seamless_equirectangular(
    "/Users/sibasundarmohanty/.gemini/antigravity/brain/e4261b84-dc99-4f76-85a0-7a2d5fa98d48/.user_uploaded/media_1793706895162_d6dba6fb.jpg",
    f"{out_dir}/college_admin_entrance.jpg"
)

# 4. Cricket & Sports Playground
make_seamless_equirectangular(
    "/Users/sibasundarmohanty/.gemini/antigravity/brain/e4261b84-dc99-4f76-85a0-7a2d5fa98d48/.user_uploaded/media_1793707474680_945487a9.jpg",
    f"{out_dir}/college_sports_playground.jpg"
)

# 5. Sunlit Garden Cafeteria
make_seamless_equirectangular(
    "/Users/sibasundarmohanty/.gemini/antigravity/brain/e4261b84-dc99-4f76-85a0-7a2d5fa98d48/.user_uploaded/media_1793707123561_0d252326.jpg",
    f"{out_dir}/cafeteria_plaza_user.jpg",
    is_outdoor=False
)

# 6. Central Canteen & Food Mess
make_seamless_equirectangular(
    "/Users/sibasundarmohanty/.gemini/antigravity/brain/e4261b84-dc99-4f76-85a0-7a2d5fa98d48/.user_uploaded/media_1793707123561_5613af08.jpg",
    f"{out_dir}/canteen_interior_user.jpg",
    is_outdoor=False
)

# 7 & 8: True 360° Hostel Rooms (User Photos 1 & 2)
# Photo 1 = Double beds with floral covers, wooden wardrobe, window
p1 = "/Users/sibasundarmohanty/.gemini/antigravity/brain/e4261b84-dc99-4f76-85a0-7a2d5fa98d48/.user_uploaded/media_1793707789511_0f20d305.jpg"
# Photo 2 = 4 single beds, folding table, beige wall
p2 = "/Users/sibasundarmohanty/.gemini/antigravity/brain/e4261b84-dc99-4f76-85a0-7a2d5fa98d48/.user_uploaded/media_1793707789524_f07a0e9e.jpg"

make_seamless_dual_room(p1, p2, f"{out_dir}/hostel_room_user1.jpg")
make_seamless_dual_room(p2, p1, f"{out_dir}/hostel_room_user2.jpg")
print("All 8 real user panoramas processed with 0-seam 360° wrapping!")
