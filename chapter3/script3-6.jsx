(function(){
    // ファイルパスの指定
    var filePath = $.fileName.match(/.*\//); // スクリプトファイルパスからフォルダのみを取得
    var fileName = "政治家失言かるた - シート1.csv"

    // ファイルの読み込み
    var csvText;
    var fp = new File(filePath + fileName);
    if(fp.open("r","","")){
        csvText = fp.read(); // テキストファイルの内容を一括読み込み
        fp.close();   
    }else{
        // ファイルが見つからなかった場合、アラートを出す
        alert("can not open " + fileName);
        return;
    }

    // CSVファイルをリストに
    var lines = csvText.split(String.fromCharCode(10)); // 改行でリストに分割
    var shitugen_text=[];
    for (var i = 0, n = lines.length; i < n; i++) {
        var line = lines[i];
        if (! line)  continue;  // 空行を無視
        if (i == 0) continue; // 先頭行を無視
        shitugen_text.push(line.split(",")[2]); // 3列目が失言内容
    }

    var textLayer; // テキストを記載するレイヤーにアクセスするための変数
    try{
        // 現在のドキュメントから「text」という名前のレイヤーを見つけ出す
        textLayer = app.activeDocument.layers.getByName("text"); 
    }catch(error){
        // レイヤーが見つからなかった場合、アラートを出す
        alert("text layer not found in this document"); 
        return;
    }  
                                     
    for(var i=0; i<shitugen_text.length; i++){
        //テキストフレームに、失言を代入
        textLayer.textFrames[i].contents = shitugen_text[i]; 
     }  
 })()