{
    const random = (): number => Math.floor(Math.random() * 255);

    const canvas: HTMLCanvasElement = document.querySelector("#canvas");
    canvas.width = 900;
    canvas.height = 800;

    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    const x = 200;
    const y = 200;
    const r = 200;
    const PI = Math.PI;


    function drawBackground() {
        ctx.save();

        ctx.translate(r + 100, r + 100);
        ctx.beginPath();
        // 画表盘
        ctx.lineWidth = 6;
        ctx.arc(0, 0, r, 0, PI * 2, false);
        ctx.stroke();

        // 画指数
        const numbers:number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
        numbers.forEach((number, i) => {
            const rad = 2 * PI / 12 * i;
            const x = Math.cos(rad) * (r - 40);
            const y = Math.sin(rad) * (r - 40);
            ctx.font = "20px 微软雅黑";
            ctx.fillStyle = `rgb(${random()}, ${random()}, ${random()})`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${number}`, x, y);
        });

        pointer();

        function pointer() {
            for (let i = 0; i < 60; i++) {
                const rad = 2 * PI / 60 * i;
                const x = Math.cos(rad) * (r - 18);
                const y = Math.sin(rad) * (r - 18);
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, PI * 2, false);
                if (i % 5 === 0) {
                    ctx.fillStyle = "#000";
                } else {
                    ctx.fillStyle = "#ccc";
                }
                ctx.fill();
            }
        }
    }

    function centerPointer() {
        // 中间圆点
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, PI * 2, false);
        ctx.fillStyle = "#FFF";
        ctx.fill();
        ctx.closePath();
    }

    /// 指针
    // 时针
    function hour(hour:number, minute: number): void {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 8;
        const angle = 2 * PI / 12 * hour;
        const minuteAngle = 2 * PI / 12 / 60 * minute;
        ctx.rotate(angle + minuteAngle);
        ctx.moveTo(0, 20);
        ctx.lineTo(0, -(r / 2));
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
    }
    // 分针
    function minute(minute: number, second: number): void {
        ctx.save();
        ctx.beginPath();
        const angle = 2 * PI / 60 * minute;
        const secondAngle = 2 * PI / 60 / 60 * second;
        ctx.rotate(angle + secondAngle);
        ctx.moveTo(0, 20);
        ctx.lineTo(0, -(r / 1.5));
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
    }
    // 秒针
    function second(second: number): void {
        ctx.save();
        ctx.beginPath();
        const angle = 2 * PI / 60 * second;
        ctx.rotate(angle);
        ctx.moveTo(-3, 30);
        ctx.lineTo(3, 30);
        ctx.lineTo(1, 20 - r );
        ctx.lineTo(-1, 20 - r );
        ctx.fillStyle = "#F00";
        ctx.fill();
        ctx.restore();
    }

    function drawTextTime(hour:number, minute:number, second:number): void {
        ctx.beginPath();
        const time = `${hour}:${minute}:${second}`;
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        ctx.font = "30px 微软雅黑";
        ctx.fillStyle = "#000";
        ctx.fillStyle = "#000";
        ctx.fillText(time, 0, r / 2.5);
        ctx.closePath();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const date = new Date();
        const hourTime = date.getHours();
        const minuteTime = date.getMinutes();
        const secondTime = date.getSeconds();

        drawBackground();
        drawTextTime(hourTime, minuteTime, secondTime);

        hour(hourTime, minuteTime);
        minute(minuteTime, secondTime);
        second(secondTime);

        centerPointer();
        ctx.restore();
    }

    draw();
    setInterval(draw, 1000);
}
