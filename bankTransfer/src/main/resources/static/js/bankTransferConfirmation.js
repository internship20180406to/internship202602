const submitButton = document.getElementById("submit");
submitButton.addEventListener('click', (e) => {
  const ok = confirm("操作を実行しますか？");
  if (!ok) {
    e.preventDefault();
  }
});
