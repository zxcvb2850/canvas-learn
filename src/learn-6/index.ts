/**
 * from zhihu
 * url https://www.zhihu.com/question/30262900
 * */

{
    const canvas: HTMLCanvasElement = document.querySelector("#canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx:CanvasRenderingContext2D = canvas.getContext("2d");

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const pixelData = imageData.data;

    for (let i = 0; i < canvas.height; i++) {
        for (let j = 0; j < canvas.width; j++) {
            const p = i * canvas.width + j;
            pixelData[p * 4] = Math.pow(Math.cos(Math.atan2(j - 400, i - 400) / 2), 2) * 255;
            pixelData[p * 4 + 1] = Math.pow(Math.cos(Math.atan2(j - 400, i - 400) / 2 - 2 * Math.acos(-1) / 3), 2) * 255;
            pixelData[p * 4 + 2] = Math.pow(Math.cos(Math.atan2(j - 400, i - 400) / 2 + 2 * Math.acos(-1) / 3), 2) * 255;
            pixelData[p * 4 + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}
