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
    // Try to acquire the lock for 10 seconds
    lock.tryLock(10000);

    // Check if postData is available
    if (!e.postData) {
      return createResponse({ error: "No postData found" });
    }

    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet and sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get the next available row (to avoid overwriting)
    var lastRow = sheet.getLastRow() + 1;

    // Insert the data into respective columns
    sheet.getRange(lastRow, 1).setValue(data.date);
    sheet.getRange(lastRow, 2).setValue(data.productName);
    sheet.getRange(lastRow, 3).setValue(data.priceProduct);
    sheet.getRange(lastRow, 4).setValue(data.amount);
    sheet.getRange(lastRow, 5).setValue(data.itemName);
    sheet.getRange(lastRow, 6).setValue(data.codeBalance);
    sheet.getRange(lastRow, 7).setValue(data.note ? data.note : data.description || "");

    // Return a success response
    return createResponse({ result: "success" });

  } catch (error) {
    // In case of error, return an error response
    return createResponse({ error: error.message });

  } finally {
    // Release the lock after processing
    lock.releaseLock();
  }
}

function doGet(e) {
  // Handle GET requests with a simple message
  return createResponse({ message: "GET request received." });
}

function doOptions(e) {
  // Handle OPTIONS requests for CORS headers
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function createResponse(responseData) {
  // Create the JSON response to return
  var jsonResponse = JSON.stringify(responseData);
  return ContentService.createTextOutput(jsonResponse)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
