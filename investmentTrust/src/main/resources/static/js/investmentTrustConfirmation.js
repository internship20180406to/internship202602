const submitButton = document.getElementById("submit");

submitButton.addEventListener('click', (e) => {
    // 1. ワンタイムパスワードの入力を求める
    const otp = prompt("【CFG本人認証】\n登録済みの端末に送られた4桁の数字を入力してください。");

    // 2. パスワードの判定
    if (otp === "1234") {
        // 認証成功時のみ、最終確認のconfirmを出す
        const result = confirm("認証に成功しました。申し込みを実行しますか？");
        if (result) {
            console.log("実行");
            // ここで preventDefault しなければ、フォームが送信されます
        } else {
            console.log("中止");
            e.preventDefault(); // キャンセルなら送信中止
        }
    } else if (otp === null) {
        // promptでキャンセルボタンが押された場合
        console.log("認証キャンセル");
        e.preventDefault();
    } else {
        // パスワードが間違っていた場合
        alert("パスワードが正しくありません。認証に失敗しました。");
        e.preventDefault(); // 送信を強制中止
    }
}); // ← ここに閉じカッコが必要でした

//const submitButton = document.getElementById("submit")
   // submitButton.addEventListener('click', (e) => {
  //const result = confirm("操作を実行します");
     // if (!result) {e.preventDefault();
       //     console.log("中止");}
      //else {console.log("実行");
        //}
    //});
