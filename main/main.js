function doPost(e) {
  
  // Verification Tokenで取得したトークン
  var slack_token = 'xxxxx';
  // 指定したチャンネルからの命令しか受け付けない
  if (slack_token != e.parameter.token) {
    throw new Error(e.parameter.token);
  }
  
  var command = e.parameter.text;
  
  var bot_token = "xxxxx";
  var options_id =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify({"users":e.parameter.user_id}),
    "headers":{"Authorization":"Bearer " + bot_token}
  };
  var channel_json = UrlFetchApp.fetch("https://slack.com/api/conversations.open", options_id).getContentText();
  var channel_id = JSON.parse(channel_json).channel.id;
  
  //return ContentService.createTextOutput(channel_json).setMimeType(ContentService.MimeType.JSON);
  
  //問題とってくる
  var sheet = SpreadsheetApp.openById("google spreadsheet id").getSheetByName("sheet1");
  var max = sheet.getRange(1, 1).getValue();
  //var num = Math.floor(Math.random()*max) + 1;
  var error_msg = ""
  if(command != ""){
    var num = parseInt(command, 10);
    if(isNaN(num) || (num <= 0) || (num > max)){
      var num = Math.floor(Math.random()*max) + 1;
      var error_msg = "（範囲外の番号が指定されたため、ランダムに選ばれました）"
    }
  }
  else{
    var num = Math.floor(Math.random()*max) + 1;
  }
  var sheet_title = sheet.getRange(num+1, 2).getValue();
  var sheet_text = sheet.getRange(num+1, 3).getValue();
  var sheet_a = sheet.getRange(num+1, 4).getValue();
  var sheet_b = sheet.getRange(num+1, 5).getValue();
  var sheet_c = sheet.getRange(num+1, 6).getValue();
  var sheet_d = sheet.getRange(num+1, 7).getValue();
  var sheet_ans = sheet.getRange(num+1, 8).getValue();
  var sheet_ALL_ans = sheet.getRange(num+1, 9).getValue();
  if (sheet_ALL_ans==""){
    sheet_ALL_ans = "まだ実装中です…";
  }
  
  // 返答データ本体
  var data = {
    channel:channel_id,
    text: "次の問題に答えてください。" + error_msg, //アタッチメントではない通常メッセージ
    response_type:"ephemeral", // ここを"ephemeral"から"in_chanel"に変えると他の人にも表示されるらしい（？）
    //アタッチメント部分
    attachments: [{
      title: "Q" + num + "." + sheet_title,//　アタッチメントのタイトル
      text: sheet_text,//アタッチメント内テキスト
      fallback: "Yeeeeeeeeeeah!!!",//ボタン表示に対応してない環境での表示メッセージ. 
      callback_id: "callback_button",
      color: "#00bfff", //左の棒の色を指定する
      attachment_type: "default",
      // ボタン部分
      actions: [
        //ボタン1
        {
          name: "A",
          text: "A. "+sheet_a,
          type: "button",
          value: sheet_ans
        },
        //ボタン2
        {
          name: "B",
          text: "B. "+sheet_b,
          type: "button",
          value: sheet_ans
        },
        //ボタン3
        {
          name: "C",
          text: "C. "+sheet_c,
          type: "button",
          value: sheet_ans
        },
        //ボタン4
        {
          name: "D",
          text: "D. "+sheet_d,
          type: "button",
          value: sheet_ans
        },
        //New Botton
        {
          name: "ALL",
          text: "全ての枠の答えを表示",
          type: "button",
          value: sheet_ALL_ans,
          style:"primary"
        }
        ]
      }]
  };
  
  /* 返答をwebhookに変更したので使わない
  // 　botを呼び出した人にのみ表示する
  //   返信データをJSON形式に変換してチャンネルに返す
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  */
  
  //webhook
  var url = "https://slack.com/api/chat.postMessage";
  var payload = JSON.stringify(data);
  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload,
    "headers":{"Authorization":"Bearer " + bot_token}
  };
  UrlFetchApp.fetch(url, options);
  
  //何か返さないと怒られるみたい…
  return ContentService.createTextOutput(null).setMimeType(ContentService.MimeType.JSON);
}
