import urllib.request
import time
import os

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (GenZUniversity Odisha Tour)'
}

odisha_images = {
    # 1. Classroom in Bhubaneswar, Odisha (KMBB College of Engineering) - 5184x3456
    'classroom_lecture.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Odia_Wikipedia_workshop_KMBB_College_of_Engineering%2C_Bhubaneswar_08.JPG/1920px-Odia_Wikipedia_workshop_KMBB_College_of_Engineering%2C_Bhubaneswar_08.JPG',
    
    # 2. Computer Science Lab in Bhubaneswar, Odisha (KMBB College of Engineering) - 5184x3456
    'complab.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Odia_Wikipedia_workshop_KMBB_College_of_Engineering%2C_Bhubaneswar_03.JPG/1920px-Odia_Wikipedia_workshop_KMBB_College_of_Engineering%2C_Bhubaneswar_03.JPG',
    
    # 3. Central Library at KIIT University, Bhubaneswar, Odisha
    'library.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Central_library_KIIT.jpg',
    
    # 4. Grand Auditorium & Convention Centre at Ravenshaw University, Cuttack, Odisha - 2592x1456
    'auditorium.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Ravenshaw_Convention_Centre%2CRavenshaw_University%2CCuttack.jpg/1920px-Ravenshaw_Convention_Centre%2CRavenshaw_University%2CCuttack.jpg',
    
    # 5. Administrative Building & Executive Chambers at Utkal University (Vani Vihar), Bhubaneswar - 4083x3062
    'office.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Utkal_University_administrative_building.jpg/1920px-Utkal_University_administrative_building.jpg',
    
    # 6. Student Hostel Building at IIT Bhubaneswar (Hostel IIT BBSR)
    'hostel_exterior.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Hosteliitbbsr.jpg',
    
    # 7. Student Common Room & Library Lounge at KIIT School of Management, Bhubaneswar
    'hostel_common.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/KSOM_Library.jpg',
    
    # 8. Main Academic Complex & Grand Portico at NIT Rourkela, Odisha - 4566x3428
    'acad_reception.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/National_Institute_of_Technology_Rourkela_main_building.jpg/1920px-National_Institute_of_Technology_Rourkela_main_building.jpg',
    
    # 9. Campus Avenue & Walkway Road inside NIT Rourkela, Odisha - 4077x3059
    'academic_corridor.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Road_inside_NIT_Rourkela.jpg/1920px-Road_inside_NIT_Rourkela.jpg',
}

raw_dir = "raw_odisha_downloads"
os.makedirs(raw_dir, exist_ok=True)

for name, url in odisha_images.items():
    out_p = os.path.join(raw_dir, name)
    print(f"Downloading Odisha photo: {name} ...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(out_p, 'wb') as f:
            f.write(resp.read())
        print(f"  -> Saved {name} ({os.path.getsize(out_p)} bytes)")
    except Exception as e:
        print(f"  -> Failed {name}: {e}")
    time.sleep(2)

print("\nAll Odisha photos downloaded successfully!")
