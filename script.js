let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const Game = {};
let temp;
Game.player = new Image();
Game.player.src = "./spritesheet/CupHead.png";

const spriteSheetLoop = [
    {
        name:'up',
        row: 0,
        start: 4,
        length: 16
    },
    {
        name:'right-up',
        row: 1,
        start: 3,
        length: 15
    },
    {
        name:'up-right',
        row: 1,
        start: 3,
        length: 15
    },
    {
        name:'right',
        row: 3,
        start: 3,
        length: 14
    },
    {
        name:'right-down',
        row: 4,
        start: 4,
        length: 16
    },
    {
        name:'down-right',
        row: 4,
        start: 4,
        length: 16
    },
    {
        name:'down',
        row: 6,
        start: 0,
        length: 13
    },
];

const specialSpritesheet = [
    {
        name:'jump',
        row: 7,
        start: 1,
        length: 10
    }
]

class Character{
    constructor(){
        this.playerWidth = 103.0625;
        this.playerHeight = 113.125;
        this.animationSpeed = Math.round(Math.random()*4);
        // console.log(this.animationSpeed)
        this.skippedframe = 0;
        this.scale = 4;
        this.action = Math.floor(Math.random()*spriteSheetLoop.length);
        this.frameX = spriteSheetLoop[this.action].start;
        this.speed = getRndInteger(10, 25) - this.animationSpeed*Math.round(Math.random()*10)/10 + 0.1;
        this.frameY = 0;
        this.freeze = false;

        this.position =  {x:0, y:0};
        this.position = this.getPositionFromAction();
    }
    draw(){
        this.collisionPos = {
            x: this.position.x + this.playerWidth*this.scale/2.5,
            y: this.position.y + this.playerHeight*this.scale/2.5,
            width: this.playerWidth*this.scale/4,
            height: this.playerHeight*this.scale/4,
        }

        if(this.freeze){
            drawSprite(Game.player,
                this.frameX*this.playerWidth,
                specialSpritesheet[0].row*this.playerHeight,
                this.playerWidth,
                this.playerHeight,
                this.position.x,
                this.position.y,
                this.playerWidth*this.scale,
                this.playerHeight*this.scale,);
        }
        else drawSprite(Game.player,
            this.frameX*this.playerWidth,
            spriteSheetLoop[this.action].row*this.playerHeight,
            this.playerWidth,
            this.playerHeight,
            this.position.x,
            this.position.y,
            this.playerWidth*this.scale,
            this.playerHeight*this.scale,);

        // draw collision box
        drawRec(this.collisionPos.x, this.collisionPos.y, this.collisionPos.width, this.collisionPos.height);
        // drawRec(this.position.x, this.position.y, this.playerWidth*this.scale, this.playerHeight*this.scale);

        if(this.freeze) {
            if(this.frameX < specialSpritesheet[0].length - 1){
                this.frameX++;
            }else this.resetPosition();

            return;
        }

        if(this.frameX < spriteSheetLoop[this.action].length - 1){

            if(this.skippedframe < this.animationSpeed){
                this.skippedframe++;
            }else{
                this.skippedframe = 0;
                this.frameX++;
            }
        }else this.frameX = spriteSheetLoop[this.action].start;
    }

    resetPosition(){
        switch(spriteSheetLoop[this.action].name){
            case 'down':
                if( this.position.y > canvas.height + this.playerHeight  )
                    this.position = this.getPositionFromAction();
                break;
            case 'up':
                if( this.position.y < 0 - this.playerHeight*this.scale )
                    this.position = this.getPositionFromAction();
                break;
            case 'right':
                if( this.position.x > canvas.width + this.playerWidth)
                    this.position = this.getPositionFromAction();
                break;
            case 'right-up':
                if( this.position.x > canvas.width + this.playerWidth || this.position.y < 0 - this.playerHeight*this.scale)
                    this.position = this.getPositionFromAction();
                break;
            case 'up-right':
                if( this.position.x > canvas.width + this.playerWidth || this.position.y < 0 - this.playerHeight*this.scale)
                    this.position = this.getPositionFromAction();
                break;
            case 'right-down':
                if( this.position.x > canvas.width + this.playerWidth || this.position.y > canvas.height + this.playerHeight)
                    this.position = this.getPositionFromAction();
                break;
            case 'down-right':
                if( this.position.x > canvas.width + this.playerWidth || this.position.y > canvas.height + this.playerHeight)
                    this.position = this.getPositionFromAction();
                break;
            default:

        }

        if( this.freeze){
            this.animationSpeed = Math.round(Math.random()*4);
            this.skippedframe = 0;
            this.action = Math.floor(Math.random()*spriteSheetLoop.length);
            this.frameX = spriteSheetLoop[this.action].start;
            this.speed = getRndInteger(10, 25) - this.animationSpeed*Math.round(Math.random()*10)/10 + 0.1;
            this.freeze = false;

            this.position =  {x:0, y:0};
            this.position = this.getPositionFromAction();
        }
    }

    update(){
        if(this.freeze){
            return;
        }

        switch(spriteSheetLoop[this.action].name){
            case 'down':
                this.position.y+=  this.speed;
                break;
            case 'up':
                this.position.y-=  this.speed;
                break;
            case 'right':
                this.position.x+=  this.speed;
                break;
            case 'right-up':
                this.position.x+=  this.speed;
                this.position.y-=  this.speed;
                break;
            case 'up-right':
                this.position.x+=  this.speed;
                this.position.y-=  this.speed;
                break;
            case 'right-down':
                this.position.x+=  this.speed;
                this.position.y+=  this.speed;
                break;
            case 'down-right':
                this.position.x+=  this.speed;
                this.position.y+=  this.speed;
                break;
            default:

        }
        this.resetPosition();
    }

    getPositionFromAction(){
        let pos = {
            x: 0,
            y: 0
        }
        switch(spriteSheetLoop[this.action].name){
            case 'down':
                pos.x = Math.floor(Math.random() * canvas.width);
                pos.y = 0 - this.playerHeight*this.scale;
                break;
            case 'up':
                pos.x = Math.floor(Math.random() * canvas.width);
                pos.y = canvas.height + this.playerHeight*this.scale;
                break;
            case 'right':
                pos.x = 0 - this.playerWidth*this.scale;
                pos.y = Math.floor(Math.random() * canvas.height);
                break;
            case 'right-up':
                pos.x = 0 - this.playerWidth*this.scale;
                pos.y = Math.floor(Math.random() * canvas.height);
                break;
            case 'up-right':
                pos.x = Math.floor(Math.random() * canvas.width);
                pos.y = canvas.height + this.playerHeight;
                break;
            case 'right-down':
                pos.x = 0 - this.playerWidth*this.scale;
                pos.y = Math.floor(Math.random() * canvas.height);
                break;
            case 'down-right':
                pos.x = Math.floor(Math.random() * canvas.width);
                pos.y = 0 - this.playerHeight*this.scale;
                break;
            default:
                pos.x = 0;
                pos.y = 0;
        }
        // console.log("pos", pos)

        return pos;
    }
}

let char_arr = [];
let number = 20;

for(var j = 0; j < number; j++){
    char_arr.push(new Character())
}
// let player1 = new Character();

function drawSprite(img, sx, sy, sw, sh, dx, dy,dw,dh) {
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy,dw,dh);
}

function drawRec(x, y, w, h){
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = "6";
    // ctx.rect(dx + dw/4, dy + dh/4, dw/2, dh/2);
    ctx.rect(x, y, w, h);
    ctx.stroke();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var j in char_arr){
        char_arr[j].draw();
        char_arr[j].update();
    }
    collisionDetection();
    collisionDetectionOf2Object();
}

window.addEventListener("resize", function (){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.onload = function(){
    setInterval(animate, 1000/30);
    // window.requestAnimationFrame(animate);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function collisionDetectionOf2Object() {
    for(var i = 0; i < char_arr.length-1; i++){
        for(var j = i+1; j < char_arr.length; j++){
            if(char_arr[i].position.x + char_arr[i].playerWidth*char_arr[i].scale >= char_arr[j].position.x
                && char_arr[i].position.x <= char_arr[j].position.x + char_arr[j].playerWidth*char_arr[j].scale
                && char_arr[i].position.y + char_arr[i].playerHeight*char_arr[i].scale >= char_arr[j].position.y
                && char_arr[i].position.y <= char_arr[j].position.y + char_arr[j].playerHeight*char_arr[j].scale
                && char_arr[i].position.y > char_arr[j].position.y
                && i < j){
                // console.log("detected")
                temp = char_arr[i];
                char_arr[i] = char_arr[j];
                char_arr[j] = temp;
            }
        }
    }
}


function collisionDetection() {
    for(var i = 0; i < char_arr.length-1; i++){
        for(var j = i+1; j < char_arr.length; j++){
            if(char_arr[i].collisionPos.x + char_arr[i].collisionPos.width >= char_arr[j].collisionPos.x
            && char_arr[i].collisionPos.x <= char_arr[j].collisionPos.x + char_arr[j].collisionPos.width
            && char_arr[i].collisionPos.y + char_arr[i].collisionPos.height >= char_arr[j].collisionPos.y
            && char_arr[i].collisionPos.y <= char_arr[j].collisionPos.y + char_arr[j].collisionPos.height
            && (!char_arr[i].freeze || !char_arr[j].freeze)){
                // console.log("detected");
                char_arr[i].freeze = true;
                char_arr[i].frameX = specialSpritesheet[0].start;
                char_arr[j].freeze = true;
                char_arr[j].frameX = specialSpritesheet[0].start;
            }
        }
    }
}