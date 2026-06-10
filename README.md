# PhySound Acoustics Data+Cal+Visualizer GitHub v5

เวอร์ชันนี้เพิ่ม **Sound Wave Visualizer** แบบ Observation Mode ตามแนวคิดของครู: แอปแสดงภาพจำลองและให้ปรับค่าพารามิเตอร์เท่านั้น แต่ไม่ใส่ข้อความชี้นำ และไม่สรุปความสัมพันธ์ให้นักเรียน

## สิ่งที่เพิ่มใน v5

- Sound Wave Visualizer
- Longitudinal Wave
- Pressure Variation
- Displacement + Pressure
- Longitudinal / Transverse Compare
- Superposition
- Beats Visualizer
- Standing Wave in Air Column
- Resonance Visualizer
- Harmonics / Timbre
- Doppler Visualizer
- Play / Pause / Reset
- Export Visualizer Image เป็น PNG

## หลักคิด

แอปทำหน้าที่:
- แสดงภาพจำลองให้สังเกต
- ให้ปรับค่าพารามิเตอร์พื้นฐาน
- เก็บข้อมูลเสียงจริง
- ตรวจสอบความคลาดเคลื่อนของอุปกรณ์
- ส่งออกข้อมูลดิบและภาพกราฟ

แอปไม่ทำ:
- ชี้นำประเด็นแทนครู
- สรุปผลให้นักเรียน
- ทำ Dashboard วิเคราะห์กลุ่ม
- ทำ Report Pack อัตโนมัติ

## วิธีอัป GitHub Pages

อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น repository แล้วเปิด Settings → Pages → Deploy from branch → main / root


## v5.1 Clean Home

- ลบข้อความส่วน Hero หน้าแรกออก
- หน้าแรกเน้นการ์ดเมนูเป็นหลัก


## v5.2 Bilingual Menu

- ปรับชื่อเมนูเป็น 2 ภาษา
- ใช้รูปแบบ English (ภาษาไทย)


## v5.3 Axes and Units

- เพิ่มชื่อแกนและหน่วยในหน้า Sound Wave Visualizer ทุกโหมด
- ใช้หน่วยเชิงแนวคิด เช่น position x (m), amplitude (arb. unit), frequency f (Hz), time t (s)


## v5.4 Relative Units

- เปลี่ยนข้อความหน่วยจาก arb. unit เป็น relative / relative amplitude / relative response เพื่อให้นักเรียนเข้าใจง่ายขึ้น


## v5.5 Observation Point

- เพิ่มจุดสังเกตสีเด่นในหน้า Wave Visualizer หลายโหมด
- ใช้สีชมพู/แดงเป็น highlighted observation point
- เพิ่ม label ชี้ตำแหน่งเพื่อให้นักเรียนติดตามการเคลื่อนที่หรือเปรียบเทียบตำแหน่งได้ง่ายขึ้น


## v5.6 Clean Visualizer Text

- ลบข้อความอธิบายใต้หัวข้อ Sound Wave Visualizer
- ลบข้อความ note ในกล่อง Parameters


## v5.7 Clean Measure

- ซ่อนข้อความสถานะไมโครโฟนในหน้า Measure ให้แสดงเฉพาะเมื่อเกิด error
- ลบตัวเลือก Student/Teacher Mode ออกจากหน้า Measure เพื่อลดความรก


## v5.8 Clean Home Header

- ลบคำว่า Data+Cal+Visualizer ออกจากแถบหัวเว็บ
- ลบเมนูตัวอักษรด้านบนทั้งหมด
- ปรับหน้าแรกให้เน้นแสดงการ์ดเมนูหลักใน 1 หน้าจอมากขึ้น


## v5.9 Phyphox Pages

- หน้าแรกแสดงเฉพาะการ์ดหัวข้อใหญ่
- กดหัวข้อแล้วเปิดหน้า HTML แยกของหัวข้อนั้น
- หน้ารายละเอียดซ่อนหัวข้ออื่นทั้งหมด
- มีปุ่มย้อนกลับ และใช้ปุ่มย้อนกลับของโทรศัพท์/เบราว์เซอร์ได้


## v5.10 Embedded Export

- เอา Session ออกจากหน้าแรกและลบ session.html
- เพิ่ม Data Export ในหน้าทดลองย่อย
- ข้อมูลที่บันทึกและส่งออกเป็นข้อมูลเฉพาะของหน้านั้น ๆ


## v5.11 Topic-by-Topic Workflow

- เน้นการใช้งานทีละหัวข้อ
- หน้าแรกไม่มี Session แยกกลาง
- แต่ละหน้าทดลองมี Data Export ของตัวเอง
- ไฟล์ CSV ที่ส่งออกใช้ข้อมูลเฉพาะหัวข้อนั้น
- Measure และ Calibration ยังคงใช้ระบบส่งออกเฉพาะหน้าของตนเอง


## v5.12 Mobile-fit Home

- ปรับหน้าแรกบนมือถือเป็น 2 คอลัมน์แบบ compact card
- ให้ 7 หัวข้อหลักแสดงครบในหน้าจอมือถือมากขึ้นโดยไม่ต้องเลื่อน
- ลดความสูงการ์ด ไอคอน และคำอธิบายเฉพาะหน้าแรก
- จอเตี้ยมากจะซ่อน note หรือ description อัตโนมัติเพื่อให้หัวข้อครบ


## v5.13 MelodyLab Branding

- เปลี่ยนชื่อแอปเป็น MelodyLab
- เพิ่ม tagline: ห้องทดลองเสียงและเก็บข้อมูล ด้วยมือถือ
- ปรับ title, meta description และ manifest ให้ตรงกับชื่อใหม่


## v5.14 Orientation Consistent

- ปรับหน้าแรกมือถือให้แนวตั้ง/แนวนอนใช้ layout เดียวกันมากขึ้น
- ยกเลิกกติกาที่ซ่อน note/description ตามความสูงจอ เพราะทำให้แสดงผลไม่ตรงกัน
- เพิ่มการ redraw หลังหมุนจอ เพื่อให้ canvas/visualizer แสดงผลสม่ำเสมอขึ้น
- ตั้ง manifest orientation เป็น any


## v5.15 Clean Home Text

- ลบ footer ข้อความเก่าออกจากทุกหน้า
- ลบแถบข้อความ workflow ในหน้าแรก


## v5.16 Home 1 Column

- ปรับหน้า Home จากการ์ดหลายคอลัมน์เป็น 1 คอลัมน์เรียงลงมา
- เน้นให้อ่านง่ายและกดง่ายบนมือถือ


## v5.17 Visualizer Subpages

- ปรับหน้า Wave Visualizer ให้เป็นรายการหัวข้อย่อยแบบหน้า Home
- กดหัวข้อย่อยแล้วเปิดหน้าใหม่เฉพาะภาพจำลองหัวข้อนั้น
- แต่ละหน้าแสดงเฉพาะเนื้อหาของหัวข้อนั้น ไม่แสดงหัวข้อย่อยอื่นปน


## v5.18 Visualizer Video Controls

- ย้ายปุ่ม เล่น / หยุด / รีเซ็ต / บันทึกภาพ PNG เข้าไปอยู่ในกรอบของแต่ละหัวข้อย่อย Visualizer
- จัดรูปแบบปุ่มเป็นแถบควบคุมแบบปุ่มเล่นวิดีโอ


## v5.19 Visualizer Player Bar

- ปรับปุ่มควบคุม Visualizer ให้เป็นแถบ player มากขึ้น
- จัดรูปแบบเป็น media control bar พร้อมปุ่ม play ใหญ่ตรงกลาง
- ปุ่ม reset/pause เป็นปุ่มวงกลม และปุ่ม PNG เป็น utility button แยกด้านขวา


## v5.19.2 Final Player Styling

- ปรับ player bar ของ Visualizer ให้เหมือน media player มากขึ้น
- จัดปุ่มใน bar ให้มี play button เด่นตรงกลาง และ progress-like track ด้านล่าง


## v5.20 Visualizer Icon-only Player

- ปรับปุ่มควบคุม Visualizer ให้เป็นไอคอนล้วน ไม่มีข้อความ
- คงรูปแบบแถบ player bar ไว้ แต่ลดความรกของ UI


## v5.21 Visualizer Portrait-Landscape Optimized

- ปรับหน้า Visualizer ให้เหมาะทั้งแนวตั้งและแนวนอนมากขึ้น
- แนวตั้ง: main visualizer อยู่บน player bar อยู่ใต้กราฟ และพารามิเตอร์จัด 2 คอลัมน์
- แนวนอน: main visualizer อยู่ซ้าย พารามิเตอร์อยู่ขวา ขยายพื้นที่ภาพจำลอง
- เพิ่มการ resize canvas ตาม orientation และ redraw หลังหมุนจอ


## v5.22 Fix Visualizer Menu

- แก้หน้า Wave Visualizer ให้แสดงหัวข้อย่อยครบ
- หัวข้อย่อยเรียงเป็นรายการเหมือนหน้า Home
- กดแล้วเข้า visualizer subpage ของหัวข้อนั้น


## v5.23 Longitudinal Cleanup

- เอา Mode Setting ออกจากหน้า Longitudinal Wave
- ลบข้อความ 'เฉพาะหัวข้อนี้' ออกจากหน้า Longitudinal Wave
- ย้ายปุ่มบันทึกภาพ PNG ไปอยู่ในหัวข้อ Data Export


## v5.24 Pressure Cleanup

- เอา Mode Setting ออกจากหน้า Pressure Wave
- ลบข้อความ 'เฉพาะหัวข้อนี้' ออกจากหน้า Pressure Wave
- ย้ายปุ่มบันทึกภาพ PNG ไปอยู่ในหัวข้อ Data Export


## v5.25 Displacement + Transverse Cleanup

- เอา Mode Setting ออกจากหน้า Displacement + Pressure และ Longitudinal / Transverse
- ลบข้อความ 'เฉพาะหัวข้อนี้' ออกจากทั้งสองหน้า
- ย้ายปุ่มบันทึกภาพ PNG ไปอยู่ในหัวข้อ Data Export


## v5.26 Superposition / Beats / Standing Cleanup

- เอา Mode Setting ออกจากหน้า Superposition และ Beats
- หน้า Standing Wave เก็บ Mode Setting ไว้ แต่เปลี่ยนเป็น Air Column Setting และเหลือเฉพาะตัวเลือกที่เกี่ยวข้อง
- ลบข้อความ 'เฉพาะหัวข้อนี้' ออกจากทั้งสามหน้า
- ย้ายปุ่มบันทึกภาพ PNG ไปอยู่ในหัวข้อ Data Export


## v5.27 Longitudinal Template
- ออกแบบแม่แบบใหม่ของ Visualizer ที่หน้า Longitudinal Wave
- เพิ่ม concept chips, observation guide, legend และ readout ที่ชัดเจนขึ้น
- เพิ่ม value badges ในส่วน parameters
- ปรับคำอธิบายแอมพลิจูดให้ถูกต้อง และเพิ่มเส้นกำกับแอมพลิจูดบนภาพจำลอง


## v5.28 All Visualizer Template
- ขยายแม่แบบใหม่ของ Visualizer ไปยังทุกหัวข้อย่อย
- ปรับคำอธิบายและ concept chips ให้เหมาะกับแต่ละเรื่อง
- เพิ่ม observation guide, legend, readout help และ parameter badges ทุกหน้า
- คงรูปแบบ player และ data export ให้สอดคล้องกันทั้งระบบ


## v5.29 Longitudinal Focus
- ซ่อนคำอธิบายเพิ่มเติมของหน้า Longitudinal Wave ไว้ใน details/summary
- เอากลุ่ม mini info cards ออก
- ย้าย Simulation Player เข้าไปในเฟรมเดียวกับแอนิเมชัน


## v5.30 Longitudinal Minimal
- เอาคำว่า Simulation Player ออก
- เอา Loop animation ออก
- เอาการ์ด readout (Frequency, Amplitude, Wave Speed, Wavelength) ออกจากหน้า Longitudinal Wave


## v5.31 Longitudinal Balanced
- จัดโครงสร้างหน้า Longitudinal Wave ใหม่ให้สะอาดขึ้น
- ปรับสัดส่วนหน้า โดยเฉพาะแนวนอนให้กราฟเด่นกว่า Parameters
- ลดความกว้างและ padding ของแผง Parameters
- คง player แบบไอคอนล้วนและคำอธิบายเพิ่มเติมแบบยุบได้


## v5.32 Longitudinal Refined
- ลบคำว่า และความหมายของแอมพลิจูดอย่างถูกต้อง
- ย้ายคำอธิบายใต้ Parameters และ Data Export ลงมาอยู่บรรทัดใต้หัวข้อ
- ซ่อน legend สีแดง/ข้อความ highlight บนกราฟ
- เพิ่มลูกศรและ marker บนกราฟจริงของหน้า Longitudinal Wave


## v5.33 Visualizer Menu Balanced
- ปรับหน้า Wave Visualizer ให้ข้อความและรูปแบบสมดุลขึ้น
- จัดการ์ดหัวข้อใหม่เป็นไอคอน + ข้อความ + ลูกศร
- เพิ่มพื้นที่ข้อความ ไม่ให้คำอธิบายกองแคบทางซ้าย
- ปรับขนาดตัวอักษร ระยะห่าง และความสูงการ์ดให้เหมาะสม

## v5.34 Longitudinal Final
- ปรับหน้า Longitudinal Wave ตามภาพสุดท้าย
- อนุภาคเป็น 4 แถวและจัดให้ชิดกัน
- แกน x ไม่มีตัวเลขและไม่มีสัญลักษณ์ λ
- เอาจุด legend สีฟ้า/สีแดงใต้แกน x ออก
- แอมพลิจูด A แสดงเป็นแนวนอนจากตำแหน่งสมดุลไปยังอนุภาคที่สังเกต


## v5.35 Longitudinal Final Fixed
- แก้โค้ดหน้า Longitudinal Wave ใหม่ให้ใช้งานจริงตามภาพล่าสุด
- ต่อ drawLongitudinalFinal เข้ากับ drawVisualizer โดยตรง
- แก้การใช้ตัวแปร phase ให้ขับเคลื่อนแอนิเมชันได้จริง


## v5.37 Longitudinal Amplitude Fixed
- แก้ความหมายของ Amplitude A ให้เป็นการกระจัดสูงสุดคงที่
- A ไม่อ้างอิงตำแหน่งปัจจุบันของอนุภาคสีแดงอีกต่อไป
- เพิ่มเส้นกำกับตำแหน่งสุดขีดของการกระจัด

## v5.39 Full Home + Longitudinal Fixed
- Restore full Home and all original pages from v5.37 structure
- Do not use the v5.38 clean one-page deploy
- Fix only Longitudinal Wave graph
- Amplitude A is fixed maximum displacement, not current particle displacement
- 4 compact particle rows, no numeric x-axis labels, no lambda labels, no legend dots under x-axis

## v5.40 Full Home + Clean Longitudinal
- Home/index and all app pages preserved from v5.37/v5.39 structure
- Only visualizer_longitudinal.html is cleaned to show one Longitudinal section
- Longitudinal renderer forced via early return in drawVisualizer
- Amplitude A remains fixed maximum displacement, not current red particle displacement
- x-axis has no numbers and no lambda labels

## v5.41 Longitudinal Player UI
- Refined play / pause / reset controls to look more like modern media controls
- Added SVG icons, larger primary play button, hover/press states, active-state feedback
- Kept icon-only style for cleaner UI

## v5.42 Longitudinal Clean + Bilingual
- Removed A label from longitudinal graph
- Removed red particle-vibration arrow from graph
- Cleaned the main simulation view
- Kept explanations in the existing More explanation section
- Added English (Thai) format to visible texts on the Longitudinal page

## v5.43 Longitudinal Equilibrium Point
- Moved the red reference particle to the equilibrium position in Longitudinal Wave
- At reset/start (t=0), the red point aligns with the equilibrium line so displacement can be observed from the correct reference position

## v5.44 Longitudinal Reset Fixed
- Fixed the red reference particle so it uses an exact base position at the equilibrium line
- On reset (t=0), the red point now aligns with the equilibrium position exactly
- Prevented the nearest-neighbor particle from being chosen as the red reference point

## v5.45 Longitudinal Thai + Physics Terms
- Removed English sentence-style UI text on the Longitudinal page
- Kept Thai as the main display language
- Retained only essential English physics terms such as Longitudinal Wave, Wave propagation, Frequency, Amplitude A, Wave Speed v, and Equilibrium position

## v5.46 Longitudinal Label Tuning
- Removed English text "Wave propagation" from the main graph label and kept only Thai text without parentheses
- Removed English text "Equilibrium position" from the main graph label and kept only Thai text without parentheses
- Changed the time-speed parameter label back to English: Phase / Time Speed

## v5.50 Longitudinal Export Name
- CSV export name now uses the topic name: Longitudinal_Wave_Data.csv
- PNG export name now uses the topic name: Longitudinal_Wave.png
- Local export page key changed from Wave_Visualizer to Longitudinal_Wave


## v5.51 Longitudinal Graph Tight
- Reduced bottom empty space under x-axis in the longitudinal graph
- Moved x-axis closer to the particle field for a more balanced composition
- Tightened the visual focus on the main graph area

## v5.53 Longitudinal Neon Style FIXED
- ทำใหม่จากฐาน v5.52 Longitudinal Mobile Focus
- แก้ปัญหารอบก่อนที่เปลี่ยนชื่อเวอร์ชันแต่ยังไม่ใส่ neon style จริง
- ปรับแถบ player เป็นปุ่ม neon icon-only ตามแบบที่เลือก
- ปรับ Parameters เป็นแถวไอคอนสี + slider สี + value pill
- คงกราฟ Longitudinal Wave และหลักฟิสิกส์เดิม


## v5.54 Parameter Label Clean
- ลบข้อความภาษาอังกฤษสีขาวในหัวข้อพารามิเตอร์ที่ซ้ำกับคำอังกฤษสีออก
- คงคำไทยเป็นหัวข้อหลัก และคงคำอังกฤษสีไว้เป็นคำกำกับ


## v5.55 Longitudinal Graph Compact
- ลดช่องว่างด้านล่างกราฟ โดยเลื่อนแถวอนุภาคและแกน x ลงมาให้สมดุลขึ้น
- ลดระยะห่างระหว่างกราฟกับแถบปุ่มเล่น
- ปรับสัดส่วนแคนวาสบนมือถือ/แนวนอนให้กราฟเด่นขึ้น


## v5.56 Mobile Tight Layout
- ลดช่องว่างใต้แกน x ให้กราฟเด่นขึ้นบนมือถือ
- ลดความสูงแคนวาสเชิงมุมมองให้แน่นขึ้น
- ลดความสูงและ padding ของแถบปุ่มเล่น


## v5.57 Longitudinal Mobile Graph Focus
- ลดช่องว่างระหว่างแกน x กับแถบปุ่มเล่น
- ย่อความสูงเฟรมกราฟบนมือถือและแนวนอน
- เลื่อนลูกศรทิศทางคลื่นและตำแหน่งสมดุลลงมาใกล้อนุภาคมากขึ้น
- คงองค์ประกอบทั้งหมดเดิมและรักษาความถูกต้องเชิงฟิสิกส์


## v5.82 Pressure Preview Applied
- ลดความสูงของพื้นที่กราฟบนมือถือให้กระชับขึ้น แต่ยังคงองค์ประกอบครบ
- ดันกลุ่มอนุภาคและแกน x ลงมาใกล้แถบปุ่มมากขึ้นเพื่อลดช่องว่าง
- เลื่อนลูกศรทิศทางคลื่นและป้ายตำแหน่งสมดุลลงมาใกล้อนุภาคอย่างพอดี
- ลดความสูงแถบปุ่มเล่น เพื่อให้ภาพจำลองเด่นขึ้นในหน้านี้

## v5.82 Pressure Preview Applied
- เพิ่มลำโพงด้านซ้ายเป็นแหล่งกำเนิดเสียง
- เพิ่มจำนวนแถวอนุภาคให้กราฟเต็มและเด่นขึ้น
- คงหลักฟิสิกส์ของคลื่นตามยาว: อัด-ขยายตามแกน x และอนุภาคสั่นขนานกับทิศการเคลื่อนที่ของคลื่น
- ปรับปุ่มเล่น/หยุด/รีเซ็ตให้ขนาดเท่ากัน
- ลดขนาด Parameters ให้ไม่แย่งความเด่นจากกราฟ

## v5.82 Pressure Preview Applied
- ขยายพื้นที่กราฟในแนวตั้งให้เต็มพื้นที่ว่างมากขึ้น
- เพิ่มขนาดอนุภาคและจัดให้กราฟดูสมดุลกว่าเดิม
- ปรับรูปลำโพงให้ดูทันสมัยและเข้ากับธีม neon มากขึ้น
- คงความถูกต้องของคลื่นตามยาว: อนุภาคเคลื่อนที่ตามแนว x และมีอัด/ขยาย

## v5.82 Pressure Preview Applied
- แก้จริงที่ resizeVisualizerCanvas ให้ canvas ของหน้า Longitudinal สูงขึ้นบนมือถือ
- เพิ่มจำนวนแถวอนุภาคเป็น 18 แถว
- เพิ่มขนาดอนุภาคแบบเห็นผลจริง
- ปรับตำแหน่ง label/arrow ให้ใกล้อนุภาคมากขึ้น
- ลดขนาด Parameters และปุ่มควบคุมให้กราฟเป็นจุดเด่น

## v5.82 Pressure Preview Applied
- แก้ตามคำสั่งตรง ๆ: ขยายกราฟตามแกนตั้งให้เต็มช่อง
- ด้านบนของอนุภาคชิดกับหัวข้อ/ลูกศรคลื่นตามยาวมากขึ้น
- ด้านล่างของกราฟชิดกับปุ่มเล่นมากขึ้น
- ใช้ height แบบ viewport ใน CSS + resize canvas ใน JS เพื่อให้เห็นผลบนมือถือจริง
- เพิ่มแถวอนุภาคเป็น 21 แถว โดยคงการสั่นตามแกน x ของคลื่นตามยาว

## v5.82 Pressure Preview Applied
- คงขนาดกราฟ/Canvas จาก v5.66 ไว้เท่าเดิม
- ลดจำนวนแถวอนุภาคจาก 21 แถว เหลือ 15 แถว
- เพิ่มขนาดอนุภาคให้ใหญ่ขึ้นชัดเจน
- เพิ่มระยะอนุภาคตามแกน x เล็กน้อย เพื่อไม่ให้แน่นจนอ่านยาก
- คงฟิสิกส์เดิม: อนุภาคเคลื่อนที่ตามแนว x และมีอัด/ขยายของคลื่นตามยาว

## v5.82 Pressure Preview Applied
- สร้าง visualizer_pressure.html ใหม่โดยคัดโครงจาก visualizer_longitudinal.html v5.67 แล้วแปลงเป็น Pressure Wave
- ปุ่มเล่น/หยุด/รีเซ็ตและ Parameters ใช้โครง HTML/CSS แบบ Longitudinal v5.67 จริง
- กราฟอนุภาคด้านบนใช้รูปแบบ Longitudinal v5.67 จริง
- จุดแดงด้านบนและจุดแดงบนกราฟความดันใช้ตำแหน่ง x เดียวกัน
- สัญลักษณ์ความถี่เป็น f และแอมพลิจูดเป็น A

## v5.82 Pressure Preview Applied
- เปลี่ยนสัญลักษณ์พารามิเตอร์ความถี่เป็น f ทั้งหน้า Longitudinal Wave และ Pressure Wave
- เปลี่ยนสัญลักษณ์พารามิเตอร์แอมพลิจูดเป็น A ทั้งหน้า Longitudinal Wave และ Pressure Wave
- คงรูปแบบปุ่มและพารามิเตอร์แบบเดิมไว้ทั้งหมด

## v5.82 Pressure Preview Applied
- ปรับกราฟอนุภาคของ Pressure Wave ให้ใช้รูปแบบเดิมที่อ่านง่าย แต่ mapping ถูกต้องกับความดัน
- ใช้ฟังก์ชันเดียวกันระหว่างกราฟอนุภาคและกราฟความดัน: ΔP ∝ cos(kx - ωt)
- การกระจัดอนุภาคใช้ u = -U sin(kx - ωt) ทำให้บริเวณอัดแน่นตรงกับยอด +ΔP
- จุดสีแดงด้านบนและจุดสีแดงบนกราฟความดันใช้ตำแหน่ง x เดียวกันและอ่านค่าความดันจากฟังก์ชันเดียวกัน
- เพิ่มป้าย อัดแน่น / +ΔP และ เบาบาง / -ΔP เพื่อให้ความสัมพันธ์ชัดเจนขึ้น

## v5.82 Pressure Preview Applied
- เปลี่ยนกราฟอนุภาค Pressure Wave เป็นจุดกระจายธรรมชาติคล้ายภาพอ้างอิง ไม่เรียงเป็นคอลัมน์แข็ง
- ใช้คำว่า อัด (Compression) และ ขยาย (Rarefaction)
- จุดถี่สัมพันธ์กับความดันสูง และจุดห่างสัมพันธ์กับความดันต่ำ
- กราฟความดันด้านล่างใช้ pressureAt(x) ฟังก์ชันเดียวกับ density ของอนุภาคด้านบน
- จุดสังเกตสีแดงด้านบนและจุดสีแดงบนกราฟความดันใช้ตำแหน่ง x เดียวกัน

## v5.82 Pressure Preview Applied
- ปรับคำอธิบายจาก (บริเวณอัดแน่น) เป็น (คลื่นอัด)
- ปรับคำอธิบายจาก (บริเวณเบาบาง) เป็น (คลื่นขยาย)
- ปรับหัวข้อคำอธิบายเป็น อัด (Compression: คลื่นอัด) และ ขยาย (Rarefaction: คลื่นขยาย)
- แก้หัวข้อ “สิ่งที่สังเกตได้” ให้เป็นคำอธิบายตามหลักฟิสิกส์ของคลื่นเสียง คลื่นตามยาว ความดัน ΔP จุดอัดและจุดขยาย

## v5.82 Pressure Preview Applied
- เปลี่ยนคำอธิบายใต้หัวข้อ Pressure Wave เป็น:
  ภาพจำลองความสัมพันธ์ระหว่างการสั่นของอนุภาคอากาศ คลื่นอัด–คลื่นขยาย และกราฟความดัน

## v5.82 Pressure Preview Applied
- แก้กราฟอนุภาค Pressure Wave ให้มองเห็นชัดขึ้น
- เพิ่มกรอบ field ด้านบนให้รู้ว่าบริเวณนั้นคือกราฟอนุภาค
- เพิ่มขนาดและความสว่างของจุดอนุภาค
- เพิ่ม density ของอนุภาคในบริเวณขยาย เพื่อไม่ให้ดูเหมือนกราฟหาย
- ยังคง mapping ฟิสิกส์เดิม: อัด = ความดันสูง, ขยาย = ความดันต่ำ

## v5.82 Pressure Preview Applied
- เปลี่ยนข้อความบนกราฟอนุภาคจาก อัด / ขยาย เป็น ส่วนอัด / ส่วนขยาย
- ปรับคำอธิบายเพิ่มเติมเป็น ส่วนอัด (Compression) และ ส่วนขยาย (Rarefaction)
- ลบประโยคอธิบายเรื่องคลื่นตามยาวที่ผู้ใช้ไม่ต้องการ
- ปรับหัวข้อ “สิ่งที่สังเกตได้” ให้ใช้คำว่า ส่วนอัด / ส่วนขยาย ตามที่กำหนด

## v5.82 Pressure Preview Applied
- ปรับชื่อไฟล์ PNG ที่บันทึกจากภาพจำลองให้ใช้ชื่อหัวข้อหน้านั้น เช่น Pressure Wave หรือ Longitudinal Wave
- ปรับชื่อไฟล์ CSV ที่ดาวน์โหลดให้ใช้ชื่อหัวข้อหน้านั้น
- เพิ่ม timestamp แบบ YYYYMMDD_HHMMSS ต่อท้ายชื่อไฟล์ เพื่อไม่ให้ชื่อไฟล์ซ้ำกัน
- ใช้ helper กลาง makeTopicFileName() สำหรับไฟล์ PNG, CSV และ Excel

## v5.82 Pressure Preview Applied
- ปรับจุดแดงในกราฟอนุภาคให้สั่นซ้าย–ขวารอบตำแหน่งสังเกต ตามหลักฟิสิกส์ของคลื่นเสียง
- เส้นประสีชมพูยังเป็นตำแหน่งสังเกต x คงที่
- จุดแดงบนกราฟความดันยังอยู่ที่ตำแหน่ง x เดียวกับเส้นประ และแสดงค่า ΔP ณ ตำแหน่งนั้น
- ลบคำอธิบายใหม่บนกราฟออก คงไว้เฉพาะป้ายหลัก: จุดสังเกต, ส่วนอัด, ส่วนขยาย

## v5.82 Pressure Preview Applied
- ใช้รูปแบบหน้า Pressure Wave ตามตัวอย่างล่าสุด
- จุดแดงในกราฟอนุภาคสั่นซ้าย–ขวารอบตำแหน่งสังเกต
- จุดแดงบนกราฟความดันอยู่ที่ตำแหน่ง x เดียวกัน
- คงไว้เฉพาะข้อความหลักบนกราฟ: จุดสังเกต, ส่วนอัด, ส่วนขยาย
