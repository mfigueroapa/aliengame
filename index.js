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
let meteoriteSpeed = 4
$context.xplosion1Sound = new Audio();
$context.xplosion1Sound.src = "sounds/xplosn2.mp3";
$context.xplosion2Sound = new Audio();
$context.xplosion2Sound.src = "sounds/xplosn1.mp3";
$context.laserSound = new Audio();
$context.laserSound.src = "sounds/laser.mp3"
$context.mainMenuMusic = new Audio();
// $context.mainMenuMusic.src = "sounds/mainMenuGG.mp3"

// var link = document.createElement('link');
// link.rel = 'stylesheet';
// link.type = 'text/css';
// link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
window.onload = () => {
    
    
    $context.mainMenuMusic.play()
    $context.mainMenuMusic.loop = true
    console.log("A")
    document.querySelector(".startBtn").addEventListener("click", function () {
        let myDiv = document.querySelector('.startScreen');
        let displaySetting = myDiv.style.display;
        myDiv.style.display = 'none';
        if (displaySetting == 'block' || displaySetting == '') {
            myDiv.style.display = 'none';
        } else {
            myDiv.style.display = 'block';
        }
        myDiv = document.querySelector('canvas')
        displaySetting = myDiv.style.display
        myDiv.style.display = 'block'
        $context.mainMenuMusic.pause()
        startGame()
    });

    document.querySelector(".instructionsBtn").addEventListener("click", function () {
        let myDiv = document.querySelector('.startScreen');
        let displaySetting = myDiv.style.display;
        myDiv.style.display = 'none';
        if (displaySetting == 'block' || displaySetting == '') {
            myDiv.style.display = 'none';
        } else {
            myDiv.style.display = 'block';
        }
        myDiv = document.querySelector('.instructionsDiv')
        displaySetting = myDiv.style.display
        myDiv.style.display = 'block';
    });
    document.querySelector(".goBackInstructionsBtn").addEventListener("click", function () {
        console.log("goBackInstructionsBtn")
        let myDiv = document.querySelector('.startScreen');
        let displaySetting = myDiv.style.display;
        if (displaySetting == 'block' || displaySetting == '') {
            myDiv.style.display = 'none';
        } else {
            myDiv.style.display = 'block';
        }
        myDiv = document.querySelector('.instructionsDiv')
        displaySetting = myDiv.style.display
        myDiv.style.display = 'none';

    });
    document.querySelector(".creditsBtn").addEventListener("click", function () {
        let myDiv = document.querySelector('.startScreen');
        let displaySetting = myDiv.style.display;
        myDiv.style.display = 'none';
        if (displaySetting == 'block' || displaySetting == '') {
            myDiv.style.display = 'none';
        } else {
            myDiv.style.display = 'block';
        }
        myDiv = document.querySelector('.creditsDiv')
        displaySetting = myDiv.style.display
        myDiv.style.display = 'block';
    });
    document.querySelector(".goBackCreditsBtn").addEventListener("click", function () {
        let myDiv = document.querySelector('.creditsDiv');
        let displaySetting = myDiv.style.display;
        myDiv.style.display = 'none';
        myDiv = document.querySelector('.startScreen');
        displaySetting = myDiv.style.display;
        myDiv.style.display = 'block';
    });
    document.querySelector(".mainMenuWhenLost").addEventListener("click", function () {
        console.log("lost")
        window.location.reload(true);
    });
    //gameOverDiv
    // mainMenuWhenLost

    // startGame()
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
    // shoot() {

    // }

}
class Meteorite {
    constructor(speed) {
        const minXPos = 0
        const maxXPos = $canvas.width - 100
        const randomXPos = Math.floor(Math.random() * (maxXPos - minXPos))
        // console.log(`radnwomPos: ${randomXPos}`)
        const minWidth = 100
        const maxWidth = 150
        const randomWidth = Math.floor(Math.random() * (120 - 50) + 50)
        // console.log(`random width: ${randomWidth}`)
        this.width = randomWidth
        this.height = randomWidth + 100
        this.y = -this.height
        this.x = randomXPos
        this.speed = speed
        this.img = new Image()
        this.img.src = ('./images/meteorite.png')
    }
    draw() {
        this.y += this.speed
        // console.log("y"+this.y)
        console.log("frames: "+frames)
        $context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    // increaseDifficulty() {
    //     if (frames > 1000) {
    //         this.speed+=4
    //     }
    //     // if (frames % 200 === 0 && frames > 600) {
    //     //     const min = 1
    //     //     const max = 14
    //     //     const randomPoints = Math.floor(Math.random() * (max - min) + min)
    //     //     score += randomPoints
    //     // }
    // }
}

class Bullet {
    constructor() {
        this.x = alien.x + alien.width / 2 - 25
        this.y = $canvas.height - alien.height
        this.width = 50
        this.height = 50
        this.img = new Image()
        this.img.src = ('./images/bullet.png')
    }
    draw() {
        this.y -= 10
        $context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

class Heart {
    constructor(x) {
        this.x = x
        this.y = 10
        this.width = 60
        this.height = 50
        this.img = new Image()
        this.img.src = ('./images/heart.png')
    }
    draw() {
        // this.y -= 10
        $context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

function startGame() {
    console.log("game started")
    $context.startSound = new Audio();
    // $context.startSound.src = "sounds/mainTheme.mp3"
    $context.startSound.play();
    $context.startSound.loop = true;
    if (gameInterval) return
    gameInterval = setInterval(updateGame, 1000 / 60)
}

function generateMeteorites() {
    if (frames % ratio === 0) {
        if (frames % 1000 === 0) {
            // ratio=50
            meteoriteSpeed += 2
        }
        // if (frames % 3000 === 0) {
        //     meteoriteSpeed += 2
        // }
        // if (frames % 5000 === 0) {
        //     meteoriteSpeed += 2
        // }
        
        meteorites.push(new Meteorite(meteoriteSpeed))
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

function changeInDifficultyMessage() {
    // if (frames > 500 ) {
    //     console.log("DIFFFFFFF")
    //  $context.font = "10px Press Start 2P"
     $context.font = "50px Press Start 2P"
        // $context.fillText(`You are doing great! Now meteorites go twice as fast! Show them what you've got!`, 100,100)
        // $context.fillText(`as fast! Show them what you've got!`, 100, 200)
    // }
}

function printScore() {
    if (frames % 200 === 0 && frames > 600) {
        const min = 1
        const max = 14
        const randomPoints = Math.floor(Math.random() * (max - min) + min)
        score += randomPoints
    }
    // $context.font = "40px Sans-serif"
    $context.font = "40px Press Start 2P"
    // $context.font = "40px Arial"
    $context.fillStyle = "white"
    
    $context.fillText(`Score: ${score}`, $canvas.width - $canvas.width / 2 - 40, 50)
}

function printLives() {
    $context.font = "40px Sans-serif"
    // $context.font = "40px Press Start 2P"
    // $context.fillStyle = "white"
    // $context.fillText(`Lives: ${lives}`, 10, 50)
    let heartX = 10
    for (let i = 0; i < lives; i++) {
        let heart = new Heart(heartX)
        heart.draw()
        heartX += 70
    }
}



function checkCollitions() {
    meteorites.forEach((meteorite, index) => {
        if (alien.isColliding(meteorite)) {
            
            meteorites.splice(index, 1)
            lives -= 1
            // lives.splice(index,1)
            // console.log(index)
            // console.log("u LOST")
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
                meteorites.splice(index, 1)
                bullets.splice(i, 1)
                score += 25
                $context.xplosion2Sound.play();
            }
        })
    })
}

function checkIfGameOver() {
    if (lives < 1) {
        console.log("u LOST :(")
        let myDiv = document.querySelector('canvas');
        let displaySetting = myDiv.style.display;
        myDiv.style.display = 'none';
        myDiv = document.querySelector(".gameOverDiv")
        displaySetting = myDiv.style.display
        myDiv.style.display = 'block'

    }
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
    changeInDifficultyMessage()


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