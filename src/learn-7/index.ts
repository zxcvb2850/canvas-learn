{
    interface Dots {
        cap: number
    }

    const lineSize = 256;

    const audio: HTMLAudioElement = document.querySelector("#audio");
    audio.volume = 0.05;

    const audioCtx: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext);
    // 创建节点
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    // 连接
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    const len = analyser.frequencyBinCount;
    // 获取音频数据
    const output: Uint8Array = new Uint8Array(lineSize);

    const canvas: HTMLCanvasElement = document.querySelector("#canvas");
    canvas.width = 1024;
    canvas.height = 768;

    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    let dots: Dots[] = [];
    function drawSpectrum(): void {
        analyser.getByteFrequencyData(output);

        drawLine(output);

        requestAnimationFrame(drawSpectrum);
    }
    requestAnimationFrame(drawSpectrum);
    getDots(output);

    function getDots(output: Uint8Array) {
        dots = [];
        for (let i = 0; i < output.length; i++) {
            dots.push({
                cap: 0,
            })
        }
    }

    function drawLine(output: Uint8Array) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const linear = ctx.createLinearGradient( 0, 600, 0, 500);
        linear.addColorStop( 0, '#cc0000' );
        linear.addColorStop( 0.5, '#b9b906' );
        linear.addColorStop( 1, '#009600' );

        const size: number = output.length;
        const w = canvas.width / size;
        const cw = w * 0.6;
        const capH = cw;

        for (let i = 0; i < size; i++) {
            const h = output[i] / 256 * canvas.height;
            const o = dots[i];

            ctx.save();
            ctx.fillStyle = linear;
            ctx.fillRect(w * i, canvas.height - h, cw, h);
            ctx.fill();
            ctx.restore();

            ctx.fillStyle = "#000";
            ctx.fillRect(w * i, canvas.height - (o.cap + capH), cw, capH);
            ctx.fill();

            o.cap--;
            if (o.cap < 0) {
                o.cap = 0;
            }
            if (h > 0 && o.cap < h + 40) {
                o.cap = h + 40;
            }
        }
    }

    /*const arr = [];
    for (let i = 0; i < 361; i++) {
        arr.push(Math.floor(Math.random() * 300));
    }
    for (let i = 0; i< arr.length; i++) {
        const linear = ctx.createLinearGradient( 0, 600, 0, 200);
        linear.addColorStop( 0, 'red' );
        linear.addColorStop( 1, '#09f' );
        ctx.beginPath();
        ctx.moveTo(i * 10 + 10, 600);
        ctx.lineTo(i * 10 + 10, 600 - arr[i]);
        ctx.lineWidth = 6;
        ctx.strokeStyle = linear;
        ctx.stroke();
        ctx.closePath();
    }*/
}
