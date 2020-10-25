const $canvas = document.querySelector('canvas')
const $context = $canvas.getContext('2d')
let gameInterval
let frames = 0
const gravity = 0.98
const friction = 0.9
const keys = []

window.onload = () => {
    startGame()
}

class Board {
    constructor() {
        this.x = 0
        this.y = 0
        this.width = $canvas.width
        this.height = $canvas.height
        this.img = new Image()
        this.img.src = ('./images/satellite.jpg')
    }
    draw() {
        // console.log("func draw from Board called")
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
        this.img.src = ('./images/alien1.png')
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
    // moveLeft() {
    //     console.log("moveL")
    //     this.x -= 15
    // }
    // moveRight() {
    //     console.log("moveR")
    //     this.x += 15
    // }

}

function startGame() {
    console.log("game started")
    if (gameInterval) return
    gameInterval = setInterval(updateGame, 1000 / 60)
}

function clearCanvas() {
    $context.clearRect(0, 0, $canvas.width, $canvas.height)
}

function updateGame() {
    // frames++
    checkKeys()
    alien.changePos()
    clearCanvas()
    board.draw()
    alien.draw()
    
}

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
// document.onkeydown = e => {
//     switch (e.key) {
//         case 'ArrowLeft':
//             alien.moveLeft()
//             break;
//         case 'ArrowRight':
//             alien.moveRight()
//             break;
//         default:
//             break;
//     }
// }