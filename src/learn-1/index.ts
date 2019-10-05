{
    const canvas: HTMLCanvasElement = document.querySelector("#canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    ctx.translate(200, 200);

    const width = 150;

    function blockBg(): void {
        // 表盘
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.arc(100, 100, width, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();

        // 刻度
        ctx.beginPath();
        for (let i = 0; i < 60; i++) {
            ctx.moveTo(100, 100);
            ctx.arc(100, 100, width, 6 * i * Math.PI / 180, 6 * (i + 1) * Math.PI / 180, false);
        }
        ctx.stroke();
        ctx.closePath();

        // 遮住刻度
        ctx.beginPath();
        ctx.arc(100, 100, width * 19 / 20, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#FFF";
        ctx.fill();
        ctx.closePath();

        // 准点刻度
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
            ctx.moveTo(100, 100);
            ctx.arc(100, 100, width, 30 * i * Math.PI / 180, 30 * (i + 1) * Math.PI / 180, false);
        }
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();

        // 准点遮罩
        ctx.beginPath();
        ctx.arc(100, 100, width * 18 / 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // 圆心点
        ctx.beginPath();
        ctx.arc(100, 100, 6, 0, Math.PI * 2, false);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.closePath();
    }

    function animatePointer(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 表盘
        blockBg();
        /// 指针
        // 时针
        const date = new Date();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        // 绘制文字
        ctx.beginPath();
        ctx.font = "30px Arial";
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        ctx.fillText(`${hour}:${minute}:${second}`, 100, 120);
        ctx.closePath();

        const hourAngle = Math.PI / 180 * (hour * 30 - 90 + (minute / 2));
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.arc(100, 100, width / 2, hourAngle, hourAngle);
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.closePath();
        // 分针
        const minuteAngle = Math.PI / 180 * (minute * 6 - 90 + (second / 10));
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.arc(100, 100, width / 1.5, minuteAngle, minuteAngle, false);
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();
        // 秒针
        const secondAngle = Math.PI / 180 * (second * 6 - 90);
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.arc(100, 100, width / 1.1, secondAngle, secondAngle, false);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    animatePointer();
    setInterval(animatePointer, 1000);
}
