export function startMemoryGame(container: HTMLElement) {
    container.innerHTML = `
        <h2>Memory Game</h2>
        <div id="grid" style="display:grid; grid-template-columns: repeat(4, 80px); gap:5px;"></div>
        <p>Matches: <span id="score">0</span></p>
    `;

    const grid = container.querySelector('#grid')!;
    const scoreEl = container.querySelector('#score')!;
    const cards = ['🐶', '🐱', '🐰', '🦊', '🐶', '🐱', '🐰', '🦊'];
    let first: HTMLElement | null = null;
    let second: HTMLElement | null = null;
    let score = 0;

    cards.sort(() => Math.random() - 0.5).forEach(icon => {
        const card = document.createElement('div');
        card.textContent = '';
        card.style.width = '80px';
        card.style.height = '80px';
        card.style.background = 'lightgray';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'center';
        card.style.fontSize = '40px';
        card.style.cursor = 'pointer';
        card.dataset.icon = icon;
        card.addEventListener('click', () => {
            if (card === first || card === second) return;
            card.textContent = icon;

            if (!first) first = card;
            else if (!second) {
                second = card;
                if (first.dataset.icon === second.dataset.icon) {
                    score++;
                    scoreEl.textContent = score.toString();
                    first = second = null;
                } else {
                    setTimeout(() => {
                        first!.textContent = '';
                        second!.textContent = '';
                        first = second = null;
                    }, 1000);
                }
            }
        });
        grid.appendChild(card);
    });
}
