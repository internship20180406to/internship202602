// Branch UI helpers for bank loan UI.
(function(global) {
    const bankLoanState = global.bankLoanState || {
        repaymentAnimationState: { monthly: null, total: null, interest: null },
        allBranches: {},
        flatBranchList: [],
        hasValidationAttempt: false
    };
    const bankLoanApi = global.bankLoanApi;

    function initializeBranchData() {
        console.log('initializeBranchData called');
        const fetchPromise = bankLoanApi ? bankLoanApi.fetchAllBranches() : fetch('/getAllBranches').then(function(response) {
            return response.json();
        });

        fetchPromise
            .then(function(data) {
                console.log('Branch data received:', data);
                bankLoanState.allBranches = data.branches || {};
                bankLoanState.flatBranchList = [];
                for (let prefecture in bankLoanState.allBranches) {
                    if (Array.isArray(bankLoanState.allBranches[prefecture])) {
                        bankLoanState.flatBranchList = bankLoanState.flatBranchList.concat(bankLoanState.allBranches[prefecture]);
                    }
                }
                bankLoanState.flatBranchList = [...new Set(bankLoanState.flatBranchList)];
                console.log('allBranches:', bankLoanState.allBranches);
                console.log('flatBranchList:', bankLoanState.flatBranchList);
                updateBranchDataList();
            })
            .catch(function(error) {
                console.error('支店データ取得エラー:', error);
            });
    }

    function updateBranchDataList(filterText) {
        const datalist = document.getElementById('branchNameList');
        if (!datalist) return;

        datalist.innerHTML = '';

        const filtered = filterText ?
            bankLoanState.flatBranchList.filter(function(b) { return b.includes(filterText); }) :
            bankLoanState.flatBranchList;

        filtered.forEach(function(branch) {
            const option = document.createElement('option');
            option.value = branch;
            datalist.appendChild(option);
        });
    }

    function checkBranchNameValidity() {
        const branchNameInput = document.getElementById('branchNameInput');
        const warning = document.getElementById('branchNameWarning');

        if (!branchNameInput || !warning) return;

        const inputValue = (branchNameInput.value || '').trim();

        if (!inputValue) {
            warning.style.display = 'none';
            return;
        }

        const isValid = bankLoanState.flatBranchList.includes(inputValue);
        warning.style.display = isValid ? 'none' : 'inline';
    }

    function toggleAreaSearch() {
        console.log('toggleAreaSearch called');
        const container = document.getElementById('areaSearchContainer');
        const btn = document.getElementById('searchByAreaBtn');

        console.log('container:', container);
        console.log('btn:', btn);

        if (!container) {
            console.error('areaSearchContainer not found');
            return;
        }

        const isHidden = container.classList.contains('show') === false ||
            global.getComputedStyle(container).display === 'none';

        console.log('isHidden:', isHidden);

        if (isHidden) {
            container.classList.add('show');
            container.style.display = 'block';
            if (btn) {
                btn.textContent = '閉じる';
            }

            console.log('Generating prefecture buttons...');
            generatePrefectureButtons();
        } else {
            container.classList.remove('show');
            container.style.display = 'none';
            if (btn) {
                btn.textContent = 'エリアで探す';
            }
        }
    }

    function generatePrefectureButtons() {
        const container = document.getElementById('prefectureButtonsContainer');
        if (!container) return;

        container.innerHTML = '';

        for (let prefecture in bankLoanState.allBranches) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = prefecture;
            btn.className = 'prefecture-btn';

            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showBranchesForPrefecture(prefecture);
            });

            container.appendChild(btn);
        }
    }

    function showBranchesForPrefecture(prefecture) {
        if (!bankLoanState.allBranches[prefecture]) return;

        const container = document.getElementById('prefectureButtonsContainer');
        if (!container) return;

        container.innerHTML = '';

        const backBtn = document.createElement('button');
        backBtn.type = 'button';
        backBtn.textContent = '← 都道府県一覧に戻る';
        backBtn.className = 'back-btn';
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            generatePrefectureButtons();
        });
        container.appendChild(backBtn);

        const branchButtonsDiv = document.createElement('div');
        branchButtonsDiv.className = 'branch-buttons-div';

        bankLoanState.allBranches[prefecture].forEach(function(branch) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = branch;
            btn.className = 'branch-btn';

            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const branchInput = document.getElementById('branchNameInput');
                if (branchInput) {
                    branchInput.value = branch;
                    branchInput.dispatchEvent(new Event('input'));
                    const areaContainer = document.getElementById('areaSearchContainer');
                    if (areaContainer) {
                        areaContainer.classList.remove('show');
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

    function initializeBranchNameField() {
        console.log('initializeBranchNameField called');
        const branchNameInput = document.getElementById('branchNameInput');
        if (!branchNameInput) {
            console.error('branchNameInput not found');
            return;
        }

        branchNameInput.addEventListener('input', function() {
            const inputValue = this.value.trim();

            updateBranchDataList(inputValue);
            checkBranchNameValidity();

            if (typeof global.saveFormDataToSessionStorage === 'function') {
                global.saveFormDataToSessionStorage();
            }
            if (typeof global.updateRequiredMarks === 'function') {
                global.updateRequiredMarks();
            }
        });

        const searchByAreaBtn = document.getElementById('searchByAreaBtn');
        console.log('searchByAreaBtn:', searchByAreaBtn);

        if (searchByAreaBtn) {
            console.log('Adding click event listener to searchByAreaBtn');
            searchByAreaBtn.addEventListener('click', function(e) {
                console.log('searchByAreaBtn clicked!');
                e.preventDefault();
                toggleAreaSearch();
            });
        } else {
            console.error('searchByAreaBtn not found');
        }
    }

    global.initializeBranchData = initializeBranchData;
    global.updateBranchDataList = updateBranchDataList;
    global.checkBranchNameValidity = checkBranchNameValidity;
    global.toggleAreaSearch = toggleAreaSearch;
    global.generatePrefectureButtons = generatePrefectureButtons;
    global.showBranchesForPrefecture = showBranchesForPrefecture;
    global.initializeBranchNameField = initializeBranchNameField;
})(window);

