// 修正版（主要部分だけ）
(function() {
    // modf を C と同じ仕様にする: 戻り値 = 小数部, 整数部は 2 番目で返す（配列）
    function modf(f) {
        const intpart = Math.trunc(f); // 正の数前提なら Math.floor でも OK
        const frac = f - intpart;
        return [frac, intpart];
    }

    function gcd_inner(m, n) {
        m = Math.abs(Math.trunc(m));
        n = Math.abs(Math.trunc(n));
        if (n === 0) return m;
        while (n !== 0) {
            const r = m % n;
            m = n;
            n = r;
        }
        return m;
    }

    function frac_reduction(m, n) {
        const g = gcd_inner(m, n);
        return [m / g, n / g];
    }

    // 続分（単純版）で近似する関数
    function float2frac_algorithm(f, maxIter = 100, tol = 1e-12) {
        const ans = f;
        // I0
        let [frac, I0] = modf(f);
        if (Math.abs(frac) < Number.EPSILON) {
            return [I0, 1]; // 整数
        }
        // 逆数を取る
        f = 1.0 / frac;

        // I1
        [frac, varI] = modf(f);
        const I1 = varI;
        f = 1.0 / frac;

        // 初期収束候補
        let n0 = I0, n1 = I0 * I1 + 1;
        let m0 = 1,  m1 = I1;
        let n2 = n1, m2 = m1;

        for (let iter = 0; iter < maxIter; iter++) {
            const approx = n2 / m2;
            if (Math.abs(approx - ans) <= tol) {
                const [rn, rm] = frac_reduction(n2, m2);
                return [rn, rm];
            }
            // 次の continued fraction の係数を取得
            const res = modf(f);
            const nextI = res[1];
            const nextFrac = res[0];
            if (Math.abs(nextFrac) < Number.EPSILON) {
                // 正確な整数になった
                n2 = nextI * n1 + n0;
                m2 = nextI * m1 + m0;
                const [rn, rm] = frac_reduction(n2, m2);
                return [rn, rm];
            }
            // 更新
            const newn = nextI * n1 + n0;
            const newm = nextI * m1 + m0;
            n0 = n1; n1 = newn;
            m0 = m1; m1 = newm;
            n2 = newn; m2 = newm;

            // 反転
            f = 1.0 / nextFrac;
        }
        // 上限に達したら現在の近似を返す
        const [rn, rm] = frac_reduction(n2, m2);
        return [rn, rm];
    }

    // main: 呼び出し側で戻り値を受け取って使う
    async function main(floatValue) {
        const result = float2frac_algorithm(floatValue);
        console.log(`${floatValue} ≒ ${result[0]}/${result[1]} = ${result[0] / result[1]}`);
        return result;
    }

    // 色解析部分の小さな修正 (c2 の substring の範囲ミス修正)
    function RatioCalcFloat(c1, c2) {
        function parseColor(s) {
            const str = s.replace('#','');
            const r = parseInt(str.substring(0,2), 16);
            const g = parseInt(str.substring(2,4), 16);
            const b = parseInt(str.substring(4,6), 16);
            const RsRGB = r / 255;
            const GsRGB = g / 255;
            const BsRGB = b / 255;
            const conv = x => x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
            const R = conv(RsRGB), G = conv(GsRGB), B = conv(BsRGB);
            const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
            return { L };
        }
        const col1 = parseColor(c1);
        const col2 = parseColor(c2);
        return (col1.L + 0.05) / (col2.L + 0.05);
    }

    async function RatioCalc(hex1, hex2) {
        const cr = RatioCalcFloat(hex1, hex2);
        return main(cr);
    }

    window.contrastRatio = window.contrastRatio || {};
    window.contrastRatio.RatioCalc = RatioCalc;
})();
