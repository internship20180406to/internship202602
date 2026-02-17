//口座番号入力修正
    function changeNum(a){
    a.value=a.value.replace(/[^0-9０-９]/g,'').replace('０','0').replace('１','1').replace('２','2').replace('３','3').replace('４','4').replace('５','5').replace('６','6').replace('７','7').replace('８','8').replace('９','9')
    if (a.value.length >=7){
        a.value=a.value.slice(0,7)
        }
    }
// セレクトボックスの値が変更されたときに呼ばれる関数
    function validBankAccountNum(a) {
        var input=a.value
        //console.log(`inputBankAccountNum=${input},input.length=${input.length}`)

        // バリデーション処理
        if (input.length === 7) {
        　　//ボタンを有効化
            document.getElementById("submitButton").disabled = false;
            //console.log("abled")
            //changeAction(selectedName);
        } else {
            //「選択してください」が選ばれた場合はボタンを無効化
            document.getElementById("submitButton").disabled = true;
            //console.log("disabled")
        }
    }
