
//金利データ
const rates =[[2,4.60],[3,4.90],[5,5.20],[10,5.55],[15,5.85],[20,6.05],[35,6.30]]


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

//金利表示
function displayRate (i){//引数にvalueの値
const yearsInputted = i;
rate=calculateRate(yearsInputted)
//console.log(`rate=${rate}`)
document.getElementById("interestRate").value=rate
if (rate===null){document.getElementById("DisplayedInterestRate").textContent=""}
else{document.getElementById("DisplayedInterestRate").textContent=rate+"%"}
}

//確認ボタンを押せなくする
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
    function changeNum(a){//.valueありで引数入れる
    let newA=a.replace(/[^0-9０-９]/g,'').replace(/０/g,'0').replace(/１/g,'1').replace(/２/g,'2').replace(/３/g,'3').replace(/４/g,'4').replace(/５/g,'5').replace(/６/g,'6').replace(/７/g,'7').replace(/８/g,'8').replace(/９/g,'9');
    if (newA.length >=7){
        newA=newA.slice(0,7)
    }
    a = newA
    return a
    }

//数字入力修正
    function changeNumNormal(a){
    let newA=a.replace(/[^0-9０-９]/g,'').replace(/０/g,'0').replace(/１/g,'1').replace(/２/g,'2').replace(/３/g,'3').replace(/４/g,'4').replace(/５/g,'5').replace(/６/g,'6').replace(/７/g,'7').replace(/８/g,'8').replace(/９/g,'9');
    a = newA
    return a
    }

//小数入力修正
    function changeNumDecimal(a){
    a.value=a.value.replace(/[^0-9０-９.。]/g,'').replace('０','0').replace('１','1').replace('２','2').replace('３','3').replace('４','4').replace('５','5').replace('６','6').replace('７','7').replace('８','8').replace('９','9').replace('。','.')
    return a
    }

// 口座番号バリデーション処理
    function validBankAccountNum(i,where) {//iはvalueの値
        //i=changeNum(i)
        console.log(`validBankAccountNum_i=${i}`)
        if (i.length === 7) {
            document.getElementById(where).classList.remove("backgroundRed")
        } else {
            document.getElementById(where).classList.add("backgroundRed")
        }
        //return i
    }

//借入金額//借入金額//返済期間バリデーション処理
    function validLoanAmount(i,where){
        if (i) {
            document.getElementById(where).classList.remove("backgroundRed")
        }else{
            document.getElementById(where).classList.add("backgroundRed")
        }
    }

//債務者名バリデーション処理
    function validName(i,where){
        var input=i.value
        if (/^[ぁ-んァ-ヶ一-龠々ー]+$/.test(input)===true){//日本語だけで構成されている
            document.getElementById(where).classList.remove("backgroundRed")
        }else{
            document.getElementById(where).classList.add("backgroundRed")
        }
    }