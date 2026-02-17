//口座番号入力修正
    function changeNum(a){
    a.value=a.value.replace(/[^0-9０-９]/g,'').replace('０','0').replace('１','1').replace('２','2').replace('３','3').replace('４','4').replace('５','5').replace('６','6').replace('７','7').replace('８','8').replace('９','9')
    if (a.value.length >=7){
        a.value=a.value.slice(0,7)
        }
    }
// セレクトボックスの値が変更されたときに呼ばれる関数
    function bankAccountNumChange() {
        // セレクトボックスの選択された値を取得
        var input = document.getElementById("inputBankAccountNum").value;
        console.log('inputBankAccountNum=${input}')

        // バリデーション処理
        //if (selectedName !== "選択してください") {
        　　　　　　　// 取得した値をコンソールに出力
           //         console.log("選択された名前: " + selectedName);
        　　　　　　　// 「選択してください」以外が選ばれた場合はボタンを有効化
             //       document.getElementById("submitButton").disabled = false;
               //     changeAction(selectedName);
                //} else {
                  //  // 「選択してください」が選ばれた場合はボタンを無効化
                    //document.getElementById("submitButton").disabled = true;
                //}
    }

// セレクトボックスの変更後の値が「選択してください」以外だとhandlePlaceChange関数から呼ばれる
        function changeAction(selectedName) {
            const form = document.getElementById('tutorialForm');
            form.addEventListener('submit', function(event) {
                // ここでURLパラメータを追加
                const params = new URLSearchParams();
                params.append('Name', selectedName);

                // フォームのアクションにパラメータを付け加える
                form.action = '/tutorial?' + params.toString();
            });
        };