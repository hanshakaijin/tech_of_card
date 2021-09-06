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
        const userId = event.source.userId;
        const groupId = event.source.groupId || event.source.roomId || '-';
        const userMessage = event.message.text;

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
    const now = new Date();
    const nowTimestamp = Utilities.formatDate(now, 'JST', 'yyyy/MM/dd HH:mm:ss');
    const spreadsheet = SpreadsheetApp.openById(LOG_SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[LOG_WORKSHEET_ID];
    sheet.appendRow([nowTimestamp, userId, groupId, userMessage]);
}
