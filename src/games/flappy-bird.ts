export function startFlappyBird(container: HTMLElement) {
    container.innerHTML = `
        <h2>Flappy Bird</h2>
        <canvas id="birdCanvas" width="400" height="400" style="border:1px solid black;"></canvas>
        <p>Score: <span id="score">0</span></p>
    `;

    const canvas = container.querySelector('#birdCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const bird = { x: 50, y: 200, size: 20, velocity: 0 };
    const gravity = 0.5; // slightly less gravity, easier
    const jump = -10;
    const gap = 150; // bigger gap, easier
    const pipeWidth = 40;
    const pipeSpeed = 3; // faster pipes
    let pipes: { x: number, height: number }[] = [];
    let score = 0;
    let frame = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            e.preventDefault();
            bird.velocity = jump;
        }
    });

    function resetGame() {
        bird.y = 200;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        frame = 0;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Bird physics
        bird.velocity += gravity;
        bird.y += bird.velocity;

        // Draw bird
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bird.x, bird.y, bird.size, bird.size);

        // Pipes
        if (frame % 90 === 0) {
            const height = Math.random() * (canvas.height - gap - 50) + 20;
            pipes.push({ x: canvas.width, height });
        }

        pipes.forEach((pipe, index) => {
            pipe.x -= pipeSpeed;

            // Top pipe
            ctx.fillStyle = 'green';
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);

            // Bottom pipe
            ctx.fillRect(pipe.x, pipe.height + gap, pipeWidth, canvas.height - pipe.height - gap);

            // Collision
            if (
                bird.x + bird.size > pipe.x &&
                bird.x < pipe.x + pipeWidth &&
                (bird.y < pipe.height || bird.y + bird.size > pipe.height + gap)
            ) {
                resetGame();
            }

            // Increment score
            if (pipe.x + pipeWidth === bird.x) score++;
        });

        // Draw score
        (container.querySelector('#score') as HTMLElement).textContent = score.toString();

        // Check edges
        if (bird.y + bird.size > canvas.height || bird.y < 0) {
            resetGame();
        }

        frame++;
        requestAnimationFrame(draw);
    }

    draw();
}
