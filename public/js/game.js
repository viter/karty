var socket = io.connect('http://localhost:8080');
      socket.on('news', function (data) {
        console.log(data.mynews);
        socket.emit('my other event', { my: 'data' });
      });

var cards = [
        {name: "sixOfClubs", url: "/public/img/6_of_clubs.png"},
        {name: "sixOfDiamonds", url: "/public/img/6_of_diamonds.png"},
        {name: "sixOfHearts", url: "/public/img/6_of_hearts.png"},
        {name: "sixOfSpades", url: "/public/img/6_of_spades.png"},
        {name: "sevenOfClubs", url: "/public/img/7_of_clubs.png"},
        {name: "sevenOfDiamonds", url: "/public/img/7_of_diamonds.png"},
        {name: "sevenOfHearts", url: "/public/img/7_of_hearts.png"},
        {name: "sevenOfSpades", url: "/public/img/7_of_spades.png"},
        {name: "eightOfClubs", url: "/public/img/8_of_clubs.png"},
        {name: "eightOfDiamonds", url: "/public/img/8_of_diamonds.png"},
        {name: "eightOfHearts", url: "/public/img/8_of_hearts.png"},
        {name: "eightOfSpades", url: "/public/img/8_of_spades.png"},
        {name: "nineOfClubs", url: "/public/img/9_of_clubs.png"},
        {name: "nineOfDiamonds", url: "/public/img/9_of_diamonds.png"},
        {name: "nineOfHearts", url: "/public/img/9_of_hearts.png"},
        {name: "nineOfSpades", url: "/public/img/9_of_spades.png"},
        {name: "tenOfClubs", url: "/public/img/10_of_clubs.png"},
        {name: "tenOfDiamonds", url: "/public/img/10_of_diamonds.png"},
        {name: "tenOfHearts", url: "/public/img/10_of_hearts.png"},
        {name: "tenOfSpades", url: "/public/img/10_of_spades.png"},
        {name: "jackOfClubs", url: "/public/img/jack_of_clubs2.png"},
        {name: "jackOfDiamonds", url: "/public/img/jack_of_diamonds2.png"},
        {name: "jackOfHearts", url: "/public/img/jack_of_hearts2.png"},
        {name: "jackOfSpades", url: "/public/img/jack_of_spades2.png"},
        {name: "queenOfClubs", url: "/public/img/queen_of_clubs2.png"},
        {name: "queenOfDiamonds", url: "/public/img/queen_of_diamonds2.png"},
        {name: "queenOfHearts", url: "/public/img/queen_of_hearts2.png"},
        {name: "queenOfSpades", url: "/public/img/queen_of_spades2.png"},
        {name: "kingOfClubs", url: "/public/img/king_of_clubs2.png"},
        {name: "kingOfDiamonds", url: "/public/img/king_of_diamonds2.png"},
        {name: "kingOfHearts", url: "/public/img/king_of_hearts2.png"},
        {name: "kingOfSpades", url: "/public/img/king_of_spades2.png"},
        {name: "aceOfClubs", url: "/public/img/ace_of_clubs.png"},
        {name: "aceOfDiamonds", url: "/public/img/ace_of_diamonds.png"},
        {name: "aceOfHearts", url: "/public/img/ace_of_hearts.png"},
        {name: "aceOfSpades", url: "/public/img/ace_of_spades.png"},
      ];
var shuffleCards = shuffle(cards);
var playerCards = [];
var positionX = 50;
var cardWidth = 150;
var cardHeight = 218;
      
var renderer = new PIXI.autoDetectRenderer(800, 600, {antialias: false, transparent: true, resolution: 1});
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);
//renderer.backgroundColor = 0x209508;

document.body.appendChild(renderer.view);
var scale = scaleToWindow(renderer.view);
      
      
var stage = new PIXI.Container();
      
PIXI.loader
  .add([shuffleCards[0].url,shuffleCards[1].url,shuffleCards[2].url,shuffleCards[3].url,shuffleCards[4].url,shuffleCards[5].url])
  .load(setup);

function setup() {
  //var sixOfClubs = new PIXI.Sprite(
   //PIXI.loader.resources["/public/img/6_of_clubs.png"].texture
   //);
  //console.log(shuffleCards[0].url);
  for(var i = 0; i < 6; i++) {
    playerCards[i] = new PIXI.Sprite(PIXI.loader.resources[shuffleCards[i].url].texture);
    playerCards[i].width = cardWidth;
    playerCards[i].height = cardHeight;
    playerCards[i].x = positionX;
    playerCards[i].y = window.innerHeight - cardHeight - 50;
    playerCards[i].id = "c"+i;
    playerCards[i].interactive = true;
    playerCards[i].mouseover = function(mouse) {
      this.y -= 30;
    };
    playerCards[i].mouseout = function(mouse) {
      this.y += 30;
    };
    stage.addChild(playerCards[i]);
    positionX += 70; 
  }
        
  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  //state();
  renderer.render(stage);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}