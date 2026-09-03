# Prescript Prototype

เว็บต้นแบบ **The Index / Prescript** ที่ต่อยอดจากตัวอย่าง Prescript.exe โดยมีหน้าจอ terminal/CRT, สถานะ session, scramble/reveal, ปุ่ม PASS/COMPLETE และ FAIL/DECLINE, ระบบคลังคำศัพท์ใน `localStorage` และระบบเสียงแบบ local-only

## ความสามารถ

โปรเจกต์นี้สุ่ม Prescript จาก template ที่ปลอดภัยและนำคำศัพท์จาก starter lexicon หรือคำที่ผู้ใช้เพิ่มเองมาใส่ในคำสั่งได้ ผู้ใช้สามารถเปลี่ยน designation, เพิ่ม/ลบ/คัดลอกคำศัพท์, รับคำสั่งใหม่, ทำเครื่องหมาย PASS หรือ DECLINE ได้ โดยข้อมูลทั้งหมดอยู่ในเบราว์เซอร์ของผู้ใช้

ระบบเสียงแก้ปัญหา autoplay ด้วย **Web Audio API** ซึ่งจะเริ่มทำงานเมื่อผู้ใช้กดปุ่มเอง มีเสียง signal, static, complete และ decline แบบสังเคราะห์ในเครื่อง หากต้องการใช้ soundtrack หรือ SFX ของตนเอง ให้เปิดเมนูด้านขวาบน เลือก `Load local SFX` แล้วเลือกไฟล์เสียงที่คุณมีสิทธิ์ใช้งาน เสียงจาก YouTube ไม่ได้ถูกฝังในโปรเจกต์โดยอัตโนมัติ

## วิธีรันในเครื่อง

```bash
pnpm install
pnpm dev
```

จากนั้นเปิด URL ที่ Vite แสดงใน terminal

## วิธี build

```bash
pnpm check
pnpm build
```

ไฟล์ frontend ที่ build แล้วอยู่ที่ `dist/public/` หากใช้ GitHub Pages ให้เผยแพร่โฟลเดอร์นี้ หรือใช้ GitHub Actions สร้างด้วย `pnpm install` และ `pnpm build` แล้ว deploy โฟลเดอร์ `dist/public`

## วิธีอัปโหลดขึ้น GitHub

อัปโหลดไฟล์และโฟลเดอร์ทั้งหมดในโปรเจกต์ ยกเว้น `node_modules/` และ log ชั่วคราว หากใช้ GitHub Pages จาก source branch ให้ตั้งค่า workflow ให้ build Vite ก่อน เพราะ `index.html` ของโปรเจกต์นี้อ้างอิง `/src/main.tsx` และไฟล์ CSS/JavaScript ที่ Vite bundle ให้

ไฟล์ `prescript-single.html` เป็นรุ่น standalone สำหรับเปิดตรง ๆ หรือวางเป็น `index.html` ได้ทันที แต่รุ่น React ในโฟลเดอร์ `client/` คือรุ่นหลักที่มีฟังก์ชันครบกว่า

## ขอบเขตความปลอดภัย

prototype นี้ไม่มีการลบไฟล์จริง ไม่มีการเรียก API ภายนอก และไม่มีคำสั่งที่จงใจทำร้ายผู้ใช้หรือบุคคลอื่น ทุก Prescript สามารถข้ามได้เสมอ
