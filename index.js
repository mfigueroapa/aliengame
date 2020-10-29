//380 ctx igual a null
const $canvas = document.querySelector('canvas')
let $context = $canvas.getContext('2d')
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
let aloudShot = true
let gameOver
miStorage = window.localStorage;
$context.mainMenuMusic = new Audio();
$context.xplosion1Sound = new Audio();
$context.xplosion1Sound.src = "sounds/xplosn1.mp3";
$context.xplosion2Sound = new Audio();
$context.xplosion2Sound.src = "sounds/xplosn2.mp3";
$context.laserSound = new Audio();
$context.laserSound.src = "sounds/laser.mp3"
$context.laserSound2 = new Audio();
$context.laserSound2.src = "sounds/laser2.mp3"
$context.ding = new Audio();
$context.ding.src = "sounds/ding.mp3"
$context.sweep = new Audio();
$context.sweep.src = "sounds/sweep.mp3"
$context.gameOver = new Audio();
$context.gameOver.src = "sounds/gameOver.mp3"
$context.mainMenuMusic.src = "sounds/mainMenuGG.mp3"

window.onload = () => {
    $context.mainMenuMusic.play()
    $context.mainMenuMusic.loop = true
    console.log("A")
    document.querySelector(".startBtn").addEventListener("click", function () {
        $context.ding.play()
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
        $context.ding.play()
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
        $context.ding.play()
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
        $context.ding.play()
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
        $context.ding.play()
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

}

class Board {
    constructor() {
        this.x = 0
        this.y = 0
        this.width = $canvas.width
        this.height = $canvas.height
        this.img = new Image()
        this.img.src = ('./images/canvasBackground.png')
        // this.img.src = ('./images/menu.jpg')
    }
    draw() {
        $context.drawImage(this.img, this.x, this.y, $canvas.width, $canvas.height)
    }
}
class Alien {
    constructor() {
        this.width = 90
        this.height = 110
        this.x = $canvas.width / 2 - this.width / 2
        this.y = $canvas.height - this.height
        this.velX = 0
        this.img = new Image()
        this.img.src = ('./images/LilXalien.png')
        this.enhancedMode = false
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
        if (this.enhancedMode === false) {
            if (aloudShot === true) {

                generateBullets()
                drawBullets()
                $context.laserSound.play()


                aloudShot = false
                setTimeout(function () {
                    aloudShot = true
                }, 320)
                //320

            }
        } 
        else {
            if (aloudShot === true) {

                generateBullets()
                drawBullets()
                $context.laserSound2.play()


                aloudShot = false
                setTimeout(function () {
                    aloudShot = true
                }, 100)
                //100
            }
        }
        
    }

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
        const randomMeteoritePicker = Math.floor(Math.random() * (6 - 0) + 1)
        console.log(`random: ${randomMeteoritePicker}`)
        switch (randomMeteoritePicker) {
            case 1:
                this.img.src = ('./images/meteorite.png')
                break
            case 2:
                this.height = randomWidth + 50
                this.y = -this.height
                this.img.src = ('./images/meteorite2.png')
                break
            case 3:
                this.img.src = ('./images/meteorite3.png')
                break
            case 4:
                this.height = randomWidth + 60
                this.y = -this.height
                this.img.src = ('./images/meteorite4.png')
                break
            case 5:
                this.height = randomWidth + 95
                this.y = -this.height
                this.img.src = ('./images/meteorite5.png')
                break
            case 6:
                this.width = this.width + 40
                this.height = randomWidth + 80
                this.y = -this.height
                this.img.src = ('./images/meteorite6.png')
                break
            default:
                break
        }

    }
    draw() {
        this.y += this.speed
        // console.log("y"+this.y)
        // console.log("frames: "+frames)
        $context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
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
class Helper {
    constructor() {
        this.x = x
        this.y = 50
        this.width = 60
        this.height = 50
        this.img = new Image()
        this.img.src = ('./images/pakkun.png')
    }
    draw() {
        x += 4
        $context.drawImage(this.img, this.x, this.y, this.width, this.height)
    }

}

function startGame() {
    gameOver = false
    console.log("game started")
    $context.startSound = new Audio();
    $context.startSound.src = "sounds/mainTheme.mp3"
    $context.startSound.play();
    $context.startSound.loop = true;

    if (gameInterval) return
    gameInterval = setInterval(updateGame, 1000 / 60)
}

function generateMeteorites() {
    if (gameOver != true) {
        console.log(`frames: ${frames} ratio: ${ratio} meteoriteSpeed: ${meteoriteSpeed}`)
        if (frames % ratio === 0) {
            if (frames % 1000 === 0 && frames < 1001) {
                ratio = 150
                meteoriteSpeed += 2
            }
            if (frames % 2000 === 0 && frames < 2001) {
                ratio = 100
                meteoriteSpeed += 2
            }
            if (frames % 3000 === 0 && frames < 3001) {
                meteoriteSpeed += 2
                ratio = 50
            }
            if (frames % 4000 === 0 && frames < 4001) {
                meteoriteSpeed += 2
                ratio = 30
            }
            if (frames % 4500 === 0 && frames < 4501) {
                meteoriteSpeed += 2
                ratio = 20
            }
            if (frames % 4750 === 0 && frames < 4751) {
                meteoriteSpeed += 2
                ratio = 10
            }
            if (frames % 5000 === 0 && frames < 5001) {
                meteoriteSpeed += 2
                ratio = 5
            }
            if (frames % 6000 === 0 && frames < 6001) {
                meteoriteSpeed += 2
                ratio = 50
            }
            if (frames % 7000 === 0 && frames < 7001) {
                meteoriteSpeed += 2
                ratio = 15
            }
            if (frames % 8000 === 0 && frames < 8001) {
                meteoriteSpeed += 2
                ratio = 10
            }
            if (frames % 9000 === 0 && frames < 9001) {
                meteoriteSpeed += 2
                ratio = 5
            }


            meteorites.push(new Meteorite(meteoriteSpeed))
        }
    }

}

function drawMeteorites() {
    meteorites.forEach(obs => obs.draw())
}

function clearMeteorites() {
    meteorites = meteorites.filter(obs => obs.y > -obs.height)
}

function generateBullets() {
    // $context.laserSound2.play()
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
    if (frames > 1000 && frames < 1400) {
        if (frames % 1001 === 0) $context.sweep.play()
        $context.font = "30px Arcade Classic"

        $context.fillText(`From afar, meteorites seem to be `, 110, 360)
        $context.fillText(`coming at higher speeds...`, 180, 410)
        $context.fillText(`Show them what you've got!`, 155, 460)
        //
    }
    if (frames > 4500 && frames < 4900) {
        if (frames % 4501 === 0) $context.sweep.play()
        $context.font = "40px Arcade Classic"
        $context.fillText(`A nearby planet`, 220, 390)
        $context.fillText(`just exploded.`, 260, 450)
        $context.fillText(`Watch out for the `, 190, 510)
        $context.fillText(`Meteor Shower!`, 240, 570)
    }
    if (frames > 4950 && frames < 5300) {
        if (frames % 4501 === 0) $context.sweep.play()
        $context.font = "40px Arcade Classic"
        $context.fillText(`Charge loaded`, 250, 390)
        $context.fillText(`weapon switching .`, 210, 450)
        $context.fillText(`to full auto! `, 270, 510)
        $context.fillText(`Watch out!!`, 300, 570)
    }
}

function printScore() {
    if (frames % 200 === 0 && frames > 600) {
        const min = 1
        const max = 14
        const randomPoints = Math.floor(Math.random() * (max - min) + min)
        score += randomPoints
    }
    let scoreImage = new Image()
    scoreImage.src = ('./images/score.png')
    $context.drawImage(scoreImage, 340, 20, 143, 40)




    // $context.font = "55px Syne Tactile, cursive"
    $context.font = "55px Arcade Classic, cursive"
    $context.fillStyle = "white"

    $context.fillText(`${score}`, 95 + $canvas.width - $canvas.width / 2 - 40, 69)
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

function checkIfEnhancedMode() {
    if (frames > 5000 && frames < 6000) alien.enhancedMode = true
    // if (frames > 100 && frames < 6000) alien.enhancedMode = true
    else alien.enhancedMode = false
}

function checkIfGameOver() {
    if (lives < 1 && lives > -1) {

        gameOver = true

        let myDiv
        let displaySetting
        localStorage.setItem('Player 1', `${score}`);
        console.log(localStorage.getItem('Player 1'))
        myDiv = document.querySelector('.gameOverDiv span')
        displaySetting = myDiv.innerHTML = `Score: ${score}`

        console.log("u LOST :(")
        myDiv = document.querySelector('canvas');
        displaySetting = myDiv.style.display;
        myDiv.style.display = 'none';
        myDiv = document.querySelector(".gameOverDiv")
        displaySetting = myDiv.style.display
        myDiv.style.display = 'block'
        // gameInterval = null
        // lives = -1
        // meteorites = []
        if (gameOver === true) {
            $context.gameOver.play()
            lives = -1
        }
    }
    
}


// function helperAids() {
//     if (frames % 3000)
//     let helper = new Helper()

// }

function updateGame() {
    if (gameOver !== true) {
        frames++

        checkIfEnhancedMode()

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
    }
    


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
    if (keys[" "]) {
        alien.shoot()
    }


}
document.onkeydown = e => {
    keys[e.key] = true
    return
}

document.onkeyup = e => {
    keys[e.key] = false
}