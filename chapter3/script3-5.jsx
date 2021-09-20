(function(){
    // テキストに記載したい失言
    var shitugen_text = ["日本の国、まさに天皇を中心にしている神の国である。",
                                    "集団レイプする人は、まだ元気があるからいい。",
                                    "念願のBMWが買える。",
                                     "15歳から50歳の女性の数は決まっている。産む機械、装置の数は決まっている。",
                                     "何とか還元水とかそういったようなものを付けております。",
                                     "殺人とか強制わいせつとは違う。セクハラ罪という罪はない。",
                                     "彼ら彼女らは子供を作らない、つまり「生産性」がないのです。",
                                     "俺は女を買いたいんだ。",
                                     "小渕の恵三さんはコロッと死んじゃった、あれを「お陀仏さん」という。",
                                     "私の友人の友人がアルカイダだ。"];
                                     
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