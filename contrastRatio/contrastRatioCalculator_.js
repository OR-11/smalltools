// https://qiita.com/Pseudonym/items/93d4e91828512a5ea6e3
/**
 * n, mは正の整数
 */

(function() {
    // 以下C lib
    function modf (f) {
        console.log(f)
        return [Math.floor(f), f - Math.floor(f)];
    }

    // 以下 C 2 JS
    function gcd_inner(m, n) {
        if (n == 0) {
            return m;
        }
        return gcd_inner(n, m % n);
    }

    function gcd(m, n) {
        /*  search a such taht m = a*x and n = a*y          taht → that
        * m = n * q + r = a * x
        * thus  q = a* z and r = a * w            */
        if (m < n) {
            let tmp = n;
            n = m;
            m = tmp;
        }
        return gcd_inner(m, n);
    }

    function frac_reduction(m, n) {
        let g = gcd(m, n);
        m /= g;
        n /= g;
    }

    async function float2frac_algorithm(/**double*/f, ret_n, ret_m) {
        /**double*/let ans = f;
        /**double*/let i = 0;
        let temp = 0;

        /* calculate I0 */
        [temp, i] = modf(f);
        f = 1.0 / temp;
        let I = [0, 0];
        I[0] = i;
        if (ans == i) {
            ret_n = I[0];
            ret_m = 1;
            return;
        }

        /* calculate I1 */
        [temp, i] = modf(f);
        f = 1.0 / temp;
        I[1] = i;

        let n = [I[0], I[0] * I[1] + 1, 0];
        let m = [1, I[1], 0];
        n[2] = n[1];
        m[2] = m[1];

        while (/**!(n[2] / m[2] > ans - 0.1 && n[2] / m[2] < ans + 0.1)*/n[2] / m[2] != ans) {
            console.log(`${ans} : ${n[2]}/${m[2]} = ${n[2] / m[2]}`);
            console.log(n[2] / m[2] < ans + 0.1)
            [temp, i] = modf(f);
            f = 1.0 / temp;
            n[2] = i * n[1] + n[0];
            n[0] = n[1];
            n[1] = n[2];
            m[2] = i * m[1] + m[0];
            m[0] = m[1];
            m[1] = m[2];
            await sleep(0);
        }
        frac_reduction(n[2], m[2]);
        ret_n = n[2];
        ret_m = m[2];
        return [ret_n, ret_m];
    }

    async function main(float) {

        /**double*/let f = float;
        let n = 0;
        let m = 0;

        console.log("algorithm.");
        const result = await float2frac_algorithm(f, n, m);
        console.log(`${f} : ${n}/${m} = ${n/m}`);
        return result;
    }

    // 以下オリジナル
    function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

    function RatioCalcFloat(c1, c2) {
        // https://zenn.dev/yend724/articles/20240202-85u5hfjvgp5irtjd
        // c1, c2それぞれ-sRGB, RGB, Lの順に求めていく
        // c1
        {
            // RGB値の0~1化
            let RGBinDecimal = [parseInt(c1.sRGBstr.substring(0, 2), 16), parseInt(c1.sRGBstr.substring(2, 4), 16), parseInt(c1.sRGBstr.substring(4, 6), 16)]
            c1.RsRGB = RGBinDecimal[0] / 255;
            c1.GsRGB = RGBinDecimal[1] / 255;
            c1.BsRGB = RGBinDecimal[2] / 255;

            // RGB化
            if (c1.RsRGB <= 0.04045) {
                c1.R = c1.RsRGB / 12.92;
            } else {
                c1.R = ((c1.RsRGB + 0.055) / 1.055) ** 2.4;
            }
            if (c1.GsRGB <= 0.04045) {
                c1.G = c1.GsRGB / 12.92;
            } else {
                c1.G = ((c1.GsRGB + 0.055) / 1.055) ** 2.4;
            }
            if (c1.BsRGB <= 0.04045) {
                c1.B = c1.BsRGB / 12.92;
            } else {
                c1.B = ((c1.BsRGB + 0.055) / 1.055) ** 2.4;
            }

            // Lを求める
            c1.L = 0.2126 * c1.R + 0.7152 * c1.G + 0.0722 * c1.B
        }

        // c2
        {
            // RGB値の0~1化
            let RGBinDecimal = [parseInt(c2.sRGBstr.substring(0, 1), 16), parseInt(c2.sRGBstr.substring(2, 3), 16), parseInt(c2.sRGBstr.substring(4, 5), 16)]
            c2.RsRGB = RGBinDecimal[0] / 255;
            c2.GsRGB = RGBinDecimal[1] / 255;
            c2.BsRGB = RGBinDecimal[2] / 255;

            // RGB化
            if (c2.RsRGB <= 0.04045) {
                c2.R = c2.RsRGB / 12.92;
            } else {
                c2.R = ((c2.RsRGB + 0.055) / 1.055) ** 2.4;
            }
            if (c2.GsRGB <= 0.04045) {
                c2.G = c2.GsRGB / 12.92;
            } else {
                c2.G = ((c2.GsRGB + 0.055) / 1.055) ** 2.4;
            }
            if (c2.BsRGB <= 0.04045) {
                c2.B = c2.BsRGB / 12.92;
            } else {
                c2.B = ((c2.BsRGB + 0.055) / 1.055) ** 2.4;
            }

            // Lを求める
            c2.L = 0.2126 * c2.R + 0.7152 * c2.G + 0.0722 * c2.B
        }

        // 比を計算
        return (c1.L >= c2.L ? (c1.L + 0.05) / (c2.L + 0.05) : (c2.L + 0.05) / (c1.L + 0.05));
    }

    async function RatioCalc(c1, c2) {
        const color1 = {
            sRGBstr : c1.replaceAll('#',''),
            L : 0.0,
            RsRGB : 0.0,
            GsRGB : 0.0,
            BsRGB : 0.0,
            R : 0.0,
            G : 0.0,
            B : 0.0,
        }
        const color2 = {
            sRGBstr : c2.replaceAll('#',''),
            L : 0.0,
            RsRGB : 0.0,
            GsRGB : 0.0,
            BsRGB : 0.0,
            R : 0.0,
            G : 0.0,
            B : 0.0,
        }

        let contrastRatioFloat = RatioCalcFloat(color1, color2);
        console.log(color1);
        return main(contrastRatioFloat);
    }
    window.contrastRatio = window.contrastRatio|| {};
    window.contrastRatio.RatioCalc = RatioCalc;
})();
