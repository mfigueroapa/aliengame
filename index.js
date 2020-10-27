const $canvas = document.querySelector('canvas')
const $context = $canvas.getContext('2d')
let gameInterval
let frames = 0
const gravity = 0.98
const friction = 0.9
const keys = []
let meteorites = []
let bullets = []
let ratio = 200
let score = 0
let lives = 3
$context.xplosion1Sound = new Audio();
$context.xplosion1Sound.src = "sounds/xplosn2.mp3";
$context.xplosion2Sound = new Audio();
$context.xplosion2Sound.src = "sounds/xplosn1.mp3";
$context.laserSound = new Audio();
$context.laserSound.src = "sounds/laser.mp3"


window.onload = () => {
    $context.startSound = new Audio();
    $context.startSound.src = "sounds/mainTheme.mp3"
    $context.startSound.play();
    $context.startSound.loop = true;
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
        if (this.x < -this.width + 7) this.x = $canvas.width - 7
        if (this.x > $canvas.width - 7) this.x = -this.width + 7
        $context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    changePos() {
        this.x += this.velX
        this.velX *= friction
    }
    isColliding(meteorite) {
        return (
            this.y < meteorite.y + meteorite.height &&
            this.y + this.height > meteorite.y &&
            this.x < meteorite.x + meteorite.width &&
            this.x + this.width > meteorite.x
        )
    }
    shoot() {

    }

}
class Meteorite {
    constructor() {
        const minXPos = 0
        const maxXPos = $canvas.width - 100
        const randomXPos = Math.floor(Math.random() * (maxXPos - minXPos))
        // console.log(`radnwomPos: ${randomXPos}`)
        const minWidth = 100
        const maxWidth = 150
        const randomWidth = Math.floor(Math.random() * (120 - 50) + 50)
        // console.log(`random width: ${randomWidth}`)
        this.y = 0
        this.x = randomXPos
        this.width = randomWidth
        this.height = randomWidth + 100
        this.img = new Image()
        this.img.src = ('./images/meteorite.png')
    }
    draw() {
        this.y += 4
        $context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

class Bullet {
    constructor() {
        this.x = alien.x + alien.width/2 - 25
        this.y = $canvas.height-alien.height
        this.width = 50
        this.height = 50
        this.img = new Image()
        this.img.src = ('./images/bullet.png')
    }
    draw() {
        this.y-=10
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
        meteorites.push(new Meteorite())
        // console.log(obstacles)
    }
}

function drawMeteorites() {
    meteorites.forEach(obs => obs.draw())
}

function clearMeteorites() {
    meteorites = meteorites.filter(obs => obs.y > -obs.height)
}
function generateBullets() {
    bullets.push(new Bullet())
}

function drawBullets() {
    bullets.forEach(bull => bull.draw())
}

function clearBullets() {
    bullets = bullets.filter(obs => obs.y > -0)
}
function loadMenu() {
    mainMenu.draw()
    console.log("main menu")
}

function clearCanvas() {
    $context.clearRect(0, 0, $canvas.width, $canvas.height)
}

function printScore() {
    if (frames % 200 === 0 && frames > 600) {
        const min = 1
        const max = 14
        const randomPoints = Math.floor(Math.random() * (max-min) + min)
        score+=randomPoints
    }
    $context.font = "40px Sans-serif"
    $context.fillStyle = "white"
    $context.fillText(`Score: ${score}`, $canvas.width - $canvas.width / 2 - 40, 50)
}

function printLives() {
    $context.font = "40px Sans-serif"
    $context.fillStyle = "white"
    $context.fillText(`Lives: ${lives}`, 10, 50)
}

function checkCollitions() {
    meteorites.forEach((meteorite,index) => {
        if (alien.isColliding(meteorite)) {
            lives-=1
            meteorites.splice(meteorite, 1)
            // lives.splice(index,1)
            console.log(index)
            console.log("u LOST")
            //restar vida correctamente
            $context.xplosion1Sound.play();
        }
    })
}
function checkIfBulletHit() {
    bullets.forEach((bullet, i) => {
        meteorites.forEach((meteorite, index) => {

            if (bullet.y < meteorite.y + meteorite.height &&
                bullet.y + bullet.height > meteorite.y &&
                bullet.x < meteorite.x + meteorite.width &&
                bullet.x + bullet.width > meteorite.x) {
                    meteorites.splice(index,1)
                    bullets.splice(i,1)
                    score+=25
                    $context.xplosion2Sound.play();
                    
                }
        })
    })
}

function checkIfGameOver() {
    if(lives < 1) alert("Perdiste!")
}

function updateGame() {
    frames++

    checkIfGameOver()

    checkKeys()
    alien.changePos()

    clearMeteorites()
    clearCanvas()

    checkCollitions()

    board.draw()
    alien.draw()

    generateMeteorites()
    drawMeteorites()

    drawBullets()
    clearBullets()

    checkIfBulletHit()

    printScore()
    printLives()

    
    // console.log("bullets: "+ bullets)
}
// let mainMenu = new Menu() //create main menu
let board = new Board() //create board instance
let alien = new Alien() //create alien instance 


//Control
function checkKeys() {
    if (keys["ArrowLeft"]) {
        alien.velX--
        // console.log("moving left")
    }
    if (keys["ArrowRight"]) {
        alien.velX++
    }

    
}
document.onkeydown = e => {
    if (e.key === " ") {
        generateBullets()
        drawBullets()
        $context.laserSound.play();

    }
    keys[e.key] = true
}

document.onkeyup = e => {
    keys[e.key] = false
}
