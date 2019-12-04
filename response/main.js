function doPost(e) {
  
  //return ContentService.createTextOutput(JSON.stringify(e,null,"    ")).setMimeType(ContentService.MimeType.JSON);
  
  // ペイロード部分の取り出し
  var payload = JSON.parse(e["parameter"]["payload"]);
  var name = payload["actions"][0]["name"];
  var value = payload["actions"][0]["value"];
  //var flag = payload["actions"][0]["flag"];
  var channel_id = payload.channel.id;
  
  var TorF;
  if (name == "ALL"){
    TorF = value;
  }
  else if (name == value){
    TorF = "正解です。";
  }
  else {
    TorF = "不正解です。" + "正解は" + value + "です。";
  }
  response = {
    channel: channel_id,
    text:TorF
  };
  // mainと同じ
  //webhook
  var bot_token = "xxxx";
  var url = "https://slack.com/api/chat.postMessage";
  var payload = JSON.stringify(response);
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