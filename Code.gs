function doGet(e) {
  // 獲取 callback 參數和 email
  const callback = e.parameter.callback;
  const email = e.parameter.email;
  
  if (!email) {
    return ContentService.createTextOutput(
      callback + '({"error": "請提供email參數"})'
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  try {
    const spreadsheet = SpreadsheetApp.openById("14KkGW0DjjuSCIyGENWnhw2fSRXRj9pFxmB1tNli2L3M");
    const sheet = spreadsheet.getSheetByName("order_status");
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // 找出email欄位的索引
    const emailColumnIndex = headers.findIndex(header => 
      header.toString().toLowerCase() === 'email');
    
    if (emailColumnIndex === -1) {
      return ContentService.createTextOutput(
        callback + '({"error": "找不到email欄位"})'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // 尋找符合email的資料
    let result = null;
    for (let i = 1; i < data.length; i++) {
      if (data[i][emailColumnIndex]?.toString().toLowerCase() === email.toLowerCase()) {
        result = {};
        headers.forEach((header, index) => {
          result[header] = data[i][index];
        });
        break;
      }
    }
    
    if (!result) {
      return ContentService.createTextOutput(
        callback + '({"error": "找不到此email的訂單資料"})'
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput(
      callback + '(' + JSON.stringify(result) + ')'
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
      
  } catch (error) {
    return ContentService.createTextOutput(
      callback + '({"error": "處理請求時發生錯誤: ' + error.toString() + '"})'
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}