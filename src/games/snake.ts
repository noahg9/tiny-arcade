export function startSnakeGame(container: HTMLElement) {
    container.innerHTML = `
        <h2>Snake Game</h2>
        <canvas id="snakeCanvas" width="400" height="400" style="border:1px solid black;"></canvas>
        <p>Score: <span id="score">0</span></p>
        <button id="restartBtn">Restart Game</button>
        <p id="gameMessage" style="color:red;"></p>
    `;

    const canvas = container.querySelector('#snakeCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const box = 20;
    let snake: { x: number, y: number }[] = [{ x: 10 * box, y: 10 * box }];
    let direction: string = 'RIGHT';
    let nextDirection: string = 'RIGHT';
    let food = randomFood();
    let score = 0;
    let gameOver = false;

    const scoreEl = container.querySelector('#score') as HTMLElement;
    const messageEl = container.querySelector('#gameMessage') as HTMLElement;
    const restartBtn = container.querySelector('#restartBtn') as HTMLButtonElement;

    document.addEventListener('keydown', (e) => {
        // Prevent page from scrolling when using arrow keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }

        switch (e.key) {
            case 'ArrowUp': if (direction !== 'DOWN') nextDirection = 'UP'; break;
            case 'ArrowDown': if (direction !== 'UP') nextDirection = 'DOWN'; break;
            case 'ArrowLeft': if (direction !== 'RIGHT') nextDirection = 'LEFT'; break;
            case 'ArrowRight': if (direction !== 'LEFT') nextDirection = 'RIGHT'; break;
        }
    });

    restartBtn.addEventListener('click', () => {
        snake = [{ x: 10 * box, y: 10 * box }];
        direction = 'RIGHT';
        nextDirection = 'RIGHT';
        score = 0;
        scoreEl.textContent = score.toString();
        food = randomFood();
        gameOver = false;
        messageEl.textContent = '';
        requestAnimationFrame(gameLoop);
    });

    function randomFood() {
        return {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snake.forEach((seg, i) => {
            ctx.fillStyle = i === 0 ? 'green' : 'lightgreen';
            ctx.fillRect(seg.x, seg.y, box, box);
            ctx.strokeRect(seg.x, seg.y, box, box);
        });

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, box, box);
    }

    function update() {
        direction = nextDirection;

        let head = { ...snake[0] };
        if (direction === 'UP') head.y -= box;
        if (direction === 'DOWN') head.y += box;
        if (direction === 'LEFT') head.x -= box;
        if (direction === 'RIGHT') head.x += box;

        // Collision
        if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snake.some(s => s.x === head.x && s.y === head.y)) {
            gameOver = true;
            messageEl.textContent = `Game Over! Final Score: ${score}`;
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreEl.textContent = score.toString();
            food = randomFood();
        } else {
            snake.pop();
        }
    }

    function gameLoop() {
        if (gameOver) return;
        draw();
        update();
        setTimeout(() => requestAnimationFrame(gameLoop), 100); // controls speed
    }

    requestAnimationFrame(gameLoop);
}
