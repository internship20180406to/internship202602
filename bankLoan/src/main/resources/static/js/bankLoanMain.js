
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
        yearCell.style.border="1px solid #DAE7F2"
        yearCell.textContent = `~${item[0]}年`;
        yearsRow.appendChild(yearCell);
        const rateCell = document.createElement('td');
        rateCell.style.border="1px solid #DAE7F2"
        if (item[1]){
        rateCell.textContent = `${item[1].toFixed(2)}%`;
        }else{
        rateCell.textContent ="-"
        }
        ratesRow.appendChild(rateCell);
    });
}
//変動金利の表を作成
function displayFlexRateTable(number){
    const yearsRow = document.getElementById('yearsRow'+number);
    const ratesRow = document.getElementById('ratesRow'+number);
    const rate = flexRateData
    const yearCell = document.createElement('td');
    yearCell.style.border="1px solid #DAE7F2"
    yearCell.textContent = "-";
    yearsRow.appendChild(yearCell);
    const rateCell = document.createElement('td');
    rateCell.style.border="1px solid #DAE7F2"
    rateCell.textContent = `${rate.toFixed(2)}%`;
    ratesRow.appendChild(rateCell);
}
//ページの読み込み時に上の関数を実行
document.addEventListener('DOMContentLoaded',() => {
                                                 displayRateTable("0");
                                                 displayRateTable("1");
                                                 displayFlexRateTable("-1")
                                             })

//金利計算
function calculateRate(a,rateType){
a=Number.parseInt(a)//intにする
if (rateType==="-1"){return flexRateData}//変動
if (rateType==="0"||rateType==="1"){
for (let n = 0; n < rateData[rateType].length; n++){
if (a<=rateData[rateType][n][0]){
    return rateData[rateType][n][1]}}
}
return null
console.log("returnedNull")
}

//金利表示//返済総額表示
function displayRate_RepaymentTotal_RepaymentPerMonth (){
    console.log("functioned displayRate_RepaymentTotal_RepaymentPerMonth")
    const yearsInputted = document.getElementById("years").value;
    const rateType=document.getElementById("rateType").value
    console.log(rateType)
    let number=""
    if (rateType==="変動金利"){number="-1"}
    if (rateType==="特約固定金利"){number="0"}
    if (rateType==="長期固定金利"){number="1"}
    rate=calculateRate(yearsInputted,number)

    console.log(`rate=${rate}`)
    document.getElementById("interestRate").value=rate
    loanAmount=document.getElementById("loanAmount").value
    if (rate===null){
        document.getElementById("DisplayedInterestRate").textContent="-"
        document.getElementById("DisplayedRepaymentTotal").textContent="-"
        document.getElementById("DisplayedRepaymentPerMonth").textContent="-"
    }else{document.getElementById("DisplayedInterestRate").textContent=rate+"%"
        if (loanAmount===null){
            document.getElementById("DisplayedRepaymentTotal").textContent="-"
            document.getElementById("DisplayedRepaymentPerMonth").textContent="-"
        }else{
            const repaymentPerMonth=(Math.ceil((loanAmount*((100+rate)/100))/(yearsInputted*12)))
            document.getElementById("DisplayedRepaymentPerMonth").textContent=repaymentPerMonth.toLocaleString()+"円"
            document.getElementById("DisplayedRepaymentTotal").textContent=(repaymentPerMonth*12*yearsInputted).toLocaleString()+"円"

        }
    }
}





//確認ボタンを押せなくする
document.getElementById("submitButton").addEventListener("mouseover",function(){
    validAll();
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
    if (newA.length >=7){newA=newA.slice(0,7)}
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
        var input=i
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

function validAll(){
    validOptions(document.getElementById("bankName").value,'bankName')
    validOptions(document.getElementById("branchName").value,'branchName')
    validOptions(document.getElementById("bankAccountType").value,'bankAccountType')
    validOptions(document.getElementById("rateType").value,'rateType')
    validName(document.getElementById("name").value,'name')
    validLoanAmount(document.getElementById("loanAmount").value,'loanAmount')
    validLoanAmount(document.getElementById("annualIncome").value,'annualIncome')
    validLoanAmount(document.getElementById("years").value,'years')
    validBankAccountNum(document.getElementById("inputBankAccountNum").value,'inputBankAccountNum')
}
