// 数値をカンマ区切りでフォーマットする関数
function formatNumberWithComma(num) {
    if (num === null || num === undefined || num === '') return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// すべての支店リストをキャッシュ
let allBranches = {};
let flatBranchList = [];

// 支店一覧を取得してキャッシュ
function initializeBranchData() {
    fetch('/getAllBranches')
        .then(response => response.json())
        .then(data => {
            allBranches = data.branches || {};
            // フラット化した支店リストを作成
            flatBranchList = [];
            for (let prefecture in allBranches) {
                if (Array.isArray(allBranches[prefecture])) {
                    flatBranchList = flatBranchList.concat(allBranches[prefecture]);
                }
            }
            flatBranchList = [...new Set(flatBranchList)]; // 重複を削除
            updateBranchDataList();
        })
        .catch(error => console.error('支店データ取得エラー:', error));
}

// 支店入力フィールドのデータリストを更新
function updateBranchDataList(filterText = '') {
    const datalist = document.getElementById('branchNameList');
    if (!datalist) return;

    datalist.innerHTML = '';

    // フィルターテキストに基づいて候補を絞り込み
    const filtered = filterText ?
        flatBranchList.filter(b => b.includes(filterText)) :
        flatBranchList;

    filtered.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        datalist.appendChild(option);
    });
}

// 支店名入力時の検証警告
function checkBranchNameValidity() {
    const branchNameInput = document.getElementById('branchNameInput');
    const warning = document.getElementById('branchNameWarning');

    if (!branchNameInput || !warning) return;

    const inputValue = (branchNameInput.value || '').trim();

    // 空の場合は警告を非表示
    if (!inputValue) {
        warning.style.display = 'none';
        return;
    }

    // 入力値が有効な支店リストに含まれているか確認
    const isValid = flatBranchList.includes(inputValue);
    warning.style.display = isValid ? 'none' : 'inline';
}

// エリア検索UI を表示/非表示
function toggleAreaSearch() {
    const container = document.getElementById('areaSearchContainer');
    const btn = document.getElementById('searchByAreaBtn');

    if (!container) return;

    if (container.style.display === 'none') {
        container.style.display = 'block';
        btn.textContent = 'エリアを閉じる';

        // 都道府県ボタンを生成
        generatePrefectureButtons();
    } else {
        container.style.display = 'none';
        btn.textContent = 'エリアで探す';
    }
}

// 都道府県ボタンを生成
function generatePrefectureButtons() {
    const container = document.getElementById('prefectureButtonsContainer');
    if (!container) return;

    container.innerHTML = '';

    for (let prefecture in allBranches) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = prefecture;
        btn.style.cssText = 'padding: 8px 12px; background-color: #e9ecef; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; transition: all 0.2s;';

        btn.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#2185D0';
            this.style.color = 'white';
            this.style.borderColor = '#2185D0';
        });

        btn.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#e9ecef';
            this.style.color = 'black';
            this.style.borderColor = '#ddd';
        });

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showBranchesForPrefecture(prefecture);
        });

        container.appendChild(btn);
    }
}

// 特定の都道府県の支店一覧を表示
function showBranchesForPrefecture(prefecture) {
    if (!allBranches[prefecture]) return;

    const container = document.getElementById('prefectureButtonsContainer');
    if (!container) return;

    // 都道府県ボタンをクリア
    container.innerHTML = '';

    // 戻るボタンを追加
    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.textContent = '← 都道府県一覧に戻る';
    backBtn.style.cssText = 'padding: 8px 12px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 10px; width: 100%;';
    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        generatePrefectureButtons();
    });
    container.appendChild(backBtn);

    // 支店ボタンを追加
    const branchButtonsDiv = document.createElement('div');
    branchButtonsDiv.style.display = 'flex';
    branchButtonsDiv.style.flexWrap = 'wrap';
    branchButtonsDiv.style.gap = '8px';

    allBranches[prefecture].forEach(branch => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = branch;
        btn.style.cssText = 'padding: 8px 12px; background-color: #d4edff; border: 1px solid #2185D0; border-radius: 4px; cursor: pointer; transition: all 0.2s;';

        btn.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#2185D0';
            this.style.color = 'white';
        });

        btn.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#d4edff';
            this.style.color = 'black';
        });

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const branchInput = document.getElementById('branchNameInput');
            if (branchInput) {
                branchInput.value = branch;
                branchInput.dispatchEvent(new Event('input'));
                // エリア検索を閉じる
                const areaContainer = document.getElementById('areaSearchContainer');
                if (areaContainer) {
                    areaContainer.style.display = 'none';
                    const searchBtn = document.getElementById('searchByAreaBtn');
                    if (searchBtn) {
                        searchBtn.textContent = 'エリアで探す';
                    }
                }
            }
        });

        branchButtonsDiv.appendChild(btn);
    });

    container.appendChild(branchButtonsDiv);
}

// 支店名入力フィールドの初期化
function initializeBranchNameField() {
    const branchNameInput = document.getElementById('branchNameInput');
    if (!branchNameInput) return;

    // 入力フィールドに変更があった場合の処理
    branchNameInput.addEventListener('input', function() {
        const inputValue = this.value.trim();

        // フィルタリングとデータリストの更新
        updateBranchDataList(inputValue);

        // 支店名の有効性チェック
        checkBranchNameValidity();

        // リアルタイムで保存
        saveFormDataToSessionStorage();
    });
}

// 都道府県選択時の支店名フィールド更新（削除：都道府県selectがないため不要）

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
    // 入力フォーム画面の場合
    if (document.getElementById('loanAmount')) {
        restoreFormDataFromSessionStorage();
        setupNumberFormatting();
        updateBankAccountNumWarning();
        initializeBranchData(); // 支店データの初期化
        initializeBranchNameField(); // 支店名フィールドの初期化
        updateBranchNameOnPrefectureChange(); // 都道府県選択時の支店名フィールド更新
    }

    // 確認画面の場合は既存の処理を継続
});

// 数値をカンマ区切りでフォーマットする関数
function formatNumberWithComma(num) {
    if (num === null || num === undefined || num === '') return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function updateBankAccountNumWarning() {
    const bankAccountNumInput = document.getElementById('bankAccountNum');
    const warning = document.getElementById('bankAccountNumWarning');
    if (!bankAccountNumInput || !warning) {
        return;
    }
    const digits = (bankAccountNumInput.value || '').replace(/\D/g, '');
    if (!digits) {
        warning.style.display = 'none';
        return;
    }
    warning.style.display = digits.length === 7 ? 'none' : 'inline';
}

// フォームデータをセッションストレージに保存
function saveFormDataToSessionStorage() {
    const bankName = document.querySelector('[name="bankName"]');
    const branchName = document.querySelector('[name="branchName"]');
    const bankAccountType = document.querySelector('[name="bankAccountType"]');
    const bankAccountNum = document.querySelector('[name="bankAccountNum"]');
    const name = document.querySelector('[name="name"]');
    const loanTypeSelect = document.getElementById('loanTypeSelect');
    const loanAmountInput = document.getElementById('loanAmount');
    const annualIncomeInput = document.getElementById('annualIncome');
    const loanPeriodInput = document.getElementById('loanPeriod');

    const formData = {
        bankName: bankName ? bankName.value : '',
        branchName: branchName ? branchName.value : '',
        bankAccountType: bankAccountType ? bankAccountType.value : '',
        bankAccountNum: bankAccountNum ? bankAccountNum.value : '',
        name: name ? name.value : '',
        loanType: loanTypeSelect ? loanTypeSelect.value : '',
        loanAmount: loanAmountInput ? loanAmountInput.value.replace(/,/g, '') : '',
        annualIncome: annualIncomeInput ? annualIncomeInput.value.replace(/,/g, '') : '',
        loanPeriod: loanPeriodInput ? loanPeriodInput.value : ''
    };

    sessionStorage.setItem('bankLoanFormData', JSON.stringify(formData));
}

// セッションストレージからフォームデータを復元
function restoreFormDataFromSessionStorage() {
    const savedData = sessionStorage.getItem('bankLoanFormData');

    if (savedData) {
        try {
            const formData = JSON.parse(savedData);

            const bankName = document.querySelector('[name="bankName"]');
            const branchName = document.querySelector('[name="branchName"]');
            const bankAccountType = document.querySelector('[name="bankAccountType"]');
            const bankAccountNum = document.querySelector('[name="bankAccountNum"]');
            const name = document.querySelector('[name="name"]');
            const loanTypeSelect = document.getElementById('loanTypeSelect');
            const loanAmountInput = document.getElementById('loanAmount');
            const annualIncomeInput = document.getElementById('annualIncome');
            const loanPeriodInput = document.getElementById('loanPeriod');

            // 金融機関名を先に復元
            if (bankName && formData.bankName) bankName.value = formData.bankName;

            // 支店名を復元
            if (branchName && formData.branchName) branchName.value = formData.branchName;

            // 他のフィールドを復元
            if (bankAccountType) {
                if (formData.bankAccountType) {
                    bankAccountType.value = formData.bankAccountType;
                } else {
                    // 保存されたデータがない場合はリセット
                    bankAccountType.selectedIndex = 0;
                    bankAccountType.value = '';
                }
            }

            if (bankAccountNum && formData.bankAccountNum) bankAccountNum.value = formData.bankAccountNum;
            if (name && formData.name) name.value = formData.name;

            // ローンの種類を復元
            if (loanTypeSelect) {
                if (formData.loanType) {
                    loanTypeSelect.value = formData.loanType;
                } else {
                    // 保存されたデータがない場合はリセット
                    loanTypeSelect.selectedIndex = 0;
                    loanTypeSelect.value = '';
                }
            }

            if (loanAmountInput && formData.loanAmount) {
                loanAmountInput.value = formatNumberWithComma(formData.loanAmount);
            }
            if (annualIncomeInput && formData.annualIncome) {
                annualIncomeInput.value = formatNumberWithComma(formData.annualIncome);
            }
            if (loanPeriodInput && formData.loanPeriod) {
                loanPeriodInput.value = formData.loanPeriod;
            }
            updateBankAccountNumWarning();
        } catch (e) {
            console.error('フォームデータの復元に失敗しました:', e);
        }
    }
}

// リアルタイム金利計算関数
function calculateAndDisplayInterestRate() {
    const loanTypeSelect = document.getElementById('loanTypeSelect');
    const loanPeriod = document.getElementById('loanPeriod');
    const displayInterestRate = document.getElementById('displayInterestRate');

    // 必須項目が入力されているか確認
    if (!loanTypeSelect || !loanTypeSelect.value ||
        !loanPeriod || !loanPeriod.value) {
        // 未入力の場合は---を表示
        if (displayInterestRate) {
            displayInterestRate.textContent = '---';
        }
        return;
    }

    const loanPeriodValue = parseInt(loanPeriod.value);

    // 数値チェック
    if (isNaN(loanPeriodValue)) {
        if (displayInterestRate) {
            displayInterestRate.textContent = '---';
        }
        return;
    }

    // API呼び出し
    fetch(`/calculateInterestRate?loanType=${encodeURIComponent(loanTypeSelect.value)}&loanPeriod=${loanPeriodValue}`)
        .then(response => response.json())
        .then(data => {
            if (displayInterestRate && data.interestRate) {
                displayInterestRate.textContent = data.interestRate;
            }
        })
        .catch(error => {
            console.error('金利計算エラー:', error);
            if (displayInterestRate) {
                displayInterestRate.textContent = '---';
            }
        });
}

// 入力フィールドの数値をリアルタイムでフォーマット
function setupNumberFormatting() {
    const loanAmountInput = document.getElementById('loanAmount');
    const annualIncomeInput = document.getElementById('annualIncome');

    if (loanAmountInput) {
        loanAmountInput.addEventListener('input', function() {
            // 数値のみを保持（内部値）
            let value = this.value.replace(/,/g, '');
            // フォーマットして表示（表示用）
            this.value = formatNumberWithComma(value);
            // リアルタイムで保存
            saveFormDataToSessionStorage();
        });
    }

    if (annualIncomeInput) {
        annualIncomeInput.addEventListener('input', function() {
            // 数値のみを保持（内部値）
            let value = this.value.replace(/,/g, '');
            // フォーマットして表示（表示用）
            this.value = formatNumberWithComma(value);
            // リアルタイムで保存
            saveFormDataToSessionStorage();
        });
    }

    // その他のフィールドの変更も検知
    const loanTypeSelect = document.getElementById('loanTypeSelect');
    const bankName = document.querySelector('[name="bankName"]');
    const branchName = document.querySelector('[name="branchName"]');
    const bankAccountType = document.querySelector('[name="bankAccountType"]');
    const bankAccountNum = document.querySelector('[name="bankAccountNum"]');
    const nameInput = document.querySelector('[name="name"]');

    if (loanTypeSelect) {
        loanTypeSelect.addEventListener('change', function() {
            saveFormDataToSessionStorage();
            calculateAndDisplayInterestRate();
        });
    }
    if (bankName) {
        bankName.addEventListener('change', function() {
            saveFormDataToSessionStorage();
        });
    }
    if (branchName) {
        branchName.addEventListener('change', saveFormDataToSessionStorage);
    }
    if (bankAccountType) {
        bankAccountType.addEventListener('change', saveFormDataToSessionStorage);
    }
    if (bankAccountNum) {
        bankAccountNum.addEventListener('input', function() {
            saveFormDataToSessionStorage();
            updateBankAccountNumWarning();
        });
    }
    if (nameInput) {
        nameInput.addEventListener('input', saveFormDataToSessionStorage);
    }

    // 借入期間の変更も検知
    const loanPeriodInput = document.getElementById('loanPeriod');
    if (loanPeriodInput) {
        loanPeriodInput.addEventListener('input', function() {
            saveFormDataToSessionStorage();
            calculateAndDisplayInterestRate();
        });
    }
}

// フォーム送信時に入力値からカンマを削除
function removeCommasBeforeSubmit() {
    const loanAmountInput = document.getElementById('loanAmount');
    const annualIncomeInput = document.getElementById('annualIncome');

    if (loanAmountInput) {
        loanAmountInput.value = loanAmountInput.value.replace(/,/g, '');
    }

    if (annualIncomeInput) {
        annualIncomeInput.value = annualIncomeInput.value.replace(/,/g, '');
    }
}

// フォーム送信時のバリデーション
function validateFormBeforeSubmit(event) {
    const bankName = document.querySelector('[name="bankName"]');
    const branchName = document.querySelector('[name="branchName"]');
    const bankAccountType = document.querySelector('[name="bankAccountType"]');
    const bankAccountNum = document.querySelector('[name="bankAccountNum"]');
    const name = document.querySelector('[name="name"]');
    const loanTypeSelect = document.getElementById('loanTypeSelect');
    const loanAmountInput = document.getElementById('loanAmount');
    const annualIncomeInput = document.getElementById('annualIncome');
    const loanPeriodInput = document.getElementById('loanPeriod');

    // バリデーション結果格納用
    let errorMessages = [];

    // 各フィールドのバリデーション
    if (!bankName || !bankName.value || bankName.value.trim() === '') {
        errorMessages.push('金融機関名を選択してください');
    }

    if (!branchName || !branchName.value || branchName.value.trim() === '') {
        errorMessages.push('支店名を入力してください');
    } else {
        // 支店名が有効か確認（データに存在するか）
        const branchNameValue = branchName.value.trim();
        if (!flatBranchList.includes(branchNameValue)) {
            errorMessages.push('入力した支店名が見つかりません。正しい支店名を入力してください。');
        }
    }

    if (!bankAccountType || !bankAccountType.value || bankAccountType.value.trim() === '') {
        errorMessages.push('口座種別を選択してください');
    }

    if (!bankAccountNum || !bankAccountNum.value || bankAccountNum.value.trim() === '') {
        errorMessages.push('口座番号を入力してください');
    }

    if (!name || !name.value || name.value.trim() === '') {
        errorMessages.push('申込者名を入力してください');
    }

    if (!loanTypeSelect || !loanTypeSelect.value || loanTypeSelect.value.trim() === '') {
        errorMessages.push('ローンの種類を選択してください');
    }

    if (!loanAmountInput || !loanAmountInput.value || loanAmountInput.value.replace(/,/g, '').trim() === '') {
        errorMessages.push('借入金額を入力してください');
    } else {
        // カンマを除いた値が数値かチェック
        const loanAmountValue = loanAmountInput.value.replace(/,/g, '').trim();
        if (isNaN(loanAmountValue) || loanAmountValue === '') {
            errorMessages.push('借入金額は数値を入力してください');
        }
    }

    if (!annualIncomeInput || !annualIncomeInput.value || annualIncomeInput.value.replace(/,/g, '').trim() === '') {
        errorMessages.push('借入年収を入力してください');
    } else {
        // カンマを除いた値が数値かチェック
        const annualIncomeValue = annualIncomeInput.value.replace(/,/g, '').trim();
        if (isNaN(annualIncomeValue) || annualIncomeValue === '') {
            errorMessages.push('借入年収は数値を入力してください');
        }
    }

    if (!loanPeriodInput || !loanPeriodInput.value || loanPeriodInput.value.trim() === '') {
        errorMessages.push('借入期間を入力してください');
    } else {
        // 借入期間が数値かチェック
        const loanPeriodValue = loanPeriodInput.value.trim();
        if (isNaN(loanPeriodValue) || loanPeriodValue === '') {
            errorMessages.push('借入期間は数値を入力してください');
        } else if (parseInt(loanPeriodValue) < 1 || parseInt(loanPeriodValue) > 50) {
            errorMessages.push('借入期間は1年以上50年以下で入力してください');
        }
    }

    // エラーメッセージ表示用の要素を取得
    const errorMessageContainer = document.getElementById('errorMessageContainer');
    const errorList = document.getElementById('errorList');

    // エラーがある場合は送信を中止して Web上に表示
    if (errorMessages.length > 0) {
        event.preventDefault();

        // エラーリストをクリア
        errorList.innerHTML = '';

        // エラーメッセージをリスト化して表示
        errorMessages.forEach(function(message) {
            const listItem = document.createElement('li');
            listItem.textContent = message;
            errorList.appendChild(listItem);
        });

        // エラーコンテナを表示
        errorMessageContainer.classList.add('show');

        // ページトップにスクロール
        errorMessageContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        return false;
    }

    // バリデーション成功時はエラーコンテナを非表示
    errorMessageContainer.classList.remove('show');

    // バリデーション成功時はカンマを削除
    removeCommasBeforeSubmit();
    return true;
}

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
            fetch('/saveBankLoan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            })
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

// ページ読み込み時にフォーマット機能を初期化
document.addEventListener('DOMContentLoaded', function() {
    // 入力フォーム画面の場合
    if (document.getElementById('loanAmount')) {
        restoreFormDataFromSessionStorage();
        setupNumberFormatting();
        updateBankAccountNumWarning();
        initializeBranchData(); // 支店データの初期化
        initializeBranchNameField(); // 支店名フィールドの初期化
    }

    // 確認画面の場合は既存の処理を継続
});
