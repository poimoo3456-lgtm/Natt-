/**
 * ฟังก์ชันหลักสำหรับการโหลดหน้าเว็บ
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('บริษัทของเรา - หน้าโปรไฟล์และระบบแชท')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ตั้งค่า API
const CONFIG = {
  CONTACT_BOT_TOKEN: "8592685368:AAFwAIJMJupqJPw3VwtZ36L_m4tuEu2rnxQ",
  CHAT_BOT_TOKEN: "8732929782:AAFl0BjrLjgH-HasgAJlsL3CV7iPU8bpkoc",
  CHAT_ID: "7967010433"
};

/**
 * ส่งข้อความฟอร์มติดต่อ (ใช้ API 1)
 */
function sendContactForm(data) {
  const message = `📢 *ข้อความใหม่จากเว็บไซต์*\n\n👤 ชื่อ: ${data.name}\n📞 เบอร์: ${data.phone}\n🌐 เว็บไซต์: ${data.web}\n📝 รายละเอียด: ${data.detail}`;
  const url = `https://api.telegram.org/bot${CONFIG.CONTACT_BOT_TOKEN}/sendMessage`;
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: CONFIG.CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    })
  };
  
  try {
    UrlFetchApp.fetch(url, options);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * ส่งแชทและไฟล์สลิป (ใช้ API 2)
 */
function sendChatMessage(text, fileData) {
  const baseUrl = `https://api.telegram.org/bot${CONFIG.CHAT_BOT_TOKEN}`;
  
  try {
    // 1. ส่งข้อความถ้ามี
    if (text) {
      UrlFetchApp.fetch(`${baseUrl}/sendMessage`, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({
          chat_id: CONFIG.CHAT_ID,
          text: `💬 แชทลูกค้า: ${text}`
        })
      });
    }
    
    // 2. ส่งรูปภาพสลิปถ้ามี
    if (fileData) {
      const blob = Utilities.newBlob(
        Utilities.base64Decode(fileData.base64), 
        fileData.mimeType, 
        fileData.fileName
      );
      
      const payload = {
        chat_id: CONFIG.CHAT_ID,
        photo: blob,
        caption: `💳 แนบสลิปแจ้งโอนเงิน\nข้อความประกอบ: ${text || '-'}`
      };
      
      UrlFetchApp.fetch(`${baseUrl}/sendPhoto`, {
        method: "post",
        payload: payload
      });
    }
    
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

