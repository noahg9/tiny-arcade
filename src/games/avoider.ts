export function startAvoider(container: HTMLElement) {
    container.innerHTML = `
        <h2>Avoider</h2>
        <canvas id="avoidCanvas" width="400" height="400" style="border:1px solid black;"></canvas>
        <p>Score: <span id="score">0</span></p>
    `;

    const canvas = container.querySelector('#avoidCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const player = { x: 180, y: 350, width: 40, height: 40 };
    const keys: { [key: string]: boolean } = {};
    let obstacles: { x: number, y: number, width: number, height: number }[] = [];
    let score = 0;
    let frame = 0;

    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Move player
        if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
        if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += 5;

        // Draw player
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Obstacles
        if (frame % 60 === 0) {
            obstacles.push({ x: Math.random() * 360, y: 0, width: 40, height: 20 });
        }

        obstacles.forEach((obs, i) => {
            obs.y += 4;
            ctx.fillStyle = 'red';
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

            // Collision
            if (player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y) {
                alert(`Game Over! Score: ${score}`);
                obstacles = [];
                score = 0;
                frame = 0;
            }

            if (obs.y > canvas.height) score++;
        });

        (container.querySelector('#score') as HTMLElement).textContent = score.toString();
        frame++;
        requestAnimationFrame(draw);
    }

    draw();
}
