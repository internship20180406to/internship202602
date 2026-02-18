const rates =[[2,4.60],[3,4.90],[5,5.20],[10,5.55],[15,5.85],[20,6.05],[35,6.30]]

//全角数字を半角にする
function toHalfWidth(str) {
    str=str.replace(/[^0-9０-９。]/g,'').replace(/。/g,".")
    return str.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

//金利計算
function calculateRate(a){
a=Number.parseInt(a)//intにする
for (let n = 0; n < rates.length; n++){
if (a<=rates[n][0]){
return rates[n][1]
}
}
if (a>=35){
return 6.50}
return null
}

document.getElementById("years").addEventListener("input",function(){
console.log (this.value)
const yearsInputted = this.value;
rate=calculateRate(yearsInputted)
console.log(`rate=${rate}`)
document.getElementById("interestRate").value=rate
if (rate===null){document.getElementById("DisplayedInterestRate").textContent=""}
else{document.getElementById("DisplayedInterestRate").textContent=rate+"%"}

});

document.getElementById("submitButton").addEventListener("mouseover",function(){
    if (document.getElementById("inputBankAccountNum").classList.contains("backgroundRed")===false
    && document.getElementById("loanAmount").classList.contains("backgroundRed")===false
    && document.getElementById("annualIncome").classList.contains("backgroundRed")===false
    && document.getElementById("interestRate").classList.contains("backgroundRed")===false
    && document.getElementById("name").classList.contains("backgroundRed")===false){
        document.getElementById("submitButton").disabled = false;
        console.log("abled")
        //console.log(document.getElementById("submitButton").classList)
        console.log(document.getElementById("inputBankAccountNum").classList.contains("backgroundRed")
        ,document.getElementById("loanAmount").classList.contains("backgroundRed")
        ,document.getElementById("annualIncome").classList.contains("backgroundRed")
        ,document.getElementById("interestRate").classList.contains("backgroundRed")
        ,document.getElementById("name").classList.contains("backgroundRed"))
    }else{
        document.getElementById("submitButton").disabled = true;
        console.log("disabled")
        console.log(document.getElementById("inputBankAccountNum").classList.contains("backgroundRed")
        ,document.getElementById("loanAmount").classList.contains("backgroundRed")
        ,document.getElementById("annualIncome").classList.contains("backgroundRed")
        ,document.getElementById("interestRate").classList.contains("backgroundRed")
        ,document.getElementById("name").classList.contains("backgroundRed"))
    }
});



//口座番号入力修正
    function changeNum(a){
    console.log(a.value)
    a.value=toHalfWidth(a.value)
    //a.value=a.value.replace(/[^0-9０-９]/g,'').replace('０','0').replace('１','1').replace('２','2').replace('３','3').replace('４','4').replace('５','5').replace('６','6').replace('７','7').replace('８','8').replace('９','9')
    if (a.value.length >=7){
        a.value=a.value.slice(0,7)
        }
    return a
    console.log(a.value)
    }
//数字入力修正
    function changeNumNormal(a){
    a.value=a.value.replace(/[^0-9０-９]/g,'').replace('０','0').replace('１','1').replace('２','2').replace('３','3').replace('４','4').replace('５','5').replace('６','6').replace('７','7').replace('８','8').replace('９','9')
    return a
    }

//小数入力修正
    function changeNumDecimal(a){
    a.value=a.value.replace(/[^0-9０-９.。]/g,'').replace('０','0').replace('１','1').replace('２','2').replace('３','3').replace('４','4').replace('５','5').replace('６','6').replace('７','7').replace('８','8').replace('９','9').replace('。','.')
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

//借入金額//借入金額
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

//金利
    function validInterestRate(i,where){
        i=changeNumDecimal(i)
        var input=i.value
        //.console.log(typeof input);
        if (input !=="" && 0<=input && input<=100 && input.search(/[^\.]+\.[0-9][0-9]$/)!==-1) {//0以上100以下かつ小数第二位まで入力されている
            document.getElementById(where).classList.remove("backgroundRed")
        }else{
            document.getElementById(where).classList.add("backgroundRed")
        }
    }


//債務者名
    function validName(i,where){
        var input=i.value
        if (/^[ぁ-んァ-ヶ一-龠々ー]+$/.test(input)===true){//日本語だけで構成されている
            document.getElementById(where).classList.remove("backgroundRed")
        }else{
            document.getElementById(where).classList.add("backgroundRed")
        }
    }