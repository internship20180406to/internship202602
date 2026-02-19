
//金利データ
const rateData={
"0":[[2,4.60],[3,4.90],[5,5.20],[10,5.55],[15,5.85],[20,6.05],[35,6.30]],
"1":[[10,null],[15,3.50],[20,3.65],[25,3.75],[30,4.10],[35,4.25]]
}
const flexRateData=2.90

//金利の表を作成
function displayRateTable(number){

    const yearsRow = document.getElementById('yearsRow'+number);
    const ratesRow = document.getElementById('ratesRow'+number);
    rateData[number].forEach(item => {
        const yearCell = document.createElement('td');
        yearCell.textContent = `~${item[0]}年`;
        yearsRow.appendChild(yearCell);
        const rateCell = document.createElement('td');
        rateCell.textContent = `${item[1]}%`;
        ratesRow.appendChild(rateCell);
    });
}
//変動金利の表を作成
function displayFlexRateTable(number){
    const yearsRow = document.getElementById('yearsRow'+number);
    const ratesRow = document.getElementById('ratesRow'+number);
    const rate = flexRateData
    const yearCell = document.createElement('td');
    yearCell.textContent = "-";
    yearsRow.appendChild(yearCell);
    const rateCell = document.createElement('td');
    rateCell.textContent = `${rate}%`;
    ratesRow.appendChild(rateCell);
}
//ページの読み込み時に上の関数を実行
document.addEventListener('DOMContentLoaded',() => {
                                                 displayRateTable("0");
                                                 displayRateTable("1");
                                                 displayFlexRateTable("-1")
                                             })

//金利計算
function calculateRate(a){
a=Number.parseInt(a)//intにする
for (let n = 0; n < rates.length; n++){
if (a<=rates[n][0]){
    return rates[n][1]}}
//if (a>=35){
  //  return 6.50}
return null
}

//金利表示//返済総額表示
function displayRate_RepaymentTotal_RepaymentPerMonth (i){//引数にvalueの値
    const yearsInputted = i;
    rate=calculateRate(yearsInputted)
    //console.log(`rate=${rate}`)
    document.getElementById("interestRate").value=rate
    loanAmount=document.getElementById("loanAmount").value
    if (rate===null){
        document.getElementById("DisplayedInterestRate").textContent=""
        document.getElementById("DisplayedRepaymentTotal").textContent=""
        document.getElementById("DisplayedRepaymentPerMonth").textContent=""
    }else{document.getElementById("DisplayedInterestRate").textContent=rate+"%"
        if (loanAmount===null){
            document.getElementById("DisplayedRepaymentTotal").textContent=""
        }else{
            document.getElementById("DisplayedRepaymentTotal").textContent=loanAmount*(100+(rate/100))+"円"
            document.getElementById("DisplayedRepaymentPerMonth").textContent=(loanAmount*(rate/100))/(yearsInputted*12)+"円"
        }
    }
}


//確認ボタンを押せなくする
document.getElementById("submitButton").addEventListener("mouseover",function(){
    //console.log(document.getElementById("bankName").matches(".backgroundRed, .default"))
    if (document.getElementById("bankName").matches(".backgroundRed, .default")===false
    && document.getElementById("branchName").matches(".backgroundRed, .default")===false
    && document.getElementById("bankAccountType").matches(".backgroundRed, .default")===false
    && document.getElementById("inputBankAccountNum").matches(".backgroundRed, .default")===false
    && document.getElementById("name").matches(".backgroundRed, .default")===false
    && document.getElementById("loanAmount").matches(".backgroundRed, .default")===false
    && document.getElementById("annualIncome").matches(".backgroundRed, .default")===false
    && document.getElementById("rateType").matches(".backgroundRed, .default")===false
    && document.getElementById("years").matches(".backgroundRed, .default")===false){
        document.getElementById("submitButton").disabled = false;
        console.log("abled")

    }else{
        document.getElementById("submitButton").disabled = true;
        console.log("disabled")
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
        document.getElementById(where).classList.remove("default")
        if (i.length === 7) {
            document.getElementById(where).classList.remove("backgroundRed")
        } else {
            document.getElementById(where).classList.add("backgroundRed")
        }
        //return i
    }

//借入金額//借入金額//返済期間バリデーション処理
    function validLoanAmount(i,where){
        document.getElementById(where).classList.remove("default")
        if (i) {
            document.getElementById(where).classList.remove("backgroundRed")
        }else{
            document.getElementById(where).classList.add("backgroundRed")
        }
    }

//債務者名バリデーション処理
    function validName(i,where){
        document.getElementById(where).classList.remove("default")
        var input=i.value
        if (/^[ぁ-んァ-ヶ一-龠々ー]+$/.test(input)===true){//日本語だけで構成されている
            document.getElementById(where).classList.remove("backgroundRed")
        }else{
            document.getElementById(where).classList.add("backgroundRed")
        }
    }

//選択肢バリデーション処理
    function validOptions(i,where){
        document.getElementById(where).classList.remove("default")
        if (i!=="-"){
            document.getElementById(where).classList.remove("backgroundRed")
        }else{
            document.getElementById(where).classList.add("backgroundRed")
        }
    }