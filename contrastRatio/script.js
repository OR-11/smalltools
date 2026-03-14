window.addEventListener("load", () => {
    const colorInput1 = document.getElementById("inputColor1");
    const colorInput2 = document.getElementById("inputColor2");

    colorInput1.addEventListener('input', inputChange);
    colorInput2.addEventListener('input', inputChange);
});

function inputChange(event){
    const colorInput1 = document.getElementById("inputColor1");
    const color1 = document.getElementById("color1");
    
    const colorInput2 = document.getElementById("inputColor2");
    const color2 = document.getElementById("color2");

    if (new RegExp("(([A-F]|[a-f])|[0-9]){6}").test(colorInput1.value.replaceAll('#', '')) && new RegExp("(([A-F]|[a-f])|[0-9]){6}").test(colorInput2.value.replaceAll('#', ''))) {
        const resultRatioValue = document.getElementById("value");
        resultRatioValue.innerText = "Calculating..."
        color1.style.backgroundColor = "#" + colorInput1.value.replaceAll('#', '');
        color2.style.backgroundColor = "#" + colorInput2.value.replaceAll('#', '');
        window.contrastRatio.RatioCalc(colorInput1.value, colorInput2.value).then(Ratioresult => {
            resultRatioValue.innerText = `${Ratioresult[0]} : ${Ratioresult[1]}`;
        });
    }
}
