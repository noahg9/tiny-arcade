// yahtzee.ts
import { clearContainer, createEl } from '../utils'

export const YahtzeeGame = {
    name: 'Yahtzee',
    icon: '🎲',
    start: startYahtzee,
}

function startYahtzee(container: HTMLElement) {
    clearContainer(container)

    // Game state
    const dice = [0, 0, 0, 0, 0]
    const kept = [false, false, false, false, false]
    let rollsLeft = 3
    const categories = [
        'Aces', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes',
        'Three of a Kind', 'Four of a Kind', 'Full House',
        'Small Straight', 'Large Straight', 'Yahtzee', 'Chance',
    ]
    const scoreSheet: Record<string, number> = {}
    let isGameOver = false

    // Layout
    const title = createEl('h2', 'game-title', 'Yahtzee')
    const info = createEl('div', 'yahtzee-info', `Rolls left: <span id="rollsLeft">${rollsLeft}</span>`)
    const diceRow = createEl('div', 'dice-row')
    const rollBtn = createEl('button', 'btn', 'Roll')
    const resetBtn = createEl('button', 'btn', 'New Game')
    const scoreBoard = createEl('div', 'scoreboard')
    container.append(title, info, diceRow, rollBtn, resetBtn, scoreBoard)

    function renderDice() {
        diceRow.innerHTML = ''
        dice.forEach((d, i) => {
            const die = createEl('div', 'die', d ? String(d) : '—')
            if (kept[i]) die.classList.add('kept')
            die.addEventListener('click', () => {
                if (rollsLeft === 3) return // can't keep before first roll
                kept[i] = !kept[i]
                renderDice()
            })
            diceRow.appendChild(die)
        })
    }

    function rollDice() {
        if (rollsLeft <= 0 || isGameOver) return
        for (let i = 0; i < 5; i++) {
            if (!kept[i]) dice[i] = Math.floor(Math.random() * 6) + 1
        }
        rollsLeft--
        document.getElementById('rollsLeft')!.textContent = String(rollsLeft)
        renderDice()
        renderScoreboard()
        if (rollsLeft === 0) {
            rollBtn.setAttribute('disabled', 'true')
        }
    }

    function countValues(arr: number[]) {
        const counts = [0, 0, 0, 0, 0, 0]
        arr.forEach(v => { if (v) counts[v - 1]++ })
        return counts
    }

    function calcCategory(cat: string, diceArr: number[]) {
        const counts = countValues(diceArr)
        const total = diceArr.reduce((a, b) => a + b, 0)
        switch (cat) {
            case 'Aces': return counts[0] * 1
            case 'Twos': return counts[1] * 2
            case 'Threes': return counts[2] * 3
            case 'Fours': return counts[3] * 4
            case 'Fives': return counts[4] * 5
            case 'Sixes': return counts[5] * 6
            case 'Three of a Kind': return counts.some(c => c >= 3) ? total : 0
            case 'Four of a Kind': return counts.some(c => c >= 4) ? total : 0
            case 'Full House': return (counts.includes(3) && counts.includes(2)) ? 25 : 0
            case 'Small Straight': {
                const has = (vals: number[]) => vals.every(v => counts[v - 1] > 0)
                if (has([1, 2, 3, 4]) || has([2, 3, 4, 5]) || has([3, 4, 5, 6])) return 30
                return 0
            }
            case 'Large Straight': {
                const is1 = [1, 2, 3, 4, 5].every(v => counts[v - 1] > 0)
                const is2 = [2, 3, 4, 5, 6].every(v => counts[v - 1] > 0)
                return (is1 || is2) ? 40 : 0
            }
            case 'Yahtzee': return counts.some(c => c === 5) ? 50 : 0
            case 'Chance': return total
        }
        return 0
    }

    function renderScoreboard() {
        scoreBoard.innerHTML = ''
        const table = createEl('table', 'score-table')
        categories.forEach(cat => {
            const tr = createEl('tr')
            const tdName = createEl('td', 'cat', cat)
            const tdVal = createEl('td', 'val')
            if (scoreSheet[cat] !== undefined) {
                tdVal.textContent = String(scoreSheet[cat])
            } else {
                if (rollsLeft === 3) {
                    tdVal.textContent = '-'
                } else {
                    tdVal.textContent = String(calcCategory(cat, dice))
                    const takeBtn = createEl('button', 'small', 'Take')
                    takeBtn.addEventListener('click', () => {
                        scoreSheet[cat] = calcCategory(cat, dice)
                        for (let i = 0; i < 5; i++) { dice[i] = 0; kept[i] = false }
                        rollsLeft = 3
                        rollBtn.removeAttribute('disabled')
                        document.getElementById('rollsLeft')!.textContent = String(rollsLeft)
                        renderDice()
                        renderScoreboard()
                        checkGameOver()
                    })
                    tdVal.append(' ')
                    tdVal.appendChild(takeBtn)
                }
            }
            tr.append(tdName, tdVal)
            table.appendChild(tr)
        })
        const total = Object.values(scoreSheet).reduce((a, b) => a + (b || 0), 0)
        const totalRow = createEl('div', 'total', `Total: <strong>${total}</strong>`)
        scoreBoard.append(table, totalRow)
    }

    function checkGameOver() {
        if (Object.keys(scoreSheet).length === categories.length) {
            isGameOver = true
            const finalScore = Object.values(scoreSheet).reduce((a, b) => a + (b || 0), 0)
            alert('Game over! Final score: ' + finalScore)
        }
    }

    rollBtn.addEventListener('click', rollDice)
    resetBtn.addEventListener('click', () => {
        for (let i = 0; i < 5; i++) { dice[i] = 0; kept[i] = false }
        rollsLeft = 3
        Object.keys(scoreSheet).forEach(k => delete scoreSheet[k])
        isGameOver = false
        rollBtn.removeAttribute('disabled')
        document.getElementById('rollsLeft')!.textContent = String(rollsLeft)
        renderDice()
        renderScoreboard()
    })

    renderDice()
    renderScoreboard()
}
