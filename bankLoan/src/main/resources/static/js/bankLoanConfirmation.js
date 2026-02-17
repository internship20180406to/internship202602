const submitButton = document.getElementById("submit")
    submitButton.addEventListener('click', (e) => {
      if(confirm("操作を実行します")!==false){
      //e.preventDefault;
      window.location='/bankLoan';
      }
    })