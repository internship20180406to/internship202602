const submitButton = document.getElementById("submit")
    submitButton.addEventListener('click', (e) => {
        const result=confirm("操作を実行します")
      if(!result){//キャンセルが押されたら
      e.preventDefault();
      console.log("cancelled")
      //window.location='/bankLoan';
      }
    })