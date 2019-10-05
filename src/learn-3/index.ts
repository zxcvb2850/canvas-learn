import digit from "./digit";

{

    interface Balls {
        x: number
        y: number
        vx: number
        vy: number
        g: number
        color: string
    }
    // 全局变量
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight - 4;
    let CANVAS_WIDTH = WIDTH;
    let CANVAS_HEIGHT = HEIGHT;
    let RADIUS = Math.round(WIDTH * 4 / 5 / 108) - 1;
    let MARGIN_LEFT = Math.round(WIDTH / 10);
    let MARGIN_TOP = Math.round(HEIGHT / 5);
    const balls: Balls[] = [];
    let curDate:Date;
    // 由于 ts 的原因，不能在块级作用域中使用函数，则使用函数声明的方式
    /**
     * 小于十位数的补零
     * 将数字转为字符串
     * */
    const zoom = (num: number): number => {
        // return num < 10 ? `0${num}` : `${num}`;
        return num;
    };
    const getDate = ():Date => {
        return new Date();
    };
    // 返回随机数
    const random = (num: number): number => Math.floor(Math.random() * num);
    // 添加小球
    const addBalls = (x: number, y: number, number: number):void => {
        const cols = digit[number].length;
        for (let i = 0; i < cols; i++) {
            const rows = digit[number][i].length;
            for (let j = 0; j < rows; j++) {
                const row = digit[number][i][j];
                if (row) {
                    balls.push({
                        x: x + (RADIUS + 1) * 2 * j + (RADIUS + 1),
                        y: y + (RADIUS + 1) * 2 * i + (RADIUS + 1),
                        vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                        vy: Math.ceil(random(5)) - 15,
                        g: 1.2 + Math.random(),
                        color: `rgb(${random(255)}, ${random(255)}, ${random(255)})`,
                    })
                }
            }
        }
    };
    // 更新小球
    const updateBalls = ():void => {
        // console.log(balls);
        const len = balls.length;
        for (let i = 0; i < len; i++) {
            const ball = balls[i];
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vy += ball.g;

            if (ball.y >= CANVAS_HEIGHT - RADIUS) {
                ball.y = CANVAS_HEIGHT -RADIUS;
                ball.vy = -ball.vy * 0.75
            }
        }

        // @ts-ignore
        balls = balls.filter((ball) => ball.x +RADIUS > 0 && ball.x - RADIUS < CANVAS_WIDTH);
    };

    const render = (ctx: CanvasRenderingContext2D):void => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const hour = zoom(curDate.getHours());
        const minute = zoom(curDate.getMinutes());
        const second = zoom(curDate.getSeconds());

        renderDigit(MARGIN_LEFT, MARGIN_TOP, Math.floor((hour / 10)), ctx);
        renderDigit(MARGIN_LEFT + 14 * (RADIUS + 1), MARGIN_TOP, Math.floor((hour % 10)), ctx);
        renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, ctx);
        renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, Math.floor((minute / 10)), ctx);
        renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, Math.floor((minute % 10)), ctx);
        renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, ctx);
        renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, Math.floor((second / 10)), ctx);
        renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, Math.floor((second % 10)), ctx);

        const len = balls.length;
        for (let i = 0; i < len; i++) {
            const ball = balls[i];
            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, RADIUS, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    };
    const update = (): void => {
        const nextDate = getDate();
        const nextHour = nextDate.getHours();
        const nextMinute = nextDate.getMinutes();
        const nextSecond = nextDate.getSeconds();

        const curHour = curDate.getHours();
        const curMinute = curDate.getMinutes();
        const curSecond = curDate.getSeconds();

        if (nextSecond !== curSecond) {
            // 时
            if (Math.floor(nextHour / 10) !== Math.floor(curHour / 10)) {
                addBalls(MARGIN_LEFT, MARGIN_TOP, Math.floor((nextHour / 10)));
                addBalls(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10);
            }
            if ((nextHour % 10) !== (curHour % 10)) {
                addBalls(MARGIN_LEFT + 14 * (RADIUS + 1), MARGIN_TOP, nextHour % 10);
                addBalls(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10);
            }
            // 分
            if (Math.floor(nextMinute / 10) !== Math.floor(curMinute / 10)) {
                addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, Math.floor((nextMinute / 10)));
                addBalls(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10);
            }
            if ((nextMinute % 10) !== (curMinute % 10)) {
                addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, nextMinute % 10);
                addBalls(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10);
            }
            // 秒
            if (Math.floor(nextSecond / 78) !== Math.floor(curSecond / 10)) {
                addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, Math.floor((nextSecond / 10)));
            }
            if ((nextSecond % 10) !== (curSecond % 10)) {
                addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, nextSecond % 10);
            }
            curDate = nextDate;
        }

        updateBalls();
    };
    const renderDigit = (x: number, y: number, number: number, ctx: CanvasRenderingContext2D):void => {
        ctx.fillStyle = "#3d42ef";
        const cols = digit[number].length;
        for (let i = 0; i < cols; i++) {
            const rows = digit[number][i].length;
            for (let j = 0; j < rows; j++) {
                const row = digit[number][i][j];
                if (row) {
                    const pointX = x + (RADIUS + 1) * 2 * j + (RADIUS + 1);
                    const ponitY = y + (RADIUS + 1) * 2 * i + (RADIUS + 1);
                    ctx.beginPath();
                    ctx.arc(pointX, ponitY, (RADIUS), 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    const canvas:HTMLCanvasElement = document.querySelector("#canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    curDate = getDate();
    const draw = () => {
        render(ctx);
        update();
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);

    window.addEventListener("resize", () => {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight - 4;
        CANVAS_WIDTH = WIDTH;
        CANVAS_HEIGHT = HEIGHT;
        RADIUS = Math.round(WIDTH * 4 / 5 / 108) - 1;
        MARGIN_LEFT = Math.round(WIDTH / 10);
        MARGIN_TOP = Math.round(HEIGHT / 5);
        console.log(WIDTH, HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
    });
}
