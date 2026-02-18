document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById("btn-submit");
    const robotOverlay = document.getElementById("robot-overlay");
    const robotCheck = document.getElementById("not-robot");
    const nextStepButton = document.getElementById("btn-next-step");
    const stepCheckbox = document.getElementById("step-checkbox");
    const stepImages = document.getElementById("step-images");
    const imageGrid = document.getElementById("image-grid");
    const authTitle = document.getElementById("auth-title");

    let selectedPanels = [];
    const correctPanels = [1, 2, 5, 8]; // 正解

    function setupImageGrid() {
        imageGrid.innerHTML = "";
        selectedPanels = []; // リセット
        for (let i = 1; i <= 9; i++) {
            const div = document.createElement("div");
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.background = `url('/images/ninsyou(${i}).jpg')`;
            div.style.backgroundSize = "cover"; // 画像を枠に合わせる
            div.style.backgroundPosition = "center"; // 中央に寄せる
            div.style.border = "3px solid transparent";
            div.style.cursor = "pointer";
            div.onclick = () => {
                if (selectedPanels.includes(i)) {
                    selectedPanels = selectedPanels.filter(p => p !== i);
                    div.style.border = "3px solid transparent";
                } else {
                    selectedPanels.push(i);
                    div.style.border = "3px solid #007bff";
                }
            };
            imageGrid.appendChild(div);
        }
    }

    // ① 最初の申し込みボタン
    if (submitButton) {
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            submitButton.style.display = "none";
            robotOverlay.style.display = "flex";
        });
    }

    // ② 認証ボタン
    if (nextStepButton) {
        nextStepButton.addEventListener('click', () => {
            // ステップ1: ロボットチェック中
            if (stepImages.style.display === "none") {
                if (!robotCheck.checked) {
                    alert("チェックを入れてください。");
                    return;
                }
                // 画像認証へ切り替え
                stepCheckbox.style.display = "none";
                stepImages.style.display = "block";
                authTitle.innerText = "画像を選択してください";
                setupImageGrid();
            }
            // ステップ2: 画像認証中
            else {
                const isCorrect = selectedPanels.length === correctPanels.length &&
                                  selectedPanels.every(v => correctPanels.includes(v));

                if (!isCorrect) {
                    alert("認証に失敗しました。最初からやり直してください。");
                    location.reload();
                    return;
                }

                // ここを突破したらOTPへ
                const otp = prompt("【最終認証】4桁の数字を入力してください。");
                if (otp === "1234") {
                    if (confirm("全ての認証に成功しました。申し込みますか？")) {
                        const form = document.querySelector('form');
                        HTMLFormElement.prototype.submit.call(form);
                    }
                } else {
                    alert("パスワードが違います。");
                    location.reload();
                }
            }
        });
    }
});

