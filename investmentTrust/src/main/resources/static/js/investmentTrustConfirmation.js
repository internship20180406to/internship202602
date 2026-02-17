const submitButton = document.getElementById("submit");

submitButton.addEventListener('click', (e) => {
    // 1. ワンタイムパスワードの入力を求める（promptを使うのが一番簡単！）
    const otp = prompt("【CFG本人認証】\n登録済みの端末に送られた4桁の数字を入力してください。");

    // 2. パスワードの判定（今回は練習用に 1234 に設定）
    if (otp === "1234") {
        // パスワードが合っていれば、いつもの最終確認へ
        const result = confirm("認証に成功しました。申し込みを実行しますか？");
        if (!result) {
            e.preventDefault(); // キャンセルなら中止
        }
    } else if (otp === null) {
        // キャンセルボタンが押された場合
        e.preventDefault();
    } else {
        // 間違っていた場合
        alert("パスワードが正しくありません。認証に失敗しました。");
        e.preventDefault(); // 送信を強制中止
    }
});
//const submitButton = document.getElementById("submit")
   // submitButton.addEventListener('click', (e) => {
  const result = confirm("操作を実行します");
      if (!result) {e.preventDefault();
            console.log("中止");}
      else {console.log("実行");
        }
    });
