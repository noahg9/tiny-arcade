// reversi.ts
import { clearContainer, createEl } from '../utils'

export const ReversiGame = {
    name: 'Reversi',
    icon: '⚫️⚪️',
    start: startReversi,
}

function startReversi(container: HTMLElement) {
    clearContainer(container)

    const BOARD_SIZE = 8
    const EMPTY = 0, BLACK = 1, WHITE = 2
    let board: number[][] = []
    let current = BLACK
    let gameOver = false

    const title = createEl('h2', 'game-title', 'Reversi')
    const info = createEl('div', 'reversi-info', 'Current: <span id="currentPlayer">Black</span>')
    const boardEl = createEl('div', 'reversi-board')
    const controls = createEl('div', 'reversi-controls')
    const passBtn = createEl('button', 'btn', 'Pass')
    const newBtn = createEl('button', 'btn', 'New Game')
    controls.append(passBtn, newBtn)
    container.append(title, info, boardEl, controls)

    const DIRS = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
    ]

    function inBounds(r: number, c: number) {
        return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE
    }

    function initBoard() {
        board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY))
        const mid = BOARD_SIZE / 2
        board[mid - 1][mid - 1] = WHITE
        board[mid][mid] = WHITE
        board[mid - 1][mid] = BLACK
        board[mid][mid - 1] = BLACK
        current = BLACK
        gameOver = false
        render()
    }

    function flipsForMove(r: number, c: number, player: number) {
        if (board[r][c] !== EMPTY) return []
        const other = player === BLACK ? WHITE : BLACK
        const flips: [number, number][] = []
        for (const [dr, dc] of DIRS) {
            const line: [number, number][] = []
            let rr = r + dr, cc = c + dc
            while (inBounds(rr, cc) && board[rr][cc] === other) {
                line.push([rr, cc])
                rr += dr; cc += dc
            }
            if (inBounds(rr, cc) && board[rr][cc] === player && line.length > 0) {
                flips.push(...line)
            }
        }
        return flips
    }

    function legalMoves(player: number) {
        const moves: [number, number][] = []
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (flipsForMove(r, c, player).length > 0) moves.push([r, c])
            }
        }
        return moves
    }

    function applyMove(r: number, c: number, player: number) {
        const flips = flipsForMove(r, c, player)
        if (flips.length === 0) return false
        board[r][c] = player
        flips.forEach(([rr, cc]) => board[rr][cc] = player)
        current = player === BLACK ? WHITE : BLACK
        render()
        checkForPassOrEnd()
        return true
    }

    function checkForPassOrEnd() {
        const curMoves = legalMoves(current)
        if (curMoves.length === 0) {
            const other = current === BLACK ? WHITE : BLACK
            const otherMoves = legalMoves(other)
            if (otherMoves.length === 0) {
                gameOver = true
                const score = countScore()
                setTimeout(() => alert(`Game over! Black: ${score.black} White: ${score.white}`), 50)
            } else {
                alert((current === BLACK ? 'Black' : 'White') + ' has no moves and must pass.')
                current = other
                render()
            }
        }
    }

    function countScore() {
        let black = 0, white = 0
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (board[r][c] === BLACK) black++
                if (board[r][c] === WHITE) white++
            }
        }
        return { black, white }
    }

    function render() {
        boardEl.innerHTML = ''
        boardEl.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 40px)`
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const cell = createEl('div', 'reversi-cell')
                cell.dataset.r = String(r)
                cell.dataset.c = String(c)
                if (board[r][c] === BLACK) {
                    cell.appendChild(createEl('div', 'disc black'))
                } else if (board[r][c] === WHITE) {
                    cell.appendChild(createEl('div', 'disc white'))
                } else {
                    const flips = flipsForMove(r, c, current)
                    if (flips.length > 0) {
                        cell.classList.add('legal')
                        cell.addEventListener('click', () => {
                            if (gameOver) return
                            applyMove(r, c, current)
                            if (!gameOver && current === WHITE) {
                                setTimeout(() => aiPlay(), 150)
                            }
                        }, { once: true })
                    }
                }
                boardEl.appendChild(cell)
            }
        }
        document.getElementById('currentPlayer')!.textContent = current === BLACK ? 'Black' : 'White'
        const score = countScore()
        const old = container.querySelector('.score-display')
        if (old) old.remove()
        container.appendChild(createEl('div', 'score-display', `Black: <strong>${score.black}</strong> — White: <strong>${score.white}</strong>`))
    }

    function aiPlay() {
        const moves = legalMoves(WHITE)
        if (moves.length === 0) {
            current = BLACK
            render()
            checkForPassOrEnd()
            return
        }
        let best: [number, number] | null = null
        let bestFlips = -1
        for (const [r, c] of moves) {
            const flips = flipsForMove(r, c, WHITE).length
            if (flips > bestFlips) {
                bestFlips = flips
                best = [r, c]
            }
        }
        if (best) {
            applyMove(best[0], best[1], WHITE)
        }
    }

    passBtn.addEventListener('click', () => {
        if (gameOver) return
        const moves = legalMoves(current)
        if (moves.length > 0) {
            alert('You have legal moves — you cannot pass.')
            return
        }
        current = current === BLACK ? WHITE : BLACK
        render()
        if (!gameOver && current === WHITE) setTimeout(aiPlay, 150)
    })

    newBtn.addEventListener('click', initBoard)

    initBoard()
}
