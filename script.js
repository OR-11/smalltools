window.addEventListener("load", () => {
    var IsRootPage;
    const header = document.getElementById("header");

    // ホームへ戻るボタンを追加
    if (document.getElementById("root") != null) {
        // root
        IsRootPage = true;
    }
    else {
        // 下位ページ
        IsRootPage = false
        const BackButton = document.createElement("a");
        BackButton.setAttribute("href", "https://or-11.github.io/smalltools/");
        BackButton.setAttribute("target", "_self");
        BackButton.setAttribute("rel", "noopener noreferrer");
        BackButton.setAttribute("class", "backToHome");
        
        BackButton.innerText = "< ホームへ戻る";

        header.prepend(BackButton);
    }
});

function getCurrentURL() {
    return window.location.href;
}
