document.getElementById("submitButton").addEventListener("mouseover",function(){
    if (document.getElementById("inputBankAccountNum").classList.contains("backgroundRed")===false &&
    document.getElementById("loanAmount").classList.contains("backgroundRed")===false){
        document.getElementById("submitButton").disabled = false;
        console.log("abled")
        console.log(document.getElementById("submitButton").classList)
    }else{
        document.getElementById("submitButton").disabled = true;
        console.log("disabled")
    }
});

//

//口座番号入力修正
    function changeNum(a){
    a.value=a.value.replace(/[^0-9０-９]/g,'').replace('０','0').replace('１','1').replace('２','2').replace('３','3').replace('４','4').replace('５','5').replace('６','6').replace('７','7').replace('８','8').replace('９','9')
    if (a.value.length >=7){
        a.value=a.value.slice(0,7)
        }
    return a
    }

    function changeNumNormal(a){
    a.value=a.value.replace(/[^0-9０-９]/g,'').replace('０','0').replace('１','1').replace('２','2').replace('３','3').replace('４','4').replace('５','5').replace('６','6').replace('７','7').replace('８','8').replace('９','9')
    return a
    }

// 口座番号
    function validBankAccountNum(i,where) {
        i=changeNum(i)
        var input=i.value
        //console.log(`inputBankAccountNum=${input},input.length=${input.length}`)

        // バリデーション処理
        if (input.length === 7) {
        　　//ボタンを有効化
            //document.getElementById("submitButton").disabled = false;
            document.getElementById(where).classList.remove("backgroundRed")
            //console.log("abled")
            //changeAction(selectedName);
        } else {
            //ボタンを無効化
            //document.getElementById("submitButton").disabled = true;
            document.getElementById(where).classList.add("backgroundRed")
            //console.log("disabled")
        }
    }

//借入金額
    function validLoanAmount(i,where){
        i=changeNumNormal(i)
        var input=i.value
        if (input) {
            document.getElementById(where).classList.remove("backgroundRed")
            //console.log("kariireok")
        }else{
            document.getElementById(where).classList.add("backgroundRed")
            //console.log("kariireno")
        }
    }
