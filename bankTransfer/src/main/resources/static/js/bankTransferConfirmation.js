const form = document.getElementById("bankTransferForm");

form.addEventListener('submit', function(e) {
    const inputs = form.querySelectorAll("input");

    let emptyFields = [];
    inputs.forEach(input => {
        if (!input.value) {
            emptyFields.push(input.placeholder || input.name);
        }
    });

    if (emptyFields.length > 0) {
        e.preventDefault();
        alert("次の項目を入力してください:\n" + emptyFields.join("\n"));
        return false;
    }

    const ok = confirm("操作を実行しますか？");
    if (!ok) {
        e.preventDefault();
        return false;
    }
});
