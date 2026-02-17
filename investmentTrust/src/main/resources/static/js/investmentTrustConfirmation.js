const submitButton = document.getElementById("submit")
    submitButton.addEventListener('click', (e) => {
  const result = confirm("操作を実行します");
      if (!result) {e.preventDefault();
            console.log("中止");}
      else {console.log("実行");
        }
    });
