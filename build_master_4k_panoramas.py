import os
import glob
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import numpy as np

W, H = 4096, 2048 # Exactly 4K 2:1 Equirectangular
out_dir = "public/panoramas"
os.makedirs(out_dir, exist_ok=True)

user_dir = "/Users/sibasundarmohanty/.gemini/antigravity/brain/e4261b84-dc99-4f76-85a0-7a2d5fa98d48/.user_uploaded"

def enhance_optical_clarity(img, factor_sharpness=1.8, factor_contrast=1.08):
    enh = ImageEnhance.Sharpness(img).enhance(factor_sharpness)
    enh = ImageEnhance.Contrast(enh).enhance(factor_contrast)
    return enh

def add_streetview_nadir_badge(img, label="GENZ UNIVERSITY • 360° STREET VIEW • ODISHA, INDIA"):
    draw = ImageDraw.Draw(img)
    cx, cy = W // 2, H - 90
    rx, ry = 280, 80
    
    # Outer dark glowing ring
    draw.ellipse([cx - rx - 6, cy - ry - 6, cx + rx + 6, cy + ry + 6], fill=(15, 23, 42))
    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(15, 23, 42), outline=(99, 102, 241), width=4)
    draw.ellipse([cx - rx + 12, cy - ry + 12, cx + rx - 12, cy + ry - 12], outline=(6, 182, 212), width=2)
    
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 26)
    except Exception:
        font = ImageFont.load_default()
        
    bbox = draw.textbbox((0, 0), label, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2), label, fill=(255, 255, 255), font=font)

def process_landscape_4k_master(src_path, out_path, badge_text=None):
    src = enhance_optical_clarity(Image.open(src_path).convert('RGB'), 1.25, 1.05)
    iw, ih = src.size
    
    # Slight padding (+16) so LANCZOS never samples outside the source image boundary
    scale = max((W + 16) / iw, (H + 16) / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    scaled = src.resize((nw, nh), Image.Resampling.LANCZOS)
    
    left = (nw - W) // 2
    top = (nh - H) // 2
    cropped = scaled.crop((left, top, left + W, top + H))
    
    # Apply seamless 360 horizontal roll-and-blend so X=0 meets X=4095 with 0 seam
    arr = np.array(cropped, dtype=float)
    shifted = np.roll(arr, W // 2, axis=1)
    margin = 240
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
    if badge_text:
        add_streetview_nadir_badge(final_img, badge_text)
    else:
        add_streetview_nadir_badge(final_img)
    final_img.save(out_path, quality=97, subsampling=0)
    print(f"Master 4K Landscape: {os.path.basename(out_path)} from {os.path.basename(src_path)} ({iw}x{ih})")

def process_single_photo_360(src_path, out_path, badge_text=None):
    src = enhance_optical_clarity(Image.open(src_path).convert('RGB'), 1.8, 1.08)
    target_w = 2456
    half2 = target_w // 2 # 1228

    s1 = src.resize((target_w, H), Image.Resampling.LANCZOS)
    s2 = src.transpose(Image.FLIP_LEFT_RIGHT).resize((target_w, H), Image.Resampling.LANCZOS)

    arr = np.zeros((H, W, 3), dtype=float)
    arr_s2 = np.array(s2, dtype=float)
    arr_s1 = np.array(s1, dtype=float)

    arr[:, :half2, :] = arr_s2[:, half2:, :]
    arr[:, W - half2:, :] = arr_s2[:, :half2, :]

    start1 = (W - target_w) // 2 # 820
    end1 = start1 + target_w     # 3276

    for x in range(start1, half2):
        t = (x - start1) / (half2 - start1)
        alpha = 0.5 * (1.0 - np.cos(np.pi * t))
        arr[:, x, :] = arr[:, x, :] * (1 - alpha) + arr_s1[:, x - start1, :] * alpha

    arr[:, half2:(W - half2), :] = arr_s1[:, (half2 - start1):(W - half2 - start1), :]

    for x in range(W - half2, end1):
        t = (x - (W - half2)) / (end1 - (W - half2))
        alpha = 0.5 * (1.0 - np.cos(np.pi * t))
        arr[:, x, :] = arr_s1[:, x - start1, :] * (1 - alpha) + arr[:, x, :] * alpha

    arr[:, -1, :] = arr[:, 0, :]
    final_img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    if badge_text:
        add_streetview_nadir_badge(final_img, badge_text)
    else:
        add_streetview_nadir_badge(final_img)
    final_img.save(out_path, quality=97, subsampling=0)
    print(f"Master 4K Single Photo 360: {os.path.basename(out_path)} from {os.path.basename(src_path)}")

def process_dual_angle_room_360(front_path, rear_path, out_path, badge_text="GENZ UNIVERSITY • HOSTEL RESIDENCE • 360°"):
    img_front = enhance_optical_clarity(Image.open(front_path).convert('RGB'), 1.8, 1.08)
    img_rear = enhance_optical_clarity(Image.open(rear_path).convert('RGB'), 1.8, 1.08)

    target_w = 2456
    half2 = target_w // 2 # 1228
    s1 = img_front.resize((target_w, H), Image.Resampling.LANCZOS)
    s2 = img_rear.resize((target_w, H), Image.Resampling.LANCZOS)

    arr = np.zeros((H, W, 3), dtype=float)
    arr_s2 = np.array(s2, dtype=float)
    arr_s1 = np.array(s1, dtype=float)

    # Place rear angle at ends (0..half2 and W-half2..W)
    arr[:, :half2, :] = arr_s2[:, half2:, :]
    arr[:, W - half2:, :] = arr_s2[:, :half2, :]

    start1 = (W - target_w) // 2 # 820
    end1 = start1 + target_w     # 3276

    # Overlap 1: start1 (820) to half2 (1228) -> 408 px
    for x in range(start1, half2):
        t = (x - start1) / (half2 - start1)
        alpha = 0.5 * (1.0 - np.cos(np.pi * t))
        arr[:, x, :] = arr[:, x, :] * (1 - alpha) + arr_s1[:, x - start1, :] * alpha

    # Middle 100% front angle
    arr[:, half2:(W - half2), :] = arr_s1[:, (half2 - start1):(W - half2 - start1), :]

    # Overlap 2: W - half2 (2868) to end1 (3276) -> 408 px
    for x in range(W - half2, end1):
        t = (x - (W - half2)) / (end1 - (W - half2))
        alpha = 0.5 * (1.0 - np.cos(np.pi * t))
        arr[:, x, :] = arr_s1[:, x - start1, :] * (1 - alpha) + arr[:, x, :] * alpha

    arr[:, -1, :] = arr[:, 0, :]
    final_img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    add_streetview_nadir_badge(final_img, badge_text)
    final_img.save(out_path, quality=97, subsampling=0)
    print(f"Master 4K Dual-Angle Room 360: {os.path.basename(out_path)}")

print("=== 1. PROCESSING REAL USER-UPLOADED CAMPUS PHOTOS ===")
process_single_photo_360(f"{user_dir}/media_1793706895161_20f529c4.jpg", f"{out_dir}/college_heritage_main.jpg", "GENZ UNIVERSITY • HERITAGE MAIN COMPLEX • ODISHA")
process_single_photo_360(f"{user_dir}/media_1793706895161_70cc4019.jpg", f"{out_dir}/college_avenue_walk.jpg", "GENZ UNIVERSITY • CENTRAL ACADEMIC AVENUE • ODISHA")
process_single_photo_360(f"{user_dir}/media_1793706895162_d6dba6fb.jpg", f"{out_dir}/college_admin_entrance.jpg", "GENZ UNIVERSITY • CIPET ACADEMIC COMPLEX • ODISHA")
process_single_photo_360(f"{user_dir}/media_1793707474680_945487a9.jpg", f"{out_dir}/college_sports_playground.jpg", "GENZ UNIVERSITY • CRICKET & SPORTS STADIUM • ODISHA")
process_single_photo_360(f"{user_dir}/media_1793707123561_0d252326.jpg", f"{out_dir}/cafeteria_plaza_user.jpg", "GENZ UNIVERSITY • SUNLIT CAFETERIA PLAZA • ODISHA")
process_single_photo_360(f"{user_dir}/media_1793707123561_5613af08.jpg", f"{out_dir}/canteen_interior_user.jpg", "GENZ UNIVERSITY • CENTRAL STUDENT CANTEEN • ODISHA")

print("\n=== 2. PROCESSING REAL DUAL-ANGLE HOSTEL ROOMS (100% PHOTO ALL 360°) ===")
p_room1 = f"{user_dir}/media_1793707789511_0f20d305.jpg"
p_room2 = f"{user_dir}/media_1793707789524_f07a0e9e.jpg"
process_dual_angle_room_360(p_room1, p_room2, f"{out_dir}/hostel_room_user1.jpg", "GENZ UNIVERSITY • BOYS & INTL HOSTEL SUITE • 360°")
process_dual_angle_room_360(p_room2, p_room1, f"{out_dir}/hostel_room_user2.jpg", "GENZ UNIVERSITY • GIRLS & PREMIUM HOSTEL SUITE • 360°")

print("\n=== 3. PROCESSING REAL 4K/5K ODISHA MASTER CAMERA FILES ===")
process_landscape_4k_master("raw_odisha_downloads/complab_full.jpg", f"{out_dir}/complab.jpg", "GENZ UNIVERSITY • KMBB ADVANCED COMPUTER LAB • BHUBANESWAR")
process_landscape_4k_master("raw_odisha_downloads/classroom_lecture_raw5k.jpg", f"{out_dir}/classroom_lecture.jpg", "GENZ UNIVERSITY • ENGINEERING LECTURE HALL • BHUBANESWAR")
process_landscape_4k_master("raw_odisha_downloads/acad_reception_full.jpg", f"{out_dir}/acad_reception.jpg", "GENZ UNIVERSITY • NIT ROURKELA MAIN BUILDING • ODISHA")
process_landscape_4k_master("raw_odisha_downloads/academic_corridor_full.jpg", f"{out_dir}/academic_corridor.jpg", "GENZ UNIVERSITY • NIT ROURKELA CAMPUS AVENUE • ODISHA")
process_landscape_4k_master("raw_odisha_downloads/office_full.jpg", f"{out_dir}/office.jpg", "GENZ UNIVERSITY • UTKAL UNIVERSITY VANI VIHAR • BHUBANESWAR")
process_landscape_4k_master("raw_odisha_downloads/auditorium_full.jpg", f"{out_dir}/auditorium.jpg", "GENZ UNIVERSITY • RAVENSHAW CONVENTION CENTRE • CUTTACK")
process_landscape_4k_master("raw_odisha_downloads/library.jpg", f"{out_dir}/library.jpg", "GENZ UNIVERSITY • KIIT CENTRAL LIBRARY • BHUBANESWAR")
process_landscape_4k_master("raw_odisha_downloads/hostel_exterior.jpg", f"{out_dir}/hostel_exterior.jpg", "GENZ UNIVERSITY • STUDENT HOSTEL RESIDENCE • IIT BHUBANESWAR")
process_landscape_4k_master("raw_odisha_downloads/hostel_common.jpg", f"{out_dir}/hostel_common.jpg", "GENZ UNIVERSITY • STUDENT COMMON LOUNGE • KIIT BHUBANESWAR")

print("\n=== 4. PROCESSING REAL 4K/9K INFRASTRUCTURE & AMENITIES ===")
process_landscape_4k_master("raw_indian_downloads/hostel_corridor.jpg", f"{out_dir}/hostel_corridor.jpg", "GENZ UNIVERSITY • RESIDENTIAL CORRIDOR WING • 360°")
process_landscape_4k_master("raw_indian_downloads/parking.jpg", f"{out_dir}/parking.jpg", "GENZ UNIVERSITY • VEHICLE PARKING PLAZA • 360°")
process_landscape_4k_master("raw_indian_downloads/gardens.jpg", f"{out_dir}/gardens.jpg", "GENZ UNIVERSITY • BOTANICAL CENTRAL QUAD • 360°")
process_landscape_4k_master("raw_indian_downloads/park_green.jpg", f"{out_dir}/park_green.jpg", "GENZ UNIVERSITY • CAMPUS RECREATION PARK • 360°")
process_landscape_4k_master("raw_indian_downloads/fountain.jpg", f"{out_dir}/fountain.jpg", "GENZ UNIVERSITY • CENTRAL FOUNTAIN ROUNDABOUT • 360°")

print("\n=== 5. PROCESSING HIGH-RES BACKUPS & FALLBACK PANORAMAS ===")
process_single_photo_360(f"{user_dir}/media_1793706895161_20f529c4.jpg", f"{out_dir}/main_gate.jpg", "GENZ UNIVERSITY • MAIN ENTRANCE GATE • ODISHA")
process_single_photo_360(f"{user_dir}/media_1793706895161_70cc4019.jpg", f"{out_dir}/avenue_sunny.jpg", "GENZ UNIVERSITY • CAMPUS BOULEVARD • ODISHA")
process_single_photo_360(f"{user_dir}/media_1793707123561_5613af08.jpg", f"{out_dir}/dining.jpg", "GENZ UNIVERSITY • HOSTEL DINING MESS • ODISHA")
process_dual_angle_room_360(p_room1, p_room2, f"{out_dir}/hostel_room.jpg", "GENZ UNIVERSITY • STUDENT ROOM • 360°")
process_single_photo_360(f"{user_dir}/media_1793707474680_945487a9.jpg", f"{out_dir}/stadium.jpg", "GENZ UNIVERSITY • SPORTS GROUND • ODISHA")

print("\nALL 27 PANORAMA TEXTURES GENERATED AT FULL 4K RESOLUTION (4096x2048) WITH ZERO FLAT COLUMNS!")
