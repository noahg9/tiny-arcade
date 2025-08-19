export function startPong(container: HTMLElement) {
    container.innerHTML = `
        <h2>Pong</h2>
        <canvas id="pongCanvas" width="400" height="400" style="border:1px solid black;"></canvas>
        <p>Score: <span id="score">0</span></p>
    `;

    const canvas = container.querySelector('#pongCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const paddleWidth = 80, paddleHeight = 10;
    const ballSize = 10;
    let paddleX = canvas.width / 2 - paddleWidth / 2;
    let ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 3, vy: 3 };
    let score = 0;

    document.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        paddleX = e.clientX - rect.left - paddleWidth / 2;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Paddle
        ctx.fillStyle = 'blue';
        ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);

        // Ball
        ctx.fillStyle = 'red';
        ctx.fillRect(ball.x, ball.y, ballSize, ballSize);

        ball.x += ball.vx;
        ball.y += ball.vy;

        // Bounce off walls
        if (ball.x <= 0 || ball.x + ballSize >= canvas.width) ball.vx *= -1;
        if (ball.y <= 0) ball.vy *= -1;

        // Bounce off paddle
        if (ball.y + ballSize >= canvas.height - paddleHeight - 10 &&
            ball.x + ballSize >= paddleX && ball.x <= paddleX + paddleWidth) {
            ball.vy *= -1;
            score++;
        }

        // Missed paddle
        if (ball.y + ballSize > canvas.height) {
            alert(`Game Over! Score: ${score}`);
            ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 3, vy: 3 };
            score = 0;
        }

        (container.querySelector('#score') as HTMLElement).textContent = score.toString();
        requestAnimationFrame(draw);
    }

    draw();
}
