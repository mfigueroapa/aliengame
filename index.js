const $canvas = document.querySelector('canvas')
const $context = $canvas.getContext('2d')
let gameInterval
let frames = 0
const gravity = 0.98
const friction = 0.9
const keys = []
let meteorites = []
let ratio = 200

window.onload = () => {
    // loadMenu()
    startGame()
}

class Board {
    constructor() {
        this.x = 0
        this.y = 0
        this.width = $canvas.width
        this.height = $canvas.height
        this.img = new Image()
        this.img.src = ('./images/menu.jpg')
    }
    draw() {
        $context.drawImage(this.img, this.x, this.y, $canvas.width, $canvas.height)
    }
}
class Alien {
    constructor() {
        this.width = 60
        this.height = 100
        this.x = $canvas.width / 2 - this.width / 2
        this.y = $canvas.height - this.height
        this.velX = 0
        this.img = new Image()
        this.img.src = ('./images/char1-front.png')
    }
    draw() {
        // console.log("func draw from Alien called")
        if (this.x < -this.width+7) this.x = $canvas.width-7
        if (this.x > $canvas.width-7) this.x = -this.width+7
        $context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    changePos() {
        this.x += this.velX
        this.velX *= friction
    }
}
class Obstacle {
    constructor() {
        this.y = 10
        this.x = 350
        this.height = 130
        this.width = 50
        this.img = new Image()
        this.img.src = ('./images/meteorite.png')
    }
    draw() {
        this.y += 4
        $context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

// class Menu {
//     constructor() {
//         this.x = 0
//         this.y = 0
//         this.width = $canvas.width
//         this.height = $canvas.height
//         this.img = new Image()
//         this.img.src = ('./images/menu.jpg')
//     }
//     drawB() {
//         $context
//     }
//     draw() {
//         $context.drawImage(this.img, this.x, this.y, $canvas.width, $canvas.height)
//     }
// }

function startGame() {
    console.log("game started")
    if (gameInterval) return
    gameInterval = setInterval(updateGame, 1000 / 60)
}
function generateMeteorites() {
    if (frames % ratio === 0) {
        meteorites.push(new Obstacle())
        // console.log(obstacles)
    }
}
function drawMeteorites() {
    meteorites.forEach(obs => obs.draw())
}
function clearMeteorites() {
    meteorites = meteorites.filter(obs => obs.y > -obs.height)
}
function loadMenu() {
    mainMenu.draw()
    console.log("main menu")
}
function clearCanvas() {
    $context.clearRect(0, 0, $canvas.width, $canvas.height)
}

function updateGame() {
    frames++

    checkKeys()
    alien.changePos()

    clearMeteorites()
    clearCanvas()

    board.draw()
    alien.draw()

    generateMeteorites()
    drawMeteorites()
}
// let mainMenu = new Menu() //create main menu
let board = new Board() //create board instance
let alien = new Alien() //create alien instance 


//Control
function checkKeys() {
    if (keys["ArrowLeft"]) {
        alien.velX--
        console.log("moving right")
    }
    if (keys["ArrowRight"]) {
        alien.velX++
        console.log("moving left")
    }
}
document.onkeydown = e => {
    keys[e.key] = true
}

document.onkeyup = e => {
    keys[e.key] = false
}
