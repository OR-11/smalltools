window.addEventListener("load", () => {
    const unicodeInput = document.getElementById("unicodeInput");
    const result = document.getElementById("result");

    unicodeInput.addEventListener('input', inputChange);
    result.addEventListener('input', reverse);
});

function inputChange(event){
    const unicodeInput = document.getElementById("unicodeInput");
    const input = unicodeInput.value;
    if (true) {
        var str = "";
        const result = document.getElementById("result");
        for (let i = 1; i < input.split('\\u').length; i++) {
            str += String.fromCharCode(parseInt(input.split('\\u')[i], 16));
        }
        result.value = str;
    }
}

function reverse(event) {
    const result = document.getElementById("result");
    const input = result.value;
    if (true) {
        var str = "";
        const unicodeInput = document.getElementById("unicodeInput");
        for (let i = 0; i < input.length; i++) {
            str += `\\u${input.codePointAt(i).toString(16)}`
        }
        unicodeInput.value = str;
    }
}
