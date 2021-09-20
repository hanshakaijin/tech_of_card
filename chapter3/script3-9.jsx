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
    var illustFileName=[]
    var nameText=[];
    for (var i = 0, n = lines.length; i < n; i++) {
        var line = lines[i];
        if (! line)  continue;  // 空行を無視
        if (i == 0) continue; // 先頭行を無視
        illustFileName.push(line.split(",")[0] + ".png") // 1列目は番号
        nameText.push(line.split(",")[1]); // 2列目が政治家の名前
    }

    // symbolレイヤーをコピーして、シンボルへのリンクを解除する
    var symbolLayer = app.activeDocument.layers.getByName("symbol"); 
    var duplicateLayer = app.activeDocument.layers.add();
    duplicateLayer.name = "duplicate" // コピー先のレイヤーをduplicateと命名
    symbolLayer.visible = true; // symbolレイヤーを表示
    for(var i=0; i<symbolLayer.symbolItems.length; i++){
        // symbolレイヤーの要素を、シンボルのリンクを解除しつつduplicateレイヤーにコピー
        var dupSym = symbolLayer.symbolItems[i].symbol.duplicate();
        var tmpLay = app.activeDocument.layers.add();
        var tmpSym = symbolLayer.symbolItems[i].duplicate();
        tmpSym.symbol = dupSym;
        dupSym.remove();
        tmpLay.pageItems[0].move(duplicateLayer, ElementPlacement.PLACEATEND);
        tmpLay.remove();
    }
    symbolLayer.visible = false; // symbolレイヤーは非表示に

    // コピーしたレイヤー内のテキストを操作
    for(var i=0; i<duplicateLayer.groupItems.length; i++){
        // イラストの読み込み
        var illust = duplicateLayer.groupItems[i].pageItems.getByName("illust");
        
        // ファイルを読み込む先の画像オブジェクトを作成
        var pictureImg = duplicateLayer.groupItems[i].placedItems.add()

        // ファイルの読み込み
        var pictureFile = File(filePath +  illustFileName[i]);
        pictureImg.file = pictureFile;
        
        // 画像の位置とサイズをダミー画像に合わせる
        pictureImg.top = illust.top;
        pictureImg.left = illust.left;
        pictureImg.height = illust.height;
        pictureImg.width = illust.width;
        
        illust.remove(); // ダミー画像の削除
        pictureImg.embed(); // 画像の埋め込み

        // 政治家の名前を代入
        var nameTextFrame = duplicateLayer.groupItems[i].pageItems.getByName("name")
        nameTextFrame.contents = nameText[i];
        
        // 政治家の名前は手前に表示されるように移動
        nameTextFrame.move(duplicateLayer.groupItems[i], ElementPlacement.PLACEATBEGINNING);
    }
 })()