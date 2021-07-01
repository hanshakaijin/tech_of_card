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

    // masterレイヤーをコピーして、リンクされた外部ファイルを埋め込む
    var masterLayer = app.activeDocument.layers.getByName("master"); 
    var duplicateLayer = app.activeDocument.layers.add();
    duplicateLayer.name = "duplicate" // コピー先のレイヤーをduplicateと命名
    for(var i=0; i<masterLayer.placedItems.length; i++){
        // masterレイヤーに配置されている要素を、duplicateレイヤーにコピー
        var dupItem = masterLayer.placedItems[i]
                                .duplicate(duplicateLayer, ElementPlacement.PLACEATEND);
        dupItem.embed(); // リンクアイテムを埋め込み、PlaceItemからGroupItemに変換
    }
    masterLayer.visible = false; // masterレイヤーは非表示に
    
    // コピーしたレイヤー内のテキストを操作
    for(var i=0; i<duplicateLayer.groupItems.length; i++){
        // リンクアイテムを埋め込むと、GroupItemの中にさらにクリップグループが存在
        var clipGroup = duplicateLayer.groupItems[i].groupItems[0];
        for(var j=0; j<clipGroup.textFrames.length; j++){
            // 失言用のテキストフレームかどうか判別する
            if(clipGroup.textFrames[j].contents == "yabai"){
                clipGroup.textFrames[j].contents = shitugen_text[i]; 
            }
        }
    }
 })()