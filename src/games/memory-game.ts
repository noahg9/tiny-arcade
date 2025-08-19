export function startMemoryGame(container: HTMLElement) {
    container.innerHTML = `<h2>Memory Game</h2><div id="memoryBoard" style="display:grid;grid-template-columns:repeat(4,100px);gap:10px;"></div>`;

    const board = container.querySelector('#memoryBoard') as HTMLElement;
    const symbols = ['🍎', '🍌', '🍇', '🍉', '🍎', '🍌', '🍇', '🍉'];
    let firstCard: HTMLElement | null = null;
    let secondCard: HTMLElement | null = null;
    let lock = false;
    let matches = 0;

    symbols.sort(() => Math.random() - 0.5);

    symbols.forEach(sym => {
        const card = document.createElement('div');
        card.textContent = '';
        card.dataset.symbol = sym;
        card.style.width = '100px';
        card.style.height = '100px';
        card.style.background = 'lightblue';
        card.style.display = 'flex';
        card.style.justifyContent = 'center';
        card.style.alignItems = 'center';
        card.style.fontSize = '2rem';
        card.style.cursor = 'pointer';
        board.appendChild(card);

        card.addEventListener('click', () => {
            if (lock || card === firstCard || card.textContent) return;
            card.textContent = sym;

            if (!firstCard) {
                firstCard = card;
            } else {
                secondCard = card;
                lock = true;
                setTimeout(() => {
                    if (firstCard?.dataset.symbol === secondCard?.dataset.symbol) {
                        matches++;
                        if (matches === symbols.length / 2) alert('You won!');
                    } else {
                        firstCard!.textContent = '';
                        secondCard!.textContent = '';
                    }
                    firstCard = null;
                    secondCard = null;
                    lock = false;
                }, 400);
            }
        });
    });
}
