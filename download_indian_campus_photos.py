import urllib.request
import time
import os
from PIL import Image, ImageFilter
import numpy as np

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (GenZUniversity Virtual Campus Educational)'
}

indian_sources = {
    # 1. Indian College Classroom (Ramakrishna Mission Shikshanamandira - Benches, Blackboard, Ceiling Fans)
    'classroom_lecture.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Inside_of_the_classroom_of_Ramakrishna_Mission_Shikshanamandira_1.jpg',
    
    # 2. Indian University Central Library (Guru Nanak Dev University Library)
    'library.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Inside_view_of_the_Guru_Nanak_Dev_University_Library_18-02-09_1523.jpg',
    
    # 3. Indian College Computer Science Lab (St. Claret College Bangalore)
    'complab.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Computer_Lab_of_St._Claret_College%2C_Bangalore.jpg',
    
    # 4. Indian College Grand Auditorium & Seminar Hall (Badruka College of Commerce & Arts)
    'auditorium.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/21/Badruka_SeminarHall.jpg',
    
    # 5. Indian University Academic Reception & Atrium Lobby (WBNUJS National University Lobby)
    'acad_reception.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/First_Floor_Lobby_-_West_Bengal_National_University_of_Juridical_Sciences_-_Kolkata_20170806141230.jpg',
    
    # 6. Indian College & Hostel Corridor (Osmania University Grand Walkway Corridor)
    'hostel_corridor.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Connecting_corridor_in_Northern_wing_of_OU_college_of_arts.jpg',
    
    # 7. Indian Executive Office / Director / Principal Chamber
    'office.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Interior_of_SFLC_India_office.jpg',
    
    # 8. Indian Campus Two-Wheeler & Vehicle Parking (Bikes, Activas, Scooters)
    'parking.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/62/Two_wheeler_parking_lot_in_Chandigarh_India.jpg',
    
    # 9. Indian Campus Central Fountain Circle (NSIT Central Fountain)
    'fountain.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/11/NSIT_-_Central_fountain.jpg',
    
    # 10. Indian University Botanical Gardens & Green Park (Dr. B.R. Ambedkar Open University)
    'gardens.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/53/Lush_Garden_and_Pond_Inside_Dr._B.R._Ambedkar_Open_University_Campus%2C_Hyderabad.jpg',
    
    # 11. Campus Green Park (Shared lush lawn)
    'park_green.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/53/Lush_Garden_and_Pond_Inside_Dr._B.R._Ambedkar_Open_University_Campus%2C_Hyderabad.jpg',
}

W, H = 2048, 1024
raw_dir = "raw_indian_downloads"
out_dir = "public/panoramas"
os.makedirs(raw_dir, exist_ok=True)
os.makedirs(out_dir, exist_ok=True)

for name, url in indian_sources.items():
    raw_path = os.path.join(raw_dir, name)
    print(f"Downloading Indian photo: {name} ...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(raw_path, 'wb') as out_f:
            out_f.write(resp.read())
        print(f"Downloaded {name} successfully ({os.path.getsize(raw_path)} bytes)")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
    time.sleep(2) # courteous pause to avoid rate limit

print("\nAll downloads finished. Now processing into 360° panoramas...")
