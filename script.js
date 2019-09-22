var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var drawLife = document.querySelector('.life');
var drawScore = document.querySelector('.score');

var progressLife= document.querySelector('.progLife');
var progressScore= document.querySelector('.progScore');

var asteroid = new Image();
asteroid.src = 'img/asteroid.png';

var shiping = new Image();
shiping.src = 'img/shuttle.png';

explimg   = new Image();
explimg.src = 'img/expl222.png';

var fireimg = new Image();
fireimg.src = 'img/fire.png';

var game_over = new Image();
game_over.src = 'img/gameover.png';

var background = new Image();
background.src = 'img/space.png';

var music = new Audio();
var sfx = new Audio();
var gameOverMusic= new Audio();

var soundTrack = 'sound/muzic.mp3';
var killAster= 'sound/aster_babah.mp3';

gameOverMusic.src = 'sound/game_over.mp3';

var i;
var aster = [];
var fire = [];
var expl = [];
var timer = 0;
var score = 0;
var crash = 3;
var ship = {x:300,y:300};
var opacity =0;
var tempOpacity=0;
var result;

var userNameInput = document.getElementById('user');
var userName = "Anonimos";

var btnPlay = document.getElementById('btn_play');
btnPlay.addEventListener('click',function(){
  userNameInput.style.display = 'none';
  if(userNameInput.value.length > 2 ){
    userName = userNameInput.value;
  }
  else{
    userName = 'Anonimos';
  }
  crash= 3;
  btnPlay.style.display = 'none';
  canvas.style.cursor = 'none';
  ctx.clearRect(game_over, 150, 150, 300, 300); 
  game();
  music.src = soundTrack;
  music.loop= true;
  music.play();
});  

// motion ship________________________________________

canvas.addEventListener("mousemove", function(event){
   ship.x=event.offsetX-25;
   ship.y=event.offsetY-13;
 });

//Loop function game__________________________________
function game(){
  if(crash > 0){ 
    drawLife.style.display = 'block';  
    drawScore.style.display = 'block';  
    update();
    draw();   
    requestAnimationFrame(game);
  }
  else{
   gameOver();
  }
}

//GAME OVER________________________________
function gameOver(){  
   userName.score = score;
    drawLife.style.display = 'none';
    drawScore.style.display = 'none';     
  if(opacity<=1){
    setInterval(function(){
    tempOpacity++;      
    opacity= tempOpacity/100;
    ctx.globalAlpha = opacity;
    ctx.drawImage(game_over, 150, 150, 300, 300);
    },20);
  }
  canvas.style.cursor = 'url(img/cursor.cur), auto';
  setTimeout(function(){
      // ctx.fillStyle = "#00F";
      // ctx.strokeStyle = "#000";
      ctx.font = "italic 30pt Arial";
      result = result + crash*20;
      ctx.fillText(userName.toUpperCase() + " ВАШ СЧЕТ " + result, 60, 500);
     },2000);

  setTimeout(function(){
    btnPlay.style.display = 'block';
  },4000);

  ship = {x:300,y:300};
  aster = [];
  fire = [];
  result= score;
  score = 0;
  music.pause();
  gameOverMusic.play();
}

//Update parametr____________________________________________
function update() {
  progressScore.style.width =  score / 10 + "%";  
  progressLife.style.width = 33.3 * crash + "%";  
  timer++;
  //ASTEROID________________________________
  if(timer%20==0){
    aster.push({
    angle:0,
    dxangle:Math.random()*0.2-0.1,
    del:0,    
    x:Math.random()*550,
    y:-50,
    dx:Math.random()*2-1,
    dy:Math.random()*2+1
    });
  }

  // FIRE____________________________________
  if(timer%50 == 0){
    fire.push({x:ship.x+10,y:ship.y,dx:0,dy:-5.2});
    fire.push({x:ship.x+10,y:ship.y,dx:0.5,dy:-5});
    fire.push({x:ship.x+10,y:ship.y,dx:-0.5,dy:-5});
  }

  //FISICS____________________________________________
 
  for (i in aster) {
      aster[i].x=aster[i].x+aster[i].dx;
      aster[i].y=aster[i].y+aster[i].dy;
      aster[i].angle=aster[i].angle+aster[i].dxangle;

      //граничные условия (коллайдер со стенками

      if (aster[i].x<=0 || aster[i].x>=550) aster[i].dx=-aster[i].dx;
      if (aster[i].y>=650) {aster.splice(i,1); gameOver();}

    //проверяем на столкновение коробля и астероида__________________________________

      if (Math.abs(aster[i].x+25-ship.x-35)<70 && Math.abs(aster[i].y-ship.y)<35){
          aster[i].del=1;
          expl.push({x:aster[i].x-25,y:aster[i].y-25,animx:0,animy:0});
          crash--;
      }

      //проверим каждый астероид на столкновение с каждой пулей
      for (j in fire) {

      if (Math.abs(aster[i].x+25-fire[j].x-15)<50 && Math.abs(aster[i].y-fire[j].y)<25) {
            //произошло столкновение

          //спавн взрыва

          expl.push({x:aster[i].x-25,y:aster[i].y-25,animx:0,animy:0});



          //помечаем астероид на удаление

          aster[i].del=1;
          fire.splice(j,1);break;
        }
      }

      //удаляем астероиды

      if (aster[i].del==1){
        aster.splice(i,1);
        sfx.src = killAster;
        sfx.volume = 0.2;
        sfx.play();
        score++;
      } 
    }

    //двигаем пули

    for (i in fire) {
      fire[i].x=fire[i].x+fire[i].dx;
      fire[i].y=fire[i].y+fire[i].dy;

      if (fire[i].y<-30) fire.splice(i,1);
    }

    //Анимация взрывов

    for (i in expl) {
      expl[i].animx=expl[i].animx+0.5;
      if (expl[i].animx>7) {expl[i].animy++; expl[i].animx=0}
      if (expl[i].animy>7)
      expl.splice(i,1);
    }
}

//Draw Image on Screen________________________________________________________

function draw(){
  ctx.drawImage(background, 0, 0, 600, 600);
  ctx.drawImage(shiping,ship.x,ship.y,70,70);
  for (var i in fire) ctx.drawImage(fireimg, fire[i].x, fire[i].y, 30, 30);
 
  for (i in aster) {
    ctx.save();
    ctx.translate(aster[i].x+25, aster[i].y+25);
    ctx.rotate(aster[i].angle);
    ctx.drawImage(asteroid, -25, -25, 50, 50);   
    ctx.restore();
  }  
    for (i in expl)
  ctx.drawImage(explimg, 128*Math.floor(expl[i].animx),128*Math.floor(expl[i].animy),128,128, expl[i].x, expl[i].y, 100, 100);
  // ctx.fillStyle = "red";
  // ctx.font = "italic 30pt Arial";
  // ctx.fillText("SCORE " + score, 20, 50);
  // ctx.fillText("Life " + crash, 450, 50);
}
