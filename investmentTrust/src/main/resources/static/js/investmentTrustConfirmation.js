const submitButton = document.getElementById("submit");
submitButton.addEventListener('click', (e) => {
    if (!confirm("注文を確定しますか？")) {
        e.preventDefault();
    }
});