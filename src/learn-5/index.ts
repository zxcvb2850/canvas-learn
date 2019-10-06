{
    const canvas: HTMLCanvasElement = document.querySelector("#canvas");
    const offCanvas: HTMLCanvasElement = document.querySelector("#off-canvas");

    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    const offCtx: CanvasRenderingContext2D = offCanvas.getContext("2d");

    const image: HTMLImageElement = new Image();
    image.src = "./learn-5/bg.jpg";

    image.onload = function () {
        const width = image.width;
        const height = image.height;
        canvas.width = width;
        canvas.height = height;

        offCanvas.width = width;
        offCanvas.height = height;

        ctx.drawImage(image, 0,0, width, height);
    };

    function render(fn: Function) {
        offCtx.clearRect(0,0, offCanvas.width, offCanvas.height);
        const imageData: any = ctx.getImageData(0,0, canvas.width, canvas.height);
        const pixelData: Uint8ClampedArray = imageData.data;

        // @ts-ignore
        fn(imageData, pixelData);
    }

    // 去除红色
    function redEffect(imageData:any, pixelData: Uint8ClampedArray) {
        const len = pixelData.length;
        for (let i = 0 ; i < len; i++) {
            pixelData[i * 4 + 1] = 0;
        }
        offCtx.putImageData(imageData, 0, 0);
    }

    // 灰度
    function greyEffect(imageData:any, pixelData: Uint8ClampedArray) {
        const len = pixelData.length;
        for (let i = 0 ; i < len; i++) {
            const r = pixelData[i * 4];
            const g = pixelData[i * 4 + 1];
            const b = pixelData[i * 4 + 2];

            let grey = r * 0.3 + g * 0.59 + b * 0.11;

            pixelData[i * 4] = grey;
            pixelData[i * 4 + 1] = grey;
            pixelData[i * 4 + 2] = grey;
        }
        offCtx.putImageData(imageData, 0, 0);
    }

    // 反色
    function reverseEffect(imageData:any, pixelData: Uint8ClampedArray) {
        const len = pixelData.length;
        for (let i = 0 ; i < len; i++) {
            pixelData[i * 4] = 255- pixelData[i * 4];
            pixelData[i * 4 + 1] = 255- pixelData[i * 4 + 1];
            pixelData[i * 4 + 2] = 255- pixelData[i * 4 + 2];
        }
        offCtx.putImageData(imageData, 0, 0);
    }

    // 黑白
    function blackEffect(imageData:any, pixelData: Uint8ClampedArray) {
        const len = pixelData.length;
        for (let i = 0 ; i < len; i++) {
            const r = pixelData[i * 4];
            const g = pixelData[i * 4 + 1];
            const b = pixelData[i * 4 + 2];

            let grey = r * 0.3 + g * 0.59 + b * 0.11;

            let v:number;
            if (grey < 255 / 2) {
                v = 0;
            } else {
                v = 255;
            }
            pixelData[i * 4] = v;
            pixelData[i * 4 + 1] = v;
            pixelData[i * 4 + 2] = v;
        }
        offCtx.putImageData(imageData, 0, 0);
    }

    // 模糊
    function blurEffect(imageData: any, pixelData: Uint8ClampedArray) {
        const tmpImageData: any = ctx.getImageData(0,0, canvas.width, canvas.height);
        const tmpPixelData: Uint8ClampedArray = tmpImageData.data;

        const blur = 5;
        const totalNum = (2*blur-1)*(2*blur-1);
        for (let i = blur; i < canvas.height - blur; i++) {
            for (let j = blur; j < canvas.width - blur; j++) {
                let totalR: number = 0, totalG: number = 0, totalB: number = 0;

                // 这两层循环是循环 i,j 周围的点
                for (let dx = -blur; dx <= blur; dx++) {
                    for (let dy = -blur; dy <= blur; dy++) {
                        const x = i + dx;
                        const y = j + dy;

                        const p = x * canvas.width + y;
                        totalR += tmpPixelData[p * 4];
                        totalG += tmpPixelData[p * 4 + 1];
                        totalB += tmpPixelData[p * 4 + 2];
                    }
                }
                const p = i * canvas.width + j;
                pixelData[p * 4] = totalR / totalNum;
                pixelData[p * 4 + 1] = totalG / totalNum;
                pixelData[p * 4 + 2] = totalB / totalNum;
            }
        }

        offCtx.putImageData(imageData, 0, 0);
    }

    // 马赛克
    function mosaicEffect(imageData: any, pixelData: Uint8ClampedArray) {
        const tmpImageData: any = ctx.getImageData(0,0, canvas.width, canvas.height);
        const tmpPixelData: Uint8ClampedArray = tmpImageData.data;

        const size = 4;
        const totalNum = size * size;
        for (let i = 0; i < canvas.height; i += size) {
            for (let j = 0; j < canvas.width; j += size) {
                let totalR: number = 0, totalG: number = 0, totalB: number = 0;

                // 这两层循环是循环 i,j 周围的点
                for (let dx = 0; dx <= size; dx++) {
                    for (let dy = 0; dy <= size; dy++) {
                        const x = i + dx;
                        const y = j + dy;

                        const p = x * canvas.width + y;
                        totalR += tmpPixelData[p * 4];
                        totalG += tmpPixelData[p * 4 + 1];
                        totalB += tmpPixelData[p * 4 + 2];
                    }
                }
                const p = i * canvas.width + j;
                const resR = totalR / totalNum;
                const resG = totalG / totalNum;
                const resB = totalB / totalNum;
                // 周围的所有点颜色取值为平均值
                for (let dx = 0; dx <= size; dx++) {
                    for (let dy = 0; dy <= size; dy++) {
                        const x = i + dx;
                        const y = j + dy;

                        const p = x * canvas.width + y;
                        pixelData[p * 4] = resR;
                        pixelData[p * 4 + 1] = resG;
                        pixelData[p * 4 + 2] = resB;
                    }
                }
            }
        }

        offCtx.putImageData(imageData, 0, 0);
    }

    // a 点击事件
    const btns = document.querySelectorAll("#deal a");
    btns.forEach(item => {
        item.addEventListener("click", () => {
            const type = item.getAttribute("data-type");
            switch (type) {
                case "red":
                    render(redEffect);
                    break;
                case "grey":
                    render(greyEffect);
                    break;
                case "reverse":
                    render(reverseEffect);
                    break;
                case "black":
                    render(blackEffect);
                    break;
                case "blur":
                    render(blurEffect);
                    break;
                case "mosaic":
                    render(mosaicEffect);
                    break;
            }
        })
    });
}
