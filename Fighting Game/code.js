document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const enemyDisplay = document.getElementById('enemies');
    const BgMusic = new Audio('Audio/Bg-music.mp3');
   BgMusic.loop = true;
   BgMusic.play();
   BgMusic.volume = 0.1;

    const width = 10;
    const tilesize = 48;

    const squares = [];
    let score = 0;
    let level = 0;
    let enemies = [];
    const projectiles = [];
    let PlayerPosition = 40;
    let playerDirection = 'right';
    let gameRunning = true;

    //y,w,x,z= hjørnevæg ; a,b= sidevæg ; c,d= top/bundvæg
    //)= lanterns ; (= firepots; %=venstredør; ^= topdør; $= trapper
    //top-right-water=U; top-left-water=O; bottom-right-water=P; bottom-left-water=I; top-water=L; bottom-water=M; center-water=N;
    //*= slicer enemies; }=skeletor enemy; (space)= normal area); g= Gabriela enemy
    const maps = [
        //Level 1 layout    
      
      
[
'yccccc^ccw',
'aOLU  shib',
'aJNK * jkb',
'aIMP((   b',
'a   }   $b',
'a        b',
'a  (( *  b',
'a        b',
'xddddddddz'
        ],
        [
'yccccccccw',
'ahi  *   b',
'ajk      b',
'a  ((    b',
'a    }   b',
'a        b',
'a   *    b',
'a      $ b',
'xddddddddz'
        ],
        [
'yccccc^ccw',
'a *   *  b',
'a  ((    b',
'a        b',
'a   }    b',
'a        b',
'a  *  (( b',
'a     $( b',
'xddddddddz'
        ],
          [
'yccccccccw',
'a$  *   sb',
'acccccc  b',
'a   *   gb',
'a a   a  b',
'a}a } a  b',
'a xddda  b',
'a*    a}}b',
'xddddddddz'
        ],
         [
'yccccccccw',
'a     }  b',
'a((((( ((b',
'a}(}    *b',
'a ( (((((b',
'a       *b',
'a ((}((((b',
'ag     *$b',
'xddddddddz'
],


    ]
//Dette beskriver hvordan vores spilareal skal ser ud.
    function createBoard() {
        gameRunning = true;
        grid.innerHTML = '';
        squares.length = 0;
        enemies = [];

        const currentMap = maps[level];
        for (let i = 0; i < 9; i++) {
            for(let j = 0; j < 10; j++) {
                const square = document.createElement('div');
                // Dette giver et id tal til hver div i grid.
                square.setAttribute('id', i*width + j);

        const char = currentMap[i][j]
        addMapElement(square, char, j, i);

                grid.appendChild(square);
                squares.push(square);
            }
        }
        createPlayer();
        updateDisplays();
    }
//Denne funktion tilføjer de forskellige elementer af spillet til de forskellige divs i grid.
    function addMapElement(square, char, x, y) {
        switch(char) {
            case 'a':
                square.classList.add('left-wall');
                break;
            case 'b':
                square.classList.add('right-wall');
                break;
            case 'c':
                square.classList.add('top-wall');
                break;
            case 'd':
                square.classList.add('bottom-wall');
                break;
            case 'w':
                square.classList.add('top-right-wall');
                break;
            case 'x':
                square.classList.add('bottom-left-wall');
                break;
            case 'y':
                square.classList.add('top-left-wall');
                break;
            case 'z':
                square.classList.add('bottom-right-wall');
                break;
            case '%':
                square.classList.add('left-door');
                break;
            case '^':
                square.classList.add('top-door');
                break;
            case '$':
                square.classList.add('stairs');
                break;
            case '(':
                square.classList.add('firepot');
                break;
            case '*':
               createSlicer(x, y);
                break;
            case '}':
               createSkeletor(x, y);
                break;
            case 'g':
               createGabriela(x, y);
                break;
            case 's':
               createShooter(x, y);
                break;
            case 'i':
                square.classList.add('top-right-house');
                break;
            case 'h':
                square.classList.add('top-left-house');
                break;
            case 'k':
                square.classList.add('bottom-right-house');
                break;
            case 'j':
                square.classList.add('bottom-left-house');
                break;
            case 'U':
                square.classList.add('top-right-water');
                break;
            case 'O':
                square.classList.add('top-left-water');
                break;
            case 'P':
                square.classList.add('bottom-right-water');
                break;
            case 'I':
                square.classList.add('bottom-left-water');
                break;
            case 'L':
                square.classList.add('top-water');
                break;
            case 'M':
                square.classList.add('bottom-water');
                break;
             case 'N':
                square.classList.add('center-water');
                break;
            case 'J':
                square.classList.add('left-water');
                break;
            case 'K':
                square.classList.add('right-water');
                break;
            case 'L':
                square.classList.add('top-water');
                break;
            case 'M':
                square.classList.add('bottom-water');
                break;

        }
    }

    function createPlayer() {
        const playerElement= document.createElement('div');
        playerElement.classList.add('link-going-right');
        playerElement.id = 'player';

        playerElement.style.left = `${(PlayerPosition % width) * tilesize}px`;
        playerElement.style.top = `${Math.floor(PlayerPosition / width) * tilesize}px`;
        grid.appendChild(playerElement);
    }

    function createSlicer(x, y) {
        const slicerElement = document.createElement('div');
        slicerElement.classList.add('slicer');
        slicerElement.style.left = `${x * tilesize}px`;
        slicerElement.style.top = `${y * tilesize}px`;

        const slicer = {
            x, y,
            direction:-1,
            type: 'slicer',
            slicerElement
        };

        enemies.push(slicer);
        grid.appendChild(slicerElement);
    }

    function createSkeletor(x, y) {
        const skeletorElement = document.createElement('div');
        skeletorElement.classList.add('skeletor');
        skeletorElement.style.left = `${x * tilesize}px`;
        skeletorElement.style.top = `${y * tilesize}px`;

        const skeletor = {
            x, y,
            direction:1,
            timer:Math.random() * 5,
            type: 'skeletor',
            skeletorElement
        };

        enemies.push(skeletor);
        grid.appendChild(skeletorElement);
    }

    function createGabriela(x, y) {
        const gabrielaElement = document.createElement('div');
        gabrielaElement.classList.add('gabriela');
        gabrielaElement.style.left = `${x * tilesize}px`;
        gabrielaElement.style.top = `${y * tilesize}px`;

        const gabriela = {
            x, y,
            direction: 1,
            axis: 'y',
            timer: Math.random() * 5,
            type: 'gabriela',
            gabrielaElement
        };

        enemies.push(gabriela);
        grid.appendChild(gabrielaElement);
    }

    function createShooter(x, y) {
        const shooterElement = document.createElement('div');
        shooterElement.classList.add('shooter');
        shooterElement.style.left = `${x * tilesize}px`;
        shooterElement.style.top = `${y * tilesize}px`;

        const shooter = {
            x, y,
            type: 'shooter',
            shooterElement,
            shootTimer: 1 + Math.random() * 2
        };

        enemies.push(shooter);
        grid.appendChild(shooterElement);
    }

    function createProjectile(x, y, dx, dy) {
        const projectileElement = document.createElement('div');
        projectileElement.classList.add('projectile');
        projectileElement.style.left = `${x * tilesize}px`;
        projectileElement.style.top = `${y * tilesize}px`;
        grid.appendChild(projectileElement);

        projectiles.push({
            x,
            y,
            dx,
            dy,
            projectileElement,
            moveTimer: 0.08
        });
    }

    function moveShooter(shooter, deltaTime) {
        shooter.shootTimer -= deltaTime;
        if (shooter.shootTimer > 0) return;

        shooter.shootTimer = 1.5 + Math.random() * 1.5;
        const playerX = PlayerPosition % width;
        const playerY = Math.floor(PlayerPosition / width);

        if (playerX === shooter.x) {
            const dy = Math.sign(playerY - shooter.y);
            if (dy !== 0) {
                createProjectile(shooter.x, shooter.y, 0, dy);
            }
        } else if (playerY === shooter.y) {
            const dx = Math.sign(playerX - shooter.x);
            if (dx !== 0) {
                createProjectile(shooter.x, shooter.y, dx, 0);
            }
        }
    }

    function moveProjectiles(deltaTime) {
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const proj = projectiles[i];
            proj.moveTimer -= deltaTime;
            if (proj.moveTimer > 0) continue;

            proj.moveTimer = 0.08;
            const newX = proj.x + proj.dx;
            const newY = proj.y + proj.dy;

            if (newX < 0 || newX >= width || newY < 0 || newY >= 9 || isWall(newX, newY)) {
                if (proj.projectileElement.parentNode) {
                    proj.projectileElement.parentNode.removeChild(proj.projectileElement);
                }
                projectiles.splice(i, 1);
                continue;
            }

            proj.x = newX;
            proj.y = newY;
            proj.projectileElement.style.left = `${proj.x * tilesize}px`;
            proj.projectileElement.style.top = `${proj.y * tilesize}px`;

            const playerX = PlayerPosition % width;
            const playerY = Math.floor(PlayerPosition / width);
            if (proj.x === playerX && proj.y === playerY) {
                gameOver();
                return;
            }
        }
    }

    function movePlayer(direction) {
        const playerElement = document.getElementById('player');
        let newPosition = PlayerPosition;

        switch(direction) {
            case 'left':
                if (PlayerPosition % width > 0) newPosition=PlayerPosition - 1;
                playerElement.className = 'link-going-left';
                playerDirection = 'left';
                break;
            case 'right':
                if (PlayerPosition % width < width - 1) newPosition=PlayerPosition + 1;
                playerElement.className = 'link-going-right';
                playerDirection = 'right';
                break;
            case 'up':
                if (PlayerPosition - width >= 0) newPosition=PlayerPosition - width;
                playerElement.className = 'link-going-up';
                playerDirection = 'up';
                break;
            case 'down':
                if (PlayerPosition + width < width * 9) newPosition=PlayerPosition + width;
                playerElement.className = 'link-going-down';
                playerDirection = 'down';
                break;
        }

        if(canMoveTo(newPosition)) {
            const square = squares[newPosition];

                if(square.classList.contains('left-door')) {
                    square.classList.remove('left-door');
                }
                if(square.classList.contains('top-door') || square.classList.contains('stairs')) {
                    if (enemies.length === 0) {
                        nextLevel();
                    } else {
                        showEnemiesRemainingMessage();
                    }
                    return;
                } 
        

        PlayerPosition = newPosition;
        playerElement.style.left = `${(PlayerPosition % width) * tilesize}px`;
        playerElement.style.top = `${Math.floor(PlayerPosition / width) * tilesize}px`;
        }
    }

    function canMoveTo(position) {
        if (position < 0 || position >= squares.length) return false;

        const square = squares[position];

        return !square.classList.contains('left-wall') &&
                !square.classList.contains('right-wall') &&
                !square.classList.contains('top-wall') &&
                !square.classList.contains('bottom-wall')&&
                !square.classList.contains('top-right-wall') &&
                !square.classList.contains('bottom-left-wall') &&
                !square.classList.contains('top-left-wall') &&
                !square.classList.contains('bottom-right-wall')&&
                !square.classList.contains('lantern') &&
                !square.classList.contains('firepot') &&
                !square.classList.contains('top-right-house') &&
                !square.classList.contains('top-left-house') &&
                !square.classList.contains('bottom-right-house') &&
                !square.classList.contains('bottom-left-house');

    } 

    const kaboomSound = new Audio('Audio/slice-sound.mp3');

function spawnKaboom(x, y) {
   let kaboomX = PlayerPosition % width;
   let kaboomY = Math.floor(PlayerPosition / width);

   switch(playerDirection) {
    case 'left':
        kaboomX -= 1;
        break;
    case 'right':
        kaboomX += 1;
        break;
    case 'up':
        kaboomY -= 1;
        break;
    case 'down':
        kaboomY += 1;
        break;
   }

   const sound = kaboomSound.cloneNode();
            if (sound) {
                sound.currentTime = 0;
                sound.play();
            }

   if (kaboomX >= 0 && kaboomX < width && kaboomY >= 0 && kaboomY < 9) {
        const kaboomElement = document.createElement('div');
    kaboomElement.classList.add('kaboom');
    kaboomElement.style.left = `${kaboomX * tilesize}px`;
    kaboomElement.style.top = `${kaboomY * tilesize}px`;
    grid.appendChild(kaboomElement);

    checkKaboomEnemyCollision(kaboomX, kaboomY);

    setTimeout(() => {
        kaboomElement.parentNode.removeChild(kaboomElement);
    }, 1000);
   }
   
}
//Her laver jeg sound effects til enemies.

const deathSound = {
    slicer : new Audio('Audio/Eduardo-death.mp3'),
    skeletor : new Audio('Audio/Saad-death.mp3'),
    gabriela : new Audio('Audio/Gabriela-death.mp3')
};

function checkKaboomEnemyCollision(kaboomX, kaboomY) {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const enemyX = Math.round(enemy.x);
        const enemyY = Math.round(enemy.y);

        if (enemyX === kaboomX && enemyY === kaboomY) {
            const sound = deathSound[enemy.type];
            if (sound) {
                sound.currentTime = 0;
                sound.play();
            }
            const enemyElement = enemy.slicerElement || enemy.skeletorElement || enemy.gabrielaElement || enemy.shooterElement;
            if (enemyElement && enemyElement.parentNode) {
                enemyElement.parentNode.removeChild(enemyElement);
            }
            enemies.splice(i, 1);
            score++;
            updateDisplays();
            break;
        }
    }
}

function checkPlayerEnemyCollision() {
    const playerX = PlayerPosition % width;
    const playerY = Math.floor(PlayerPosition / width);

    for (const enemy of enemies) {
        const enemyX = Math.round(enemy.x);
        const enemyY = Math.round(enemy.y);

        if (playerX === enemyX && playerY === enemyY) {
            gameOver();
           return;
        }
    }

}

function moveEnemies(deltaTime) {
    for (const enemy of enemies) {
        if (enemy.type === 'slicer') {
            moveslicer(enemy, deltaTime);
        } else if (enemy.type === 'skeletor') {
            moveskeletor(enemy, deltaTime);
        } else if (enemy.type === 'gabriela') {
            moveGabriela(enemy, deltaTime);
        } else if (enemy.type === 'shooter') {
            moveShooter(enemy, deltaTime);
        }
    }
}


function moveslicer(slicer, deltaTime) {
    const speed = 2 * deltaTime;
    const newX = slicer.x + (slicer.direction * speed);
    const y = Math.round(slicer.y);

    if (newX < 0 || newX >= width || isWall(Math.round(newX), y)) {
        slicer.direction *= -1;
    } else {
        slicer.x = newX;
    }
    slicer.slicerElement.style.left = `${slicer.x * tilesize}px`;
}

function moveskeletor(skeletor, deltaTime) {
    const speed = 1.5*deltaTime;
    skeletor.timer -= deltaTime;
    if (skeletor.timer <= 0) {
        skeletor.direction *= -1;
        skeletor.timer = Math.random() * 5;
    }
    const newY = skeletor.y + (skeletor.direction * speed);
    const x = Math.round(skeletor.x);

    if (newY < 0 || newY >= 9 || isWall(x, Math.round(newY))) {
        skeletor.direction *= -1;
    } else {
        skeletor.y = newY;
    }
    skeletor.skeletorElement.style.top = `${skeletor.y * tilesize}px`;
}

function moveGabriela(gabriela, deltaTime) {
    const speed = 3 * deltaTime;
    gabriela.timer -= deltaTime;
    if (gabriela.timer <= 0) {
        gabriela.direction *= -1;
        gabriela.timer = Math.random() * 5;
    }

    const tryAxisMove = (axis) => {
        if (axis === 'y') {
            const newY = gabriela.y + (gabriela.direction * speed);
            const x = Math.round(gabriela.x);
            if (newY < 0 || newY >= 9 || isWall(x, Math.round(newY))) {
                return false;
            }
            gabriela.y = newY;
            gabriela.gabrielaElement.style.top = `${gabriela.y * tilesize}px`;
            return true;
        }

        const newX = gabriela.x + (gabriela.direction * speed);
        const y = Math.round(gabriela.y);
        if (newX < 0 || newX >= width || isWall(Math.round(newX), y)) {
            return false;
        }
        gabriela.x = newX;
        gabriela.gabrielaElement.style.left = `${gabriela.x * tilesize}px`;
        return true;
    };

    if (!tryAxisMove(gabriela.axis)) {
        gabriela.axis = gabriela.axis === 'y' ? 'x' : 'y';
        if (!tryAxisMove(gabriela.axis)) {
            gabriela.direction *= -1;
        }
    }
}



function isWall(x, y) {
    const position = y * width + x;
    if (position < 0 || position >= squares.length) return true;

    const square = squares[position];
    return square.classList.contains('left-wall') ||
            square.classList.contains('right-wall') ||
            square.classList.contains('top-wall') ||
            square.classList.contains('bottom-wall')||
            square.classList.contains('top-right-wall') ||
            square.classList.contains('bottom-left-wall') ||
            square.classList.contains('top-left-wall') ||
            square.classList.contains('bottom-right-wall')||
            square.classList.contains('lantern') ||
            square.classList.contains('firepot') ||
            square.classList.contains('top-right-house') ||
            square.classList.contains('top-left-house') ||
            square.classList.contains('bottom-right-house') ||
            square.classList.contains('bottom-left-house');

}

function updateDisplays() {
    scoreDisplay.innerHTML = score;
    levelDisplay.innerHTML = level + 1;
    enemyDisplay.innerHTML = enemies.length;
}

function nextLevel() {
    level=(level + 1) % maps.length;
    createBoard();
    const levelUpSound = new Audio('Audio/Level-up-sound.mp3');
    levelUpSound.volume = 0.3;
    levelUpSound.play();
}

function showEnemiesRemainingMessage() {
    grid.style.filter = 'hue-rotate(0deg) saturate(2) brightness(1.5)';
    grid.style.boxShadow = '0 0 20px red';
    setTimeout(() => {
        grid.style.filter = '';
        grid.style.boxShadow = '';
    }, 300);
    
    const EnemiesRemainingSound = new Audio('Audio/Dumb-Bitch-death.mp3');
    EnemiesRemainingSound.volume = 0.3;
    EnemiesRemainingSound.play();

    showTemporaryMessage('Defeat all enemies first!','red', 2000);
}

function showTemporaryMessage(message, color, duration) {
    const existingMessage = document.getElementById('temp-message');
    if (existingMessage) {
        grid.removeChild(existingMessage);
    }

    const messageElement = document.createElement('div');
    messageElement.id='temp-message';
    messageElement.textContent = message;
    messageElement.style.color = color;
    grid.appendChild(messageElement);

    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, duration);
}
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;

   if (BgMusic.paused) {
BgMusic.play();
}
        switch(e.key) {
            case 'a':
                e.preventDefault();
                movePlayer('left');
                break;
            case 'd':
                e.preventDefault();
                movePlayer('right');
                break;
            case 'w':
                e.preventDefault();
                movePlayer('up');
                break;
            case 's':
                e.preventDefault();
                movePlayer('down');
                break;
            case ' ':
                e.preventDefault();
                spawnKaboom();
                break;
                
        }
    });

    let lasttime = 0;
    let animationid;
    function gameLoop(currentTime) {
        const deltaTime = (currentTime - lasttime) / 1000;
        lasttime = currentTime;

        if (gameRunning && deltaTime < 0.1) {
            moveEnemies(deltaTime);
            moveProjectiles(deltaTime);
            checkPlayerEnemyCollision();
        }

       animationid = requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        gameRunning = false;
        showTemporaryMessage(`Game Over! Final Score: ${score}`, 'white', 3000);
       BgMusic.pause();
    }
         createBoard();
        animationid = requestAnimationFrame(gameLoop);
});