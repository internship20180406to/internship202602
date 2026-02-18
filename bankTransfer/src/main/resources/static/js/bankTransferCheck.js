document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".form-confirmation-button");

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const form = document.querySelector("form");
        //入力の確認
        if (!form.checkValidity()) {
            alert("すべての必須項目を入力してください。");
            return;
        }
        //残高不足かどうか
        const money = parseInt(document.getElementById("money").value || 0);
        const bankName = document.querySelector("select[name='bankName']").value;
        const balance = parseInt(document.getElementById("balance").value || 0);
        let fee = 0;
        if (bankName !== "こども銀行" && bankName !== "おにぎり銀行" && bankName !== "ながれぼし銀行") {
            fee = (money < 30000) ? 220 : 440;
        }
        const total = money + fee;
        if (total > balance) {
            alert("残高が不足しています。");
            return;
        }

        form.submit();
    });
});
