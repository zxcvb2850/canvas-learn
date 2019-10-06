interface Point {
    x: number
    y: number
}

{
    const canvas: HTMLCanvasElement = document.querySelector("#canvas");
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    const range: HTMLInputElement = document.querySelector("#range");

    const offCanvas: HTMLCanvasElement = document.createElement("canvas");
    const offContext: CanvasRenderingContext2D = offCanvas.getContext("2d");

    let scale: number = 1;

    const image:HTMLImageElement = new Image();
    image.src = "./learn-4/bg.jpg";

    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        offCanvas.width = image.width;
        offCanvas.height = image.height;

        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        offContext.drawImage(image, 0, 0);
    };

    let isDown: boolean = false;
    range.onmousedown = function () {
        isDown = true;
    };
    range.onmousemove = function () {
        if (isDown) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            scale = Number(range.value);
            const dx: number = (canvas.width - canvas.width * scale) / 2;
            const dy: number = (canvas.height - canvas.height * scale) / 2;

            ctx.drawImage(image, dx, dy, canvas.width * scale, canvas.height * scale);
        }
    };
    range.onmouseup = function () {
        isDown = false;
    };

    let isMoverCanvas: boolean = false;
    canvas.onmousedown = function (e: MouseEvent) {
        isMoverCanvas = true;
        const pointer = getPointer(e);
        drawCanvasWithMagnifier(true, pointer);
    };
    canvas.onmousemove = function (e: MouseEvent) {
        if (isMoverCanvas) {
            const pointer = getPointer(e);
            drawCanvasWithMagnifier(true, pointer);
        }
    };
    canvas.onmouseup = function () {
        isMoverCanvas = false;
        drawCanvasWithMagnifier(false);
    };
    canvas.onmouseout = function () {
        isMoverCanvas = false;
        drawCanvasWithMagnifier(false);
    };

    function getPointer(event: MouseEvent): Point{
        const x = event.clientX - canvas.offsetLeft;
        const y = event.clientY - canvas.offsetTop;
        return {x, y}
    }

    function drawCanvasWithMagnifier(isShow: boolean, point?: Point): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dx: number = (canvas.width - canvas.width * scale) / 2;
        const dy: number = (canvas.height - canvas.height * scale) / 2;

        ctx.drawImage(image, dx, dy, canvas.width * scale, canvas.height * scale);
        if (isShow) {
            drawMagnifier(point);
        }
    }

    function drawMagnifier(point: Point): void {
        const pointLG = toOffCanvasPointChange(point);
        const mr = 200;
        const sx = pointLG.x - mr;
        const sy = pointLG.y - mr;
        const dx = point.x - mr;
        const dy = point.y - mr;
        ctx.save();
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#6756ff";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 100, 0 , Math.PI * 2);
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(offCanvas, sx, sy,2*mr,2*mr, dx, dy,2*mr,2*mr);
        ctx.restore();
    }

    function toOffCanvasPointChange(point: Point): Point {
        const scaleX = offCanvas.width / (canvas.width * scale);
        const scaleY = offCanvas.height / (canvas.height * scale);
        return {x: ( point.x+(scale-1)*canvas.width/2 ) * scaleX, y: (point.y+ (scale-1) * canvas.height/2) * scaleY}
    }
}
