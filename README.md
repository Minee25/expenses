# expenses
 
# Google Apps Script - การเชื่อมต่อ Webhook

โปรเจกต์นี้ประกอบด้วยการใช้งาน Google Apps Script เพื่อจัดการกับคำขอประเภท POST บันทึกลงใน Google Spreadsheet

## ฟังก์ชันต่างๆ

### `doPost(e)`

ฟังก์ชันนี้ใช้ในการจัดการกับคำขอประเภท POST ที่เข้ามา โดยจะทำการแยกข้อมูล JSON ที่ได้รับและบันทึกลงใน Google Spreadsheet

- **พารามิเตอร์**: `e` (อ็อบเจกต์ที่ประกอบด้วยข้อมูลของคำขอ)
- **ผลลัพธ์**: การตอบกลับเป็น JSON ที่ระบุผลลัพธ์ว่า สำเร็จหรือเกิดข้อผิดพลาด

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  
  try {
    // พยายามล็อกการทำงานเป็นเวลา 10 วินาที
    lock.tryLock(10000);

    // ตรวจสอบว่ามีข้อมูล postData หรือไม่
    if (!e.postData) {
      return createResponse({ error: "No postData found" });
    }

    // แปลงข้อมูล JSON ที่ได้รับ
    var data = JSON.parse(e.postData.contents);
    
    // ดึงสเปรดชีตและชีตที่ใช้งานอยู่
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // หาบรรทัดถัดไปที่ว่าง เพื่อหลีกเลี่ยงการเขียนทับข้อมูลเดิม
    var lastRow = sheet.getLastRow() + 1;

    // เพิ่มข้อมูลลงในคอลัมน์ที่เกี่ยวข้อง
    sheet.getRange(lastRow, 1).setValue(data.date);
    sheet.getRange(lastRow, 2).setValue(data.productName);
    sheet.getRange(lastRow, 3).setValue(data.priceProduct);
    sheet.getRange(lastRow, 4).setValue(data.amount);
    sheet.getRange(lastRow, 5).setValue(data.itemName);
    sheet.getRange(lastRow, 6).setValue(data.codeBalance);
    sheet.getRange(lastRow, 7).setValue(data.note ? data.note : data.description || "");

    // ส่งคำตอบที่บ่งบอกว่าเสร็จสิ้น
    return createResponse({ result: "success" });

  } catch (error) {
    // หากเกิดข้อผิดพลาด ให้ตอบกลับข้อความผิดพลาด
    return createResponse({ error: error.message });

  } finally {
    // ปลดล็อกเมื่อเสร็จสิ้นการประมวลผล
    lock.releaseLock();
  }
}

function doGet(e) {
  // จัดการคำขอ GET โดยส่งข้อความง่ายๆ
  return createResponse({ message: "GET request received." });
}

function doOptions(e) {
  // จัดการคำขอ OPTIONS สำหรับ CORS headers
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function createResponse(responseData) {
  // สร้างการตอบกลับในรูปแบบ JSON
  var jsonResponse = JSON.stringify(responseData);
  return ContentService.createTextOutput(jsonResponse)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
