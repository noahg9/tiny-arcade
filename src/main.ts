import './style.css'
import { YahtzeeGame } from './games/yahtzee'
import { ReversiGame } from './games/reversi'

const container = document.getElementById('gameContainer')!

// List of games
const games = [
    YahtzeeGame,
    ReversiGame,
]

const sidebarNav = document.getElementById('sidebar-nav')!

// Generate buttons dynamically
games.forEach(game => {
    const btn = document.createElement('button')
    btn.innerHTML = `<span class="icon">${game.icon}</span><span class="text">${game.name}</span>`
    btn.addEventListener('click', () => game.start(container))
    sidebarNav.appendChild(btn)
})

// Start the first game by default
games[0].start(container)

// Sidebar toggle
const sidebar = document.getElementById('sidebar')!
const mainContent = document.getElementById('main-content')!
document.getElementById('toggleSidebar')?.addEventListener('click', () => {
    sidebar.classList.toggle('closed')
})

// Prevent arrow keys from scrolling the page
window.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
    }
})
