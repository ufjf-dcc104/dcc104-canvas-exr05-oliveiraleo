//Texto do placar
function Text(font, size, rgb) {
	this.font = font 	|| "Courier";
	this.size = size 	|| 20;
	this.color = rgb 	|| "#000000" ;

	this.raster = function(ctx, text, x, y) {
		ctx.font = "" + this.size + "px " + this.font;
		ctx.fillStyle = this.color;
		ctx.fillText(text, x, y);// escreve na tela
	}
}
//variaveis globais
var pause = false;
var inicio = false;

var texto = new Text();
var texto2 = new Text("Courier", 20, "blue");

var ganhador = 0;

//sons
var musica = new Audio("sound/war.m4a");

var boom = new Audio();
boom.src = "sound/boom.mp3";

var explode = function(){
	boom.load();
	boom.play();
}

var tiro1 = new Audio();
tiro1.src = "sound/tiro.mp3";
var tiro2 = new Audio();
tiro2.src = "sound/tiro_forte.mp3";

var atira1 = function(){
	tiro1.load();
	tiro1.volume = 1.0;
	tiro1.play();
}

var atira2 = function(){
	tiro2.volume = 0.2;
	tiro2.load();
	tiro2.play();
}
//colisao do shooter com as barreiras
var colideBarreira = function(shooter, parede){
		if(shooter.center.x+(shooter.size.w/2) >= parede.pos.x &&
			shooter.center.x-(shooter.size.w/2) <= parede.pos.x+parede.size.w &&
			shooter.center.y+(shooter.size.h/2) >= parede.pos.y &&
			shooter.center.y-(shooter.size.h/2) <= parede.pos.y+parede.size.h){
		shooter.life--;
		shooter.reposiciona();
		explode();
	}
}
//colisao do tiro com as barreiras
var colideTiroParede = function(tiro, parede){
	if(tiro.pos.x+(tiro.radius/2) >= parede.pos.x &&
		tiro.pos.x-(tiro.radius/2) <= parede.pos.x+parede.size.w &&
		tiro.pos.y+(tiro.radius/2) >= parede.pos.y &&
		tiro.pos.y-(tiro.radius/2) <= parede.pos.y+parede.size.h){
			return true;
		}
	return false;
}
//colisao entre naves
var colideNave = function(s1, s2){
	if(s1.center.x+(s1.size.w/2) >= s2.center.x-(s2.size.w/2) &&
		s1.center.x-(s1.size.w/2) <= s2.center.x+(s2.size.w/2) &&
		s1.center.y+(s1.size.h/2) >= s2.center.y-(s2.size.h/2) &&
		s1.center.y-(s1.size.h/2) <= s2.center.y+(s2.size.h/2)){
			s1.reposiciona();
			s1.life--;
			s2.reposiciona();
			s2.life--;
		}
}

var colideTiros = function(nave, tiro){
	if(nave.center.x+(nave.size.w/2) >= tiro.pos.x &&
		nave.center.x-(nave.size.w/2) <= tiro.pos.x &&
		nave.center.y+(nave.size.h/2) >= tiro.pos.y &&
		nave.center.y-(nave.size.h/2) <= tiro.pos.y){
			nave.life--;
			return true;
		}
	return false;
}
//Regra do jogo
function start() {
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");// cria o contexto
	// define as constantes
	const WIDTH = canvas.offsetWidth;
	const HEIGHT = canvas.offsetHeight;

	const FPS = 60;
	const DT = 1/FPS;
	const G = -20;

	const PTSMAX = 2; // pontuacao que encerra o jogo
	//variaveis globais
	var shots = [];
	var shoot = false;
	var shots2 = [];
	var shoot2 = false;

	var shooter1 = new Shooter({x: 0, y: 0}, {w: 25, h: 25}, "black", 0);
  var shooter2 = new Shooter({x: 0, y: 0}, {w: 25, h: 25}, "blue", 2*Math.PI);
	//var ball = new Shot(shooter1.ballPos.x, (shooter1.ballPos.y), 0, 0, 12, 0);
  var ball2 = new Shot(shooter2.ballPos.x, shooter2.ballPos.y, 0, -325, 12, 1);
	//Instancia os obstaculos
	var parede1 = new Barreira({x: WIDTH/6, y: HEIGHT/5}, {w: 50, h: 50});
	var parede2 = new Barreira({x: WIDTH-(WIDTH/3), y: HEIGHT/5}, {w: 50, h: 50});
	var parede3 = new Barreira({x: WIDTH/6, y: HEIGHT-(HEIGHT/3)}, {w: 50, h: 50});
	var parede4 = new Barreira({x: WIDTH-(WIDTH/3), y: HEIGHT-(HEIGHT/3)}, {w: 50, h: 50});
	var parede5 = new Barreira({x: (WIDTH/2)-80, y: (HEIGHT/2)-30}, {w: 250, h: 50});

	var verificaPontos1 = false;
	var verificaPontos2 = false;

	var recomeca = true;
	var verificaInicio = false;

	var msgInicio = new Text("Courier", 30, "black");
	var msg = new Text("Courier", 25, "black");

	//reset do jogo
	function reset() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);// limpa a tela do jogo
		// limpa os tiros da tela
		shots.length = 0;
		shots2.length = 0;
		if(!recomeca){
			if (verificaInicio) {
				if (ganhador == 1){
					msg.raster(ctx, "Player 1 ganhou!", WIDTH/8, HEIGHT/4);
				}if (ganhador == 2){
					msg.raster(ctx, "Player 2 ganhou!", WIDTH/8, HEIGHT-HEIGHT/3);
				}if (shooter1.pontos < PTSMAX && shooter2.pontos < PTSMAX){
					msg.raster(ctx, "Apertem R para continuar", WIDTH/6, HEIGHT/2 );
				}else {
					msg.raster(ctx, "Fim de jogo", WIDTH/3, HEIGHT/2 );
				}
			}
		}
		verificaInicio = true;

		shooter1.reset();//volta as propriedades do shooter ao padrao do inicio
    shooter2.reset();//volta as propriedades do shooter ao padrao do inicio
		ganhador = 0;//reseta o ganhador
	}; reset();
	//regra do jogo
	var loop = function() {
		if(inicio && !pause && recomeca){
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		//texto da tela do jogo
		texto.raster(ctx, "Player 1", 17, 20);
		texto.raster(ctx, "Pontos: " + shooter1.pontos, 10, 40);
		texto.raster(ctx, "Energia:" + shooter1.life, 10, 60);

		texto2.raster(ctx, "Player 2", WIDTH-103, 20);
		texto2.raster(ctx, "Pontos: " + shooter2.pontos, WIDTH-110, 40);
		texto2.raster(ctx, "Energia:" + shooter2.life, WIDTH-110, 60);
		//popula o vetor de paredes
		var paredes = [];
		paredes.push(parede1);
		paredes.push(parede2);
		paredes.push(parede3);
		paredes.push(parede4);
		paredes.push(parede5);

		var cont, cont2;//contadores para o for
		//tiros player 1
		for(cont = 0; cont < shots.length; cont++) {
			shots[cont].move(DT);
			//Apaga os tiros que bateram em algo
			if(shots[cont].pos.y < 0 ||
				shots[cont].pos.x < 0 ||
				shots[cont].pos.x > WIDTH ||
				shots[cont].pos.y > HEIGHT ||
				colideTiroParede(shots[cont], paredes[0]) ||
				colideTiroParede(shots[cont], paredes[1]) ||
				colideTiroParede(shots[cont], paredes[2]) ||
				colideTiroParede(shots[cont], paredes[3]) ||
				colideTiroParede(shots[cont], paredes[4]) ||
				colideTiros(shooter1, shots[cont]) ||
				colideTiros(shooter2, shots[cont])) {// impõe limites no mapa
				shots.splice(cont, 1);// remove o tiro do vetor
				verificaPontos1 = false;// liga novamente o contador
			}
		}
		//tiros player 2
		for(cont2 = 0; cont2 < shots2.length; cont2++) {
			shots2[cont2].move(DT);
			//Apaga os tiros que saem da tela
			if(shots2[cont2].pos.y < 0 ||
				shots2[cont2].pos.x < 0 ||
				shots2[cont2].pos.x > WIDTH ||
				shots2[cont2].pos.y > HEIGHT ||
				colideTiroParede(shots2[cont2], paredes[0]) ||
				colideTiroParede(shots2[cont2], paredes[1]) ||
				colideTiroParede(shots2[cont2], paredes[2]) ||
				colideTiroParede(shots2[cont2], paredes[3]) ||
				colideTiroParede(shots2[cont2], paredes[4])) {
				shots2.splice(cont2, 1);// remove o tiro do vetor
				verificaPontos2 = false;// liga novamente o contador
			}
		}
		//Movimenta as naves
		shooter1.move(DT);
		shooter2.move(DT);
		//desenha os tiros na tela
		shots.forEach( function(shot) { shot.draw(ctx); } );
		shots2.forEach( function(shot2) { shot2.draw(ctx); } );
		//desenha as naves na tela
		shooter1.draw(ctx);
		shooter2.draw(ctx);
		//desenha os obstaculos
		for(cont = 0; cont < paredes.length; cont++){
			paredes[cont].draw(ctx);
		}
		//verifica a colisao das naves com os obstaculos
		for(cont = 0; cont < paredes.length; cont++){
			colideBarreira(shooter1, paredes[cont]);
		}
		for(cont2 = 0; cont2 < paredes.length; cont2++){
			colideBarreira(shooter2, paredes[cont2]);
		}
		//verifica a colisao entre as naves
		colideNave(shooter1, shooter2);
		//toca a musica de fundo em loop
		musica.volume = 1.0;
		musica.play();
		musica.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		});
		//determina o fim do jogo
		if (shooter1.pontos >= PTSMAX || shooter2.life == 0) {
			ganhador = 1;
			shooter1.pontos++;
			recomeca = false;
			reset();
		}if (shooter2.pontos >= PTSMAX || shooter1.life == 0) {
			ganhador = 2;
			shooter2.pontos++;
			recomeca = false;
			reset();
		}
	}else if(!inicio){// exibe a mensagem da tela inicial
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		msgInicio.raster(ctx, "Apertem ENTER para começar", 25, HEIGHT/2 );
	}else if(pause){// exibe a mensagem de jogo pausado
		musica.pause();
		msg.raster(ctx, "Apertem P para continuar", (WIDTH/6), HEIGHT/2-parede5.size.h );
	}
}

	setInterval(loop, 1000/FPS);
	//controles do jogo
	addEventListener("keydown", function(e){
		if(e.keyCode == 32 && !shoot) { // Espaco, tiro player 1
			var ball = new Shot(shooter1.ballPos.x, (shooter1.ballPos.y), 0, 0, 12, 0, shooter1.angle);
			if (shooter1.angle == 90 || shooter1.angle == -270) {
				ball.pos = {x: shooter1.center.x, y: (shooter1.center.y)-shooter1.size.h/2};
			}if (shooter1.angle == -90 || shooter1.angle == 270) {
				ball.pos = {x: shooter1.center.x, y: (shooter1.center.y)+shooter1.size.h/2};
			}if (shooter1.angle == 180 || shooter1.angle == -180) {
				ball.pos = {x: shooter1.center.x+shooter1.size.w/2, y: shooter1.center.y};
			}if (shooter1.angle == 0) {
				ball.pos = {x: shooter1.center.x-shooter1.size.w/2, y: shooter1.center.y};
			}
			shots.push(ball); // adiciona a bala no vetor de tiros
			ball = null; // apaga a bala auxiliar
			shoot = true;// bloqueia a repeticao do tiro
			atira1();
			e.preventDefault();
		}if(e.keyCode == 37){ // esquerda player 1
			shooter1.angle -= 90;
			e.preventDefault();
		}if(e.keyCode == 39){ // direita player 1
			shooter1.angle += 90;
			e.preventDefault();
		}if (e.keyCode == 38) { // cima player 1
			shooter1.am = -100;
			e.preventDefault();
    }if (e.keyCode == 40) { // baixo player 1
			shooter1.am = 100;
			e.preventDefault();
    }if(e.keyCode == 13){// Enter
			inicio = true;
			e.preventDefault();
		}if(e.keyCode == 80){// P
				pause = !pause;
		}if (e.keyCode == 82) {// R
				recomeca = true;
		}if (e.keyCode == 87) {// W
			shooter2.am = -100;
			e.preventDefault();
		}if (e.keyCode == 83) {// S
			shooter2.am = 100;
			e.preventDefault();
		}if (e.keyCode == 65) {// A
			shooter2.angle -= 90;
			e.preventDefault();
		}if (e.keyCode == 68) {// D
			shooter2.angle += 90;
			e.preventDefault();
		}if (e.keyCode == 16){// Shift Esq
			var ball2 = new Shot(shooter2.ballPos.x, (shooter2.ballPos.y), 0, 0, 12, 2*Math.PI, shooter2.angle);
			if (shooter2.angle == 90 || shooter2.angle == -270) {
				ball2.pos = {x: shooter2.center.x, y: (shooter2.center.y)-shooter2.size.h/2};
			}if (shooter2.angle == -90 || shooter2.angle == 270) {
				ball2.pos = {x: shooter2.center.x, y: (shooter2.center.y)+shooter2.size.h/2};
			}if (shooter2.angle == 180 || shooter2.angle == -180) {
				ball2.pos = {x: shooter2.center.x+shooter2.size.w/2, y: shooter2.center.y};
			}if (shooter2.angle == 0) {
				ball2.pos = {x: shooter2.center.x-shooter2.size.w/2, y: shooter2.center.y};
			}
			shots2.push(ball2); // adiciona a bala no vetor de tiros
			ball2 = null; // apaga a bala auxiliar
			shoot2 = true;// bloqueia a repeticao do tiro
			atira2();
			e.preventDefault();
		}
	});

	addEventListener("keyup", function(e){
		if(e.keyCode == 32) { // Espaco player 1
			shoot = false;
		}if(e.keyCode == 37 || e.keyCode == 39){ //esquerda e direita player 1
			shooter1.vang = 0;
		}if (e.keyCode == 38 || e.keyCode == 40) { //cima e baixo player 1
			shooter1.am = 0;
    }if (e.keyCode == 87 || e.keyCode == 83) {// W e S
			shooter2.am = 0;
		}if (e.keyCode == 65 || e.keyCode == 68) {// A e D
			shooter2.vang = 0;
		}if (e.keyCode == 16) {// Shift Esq
			shoot2 = false;
		}
	});
}
