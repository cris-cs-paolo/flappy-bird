const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let started = false;
let gameOver = false;
let score = 0;

const bg = new Image();
bg.src = "assets/flappy-bird-assets-master/sprites/background-day.png";

const pipe = new Image();
pipe.src = "assets/flappy-bird-assets-master/sprites/pipe-green.png";

const ground = new Image();
ground.src = "assets/flappy-bird-assets-master/sprites/base.png";

const message = new Image();
message.src = "assets/flappy-bird-assets-master/sprites/message.png";

const gameOverImg = new Image();
gameOverImg.src = "assets/flappy-bird-assets-master/sprites/gameover.png";

const birdUp = new Image();
birdUp.src = "assets/flappy-bird-assets-master/sprites/bluebird-upflap.png";

const birdMid = new Image();
birdMid.src = "assets/flappy-bird-assets-master/sprites/bluebird-midflap.png";

const birdDown = new Image();
birdDown.src = "assets/flappy-bird-assets-master/sprites/bluebird-downflap.png";

let bird = {
    x: 80,
    y: 250,
    speed: 0
};

let gravity = 0.18;
let jump = -4.5;

let pipes = [];

document.addEventListener("keydown", function(e){

    if(e.code === "Space"){

        if(!started){
            started = true;
        }
        else if(gameOver){
            resetGame();
        }
        else{
            bird.speed = jump;
        }
    }
});

function resetGame(){
    bird.y = 250;
    bird.speed = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    addPipe();
}

function addPipe(){

    let top = Math.random() * 170 + 110;

    pipes.push({
        x: 400,
        top: top,
        gap: 165,
        passed: false
    });
}

function update(){

    if(!started || gameOver) return;

    bird.speed += gravity;
    bird.y += bird.speed;

    if(bird.y < 0 || bird.y > 510){
        gameOver = true;
    }

    for(let i=0;i<pipes.length;i++){

        pipes[i].x -= 2;

        if(
            bird.x + 30 > pipes[i].x &&
            bird.x < pipes[i].x + 60 &&
            (bird.y < pipes[i].top || bird.y + 24 > pipes[i].top + pipes[i].gap)
        ){
            gameOver = true;
        }

        if(!pipes[i].passed && pipes[i].x < bird.x){
            pipes[i].passed = true;
            score++;
        }
    }

    if(pipes.length === 0 || pipes[pipes.length-1].x < 220){
        addPipe();
    }

    if(pipes[0] && pipes[0].x < -70){
        pipes.shift();
    }
}

function drawBird(){

    let frame = Math.floor(Date.now()/180)%3;

    if(frame===0){
        ctx.drawImage(birdUp,bird.x,bird.y,34,24);
    }
    else if(frame===1){
        ctx.drawImage(birdMid,bird.x,bird.y,34,24);
    }
    else{
        ctx.drawImage(birdDown,bird.x,bird.y,34,24);
    }
}

function drawPipes(){

    for(let i=0;i<pipes.length;i++){

        let p = pipes[i];

        ctx.save();
        ctx.translate(p.x+30,p.top);
        ctx.scale(1,-1);
        ctx.drawImage(pipe,-30,0,60,400);
        ctx.restore();

        ctx.drawImage(pipe,p.x,p.top+p.gap,60,400);
    }
}

function draw(){

    ctx.drawImage(bg,0,0,400,600);

    drawPipes();

    ctx.drawImage(ground,0,500,400,100);

    drawBird();

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(score,190,80);

    if(!started){
        ctx.drawImage(message,70,180,260,220);
    }

    if(gameOver){
        ctx.drawImage(gameOverImg,110,200,180,50);

        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText("Press SPACE",135,290);
    }
}

function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

addPipe();
loop();