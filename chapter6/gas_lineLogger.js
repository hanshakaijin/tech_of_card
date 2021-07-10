const CHANNEL_ACCESS_TOKEN = 'LINE Developers Consoleで取得したチャネルアクセストークンを記入';
const LOG_SPREADSHEET_ID = 'ログ蓄積用のGoogleスプレッドシートのスプレッドシートIDを記入';
const LOG_WORKSHEET_ID = 0;

function doGet(e) {
    return ContentService.createTextOutput('GETでした〜');
}

function doPost(e) {
    if (!e.postData) {
        return ContentService.createTextOutput('なんもなしPOST');
    }

    const events = JSON.parse(e.postData.contents).events;
    console.log(events);

    events.forEach(function (event) {
        const replyToken = event.replyToken;
        
        const userId = event.source.userId;
        let groupId = event.source.groupId || event.source.roomId || '-';
        let userMessage = event.message.text;

        if (event.type == "message") {
            pushLogs(userId, groupId, userMessage);
        } else if (event.type === 'follow') {
            pushLogs(userId, groupId, event.type);
        } else if(event.type === 'memberJoined' || event.type === 'memberLeft') {
            pushLogs(userId, groupId, event.type);
        }
    });

    return true;
}

function pushLogs(userId, groupId, userMessage) {
    const nowTimestamp = getCurrentTime();
    const spreadsheet = SpreadsheetApp.openById(LOG_SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[LOG_WORKSHEET_ID];
    sheet.appendRow([nowTimestamp, userId, groupId, userMessage]);
}

//現在時刻取得（yyyy/mm/dd hh:mm:ss）
function getCurrentTime() {
    const now = new Date();
    const res = "" + now.getFullYear() + "/" + padZero(now.getMonth() + 1) +
        "/" + padZero(now.getDate()) + " " + padZero(now.getHours()) + ":" +
        padZero(now.getMinutes()) + ":" + padZero(now.getSeconds());
    return res;
}

//先頭ゼロ付加
function padZero(num) {
    let result;
    if (num < 10) {
        result = "0" + num;
    } else {
        result = "" + num;
    }
    return result;
}
