// 数値をカンマ区切りでフォーマットする関数
// (moved to bankLoanFormatters.js)

// 返済シミュレーション関数は bankLoanRepayment.js に移動


// 支店UI関連の関数は bankLoanBranchUi.js に移動

// フォーム/バリデーション関連の関数は bankLoanForm.js / bankLoanValidation.js に移動

// 確認画面の申込ボタンの処理
const submitButton = document.getElementById("submitButton");
if (submitButton) {
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();

        // ダイアログを表示
        const userConfirmed = confirm("ローンを申し込みます。よろしいですか？");

        if (userConfirmed) {
            // OKが押された場合、データを保存してから完了画面へ遷移
            const params = new URLSearchParams();
            params.append('bankName', document.getElementById('bankName').value);
            params.append('branchName', document.getElementById('branchName').value);
            params.append('bankAccountType', document.getElementById('bankAccountType').value);
            params.append('bankAccountNum', document.getElementById('bankAccountNum').value);
            params.append('name', document.getElementById('applicantName').value);
            params.append('loanType', document.getElementById('loanType').value);
            // カンマを除去して数値のみを送信
            params.append('loanAmount', document.getElementById('loanAmount').value.replace(/,/g, ''));
            params.append('annualIncome', document.getElementById('annualIncome').value.replace(/,/g, ''));
            params.append('loanPeriod', document.getElementById('loanPeriod').value);
            params.append('interestRate', document.getElementById('interestRate').value);

            // データを保存
            const savePromise = bankLoanApi ? bankLoanApi.saveBankLoan(params) : fetch('/saveBankLoan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            savePromise
            .then(response => {
                if (!response.ok) {
                    throw new Error('サーバーエラー: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // 保存成功後、完了画面へ遷移
                    window.location.href = '/bankLoanCompletion';
                } else {
                    alert('データの保存に失敗しました。');
                }
            })
            .catch(error => {
                console.error('エラー:', error);
                alert('データの保存中にエラーが発生しました: ' + error.message);
            });
        }
        // キャンセルが押された場合は何もせず、確認画面に留まる
    });
}


// 金利表示用のフォーマットヘルパー
// (moved to bankLoanFormatters.js)
