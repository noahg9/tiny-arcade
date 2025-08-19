import './style.css'

// Import the games
import { startSnakeGame } from './games/snake'
import { startMemoryGame } from './games/memory-game'
import { startFlappyBird } from './games/flappy-bird'
import { startPong } from './games/pong'
import { startAvoider } from './games/avoider'

const container = document.getElementById('gameContainer')!

// List of games with optional icons (you can replace with actual SVGs or emojis)
const games = [
    { name: 'Snake', start: startSnakeGame, icon: '🐍' },
    { name: 'Memory Game', start: startMemoryGame, icon: '🧠' },
    { name: 'Flappy Bird', start: startFlappyBird, icon: '🐦' },
    { name: 'Pong', start: startPong, icon: '🏓' },
    { name: 'Avoider', start: startAvoider, icon: '🚀' },
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
