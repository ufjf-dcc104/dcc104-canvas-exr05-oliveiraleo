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
var texto2 = new Text("Courier", 20, "red");

var ganhador = 0;
//Regra do jogo
function start() {
	//alert("A diversão vai começar!");
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");// cria o contexto
	//texto do jogo na tela
	//var destruidos = new Text();
	//var textoTiros = new Text();
	//var canhaoVidas = new Text();
	//var textoRatio = new Text();
	//var textoBuilds = new Text();

	const WIDTH = canvas.offsetWidth;
	const HEIGHT = canvas.offsetHeight;
	//const street = { pos: {x: 0, y: HEIGHT-20},
	//			     size: {w: WIDTH, h: 20} };

	const FPS = 60;
	const DT = 1/FPS;
	const G = -20;

	const PTSMAX = 2; // pontuacao que encerra o jogo
	//variaveis globais
	var shots = []; var shoot = false;
	var shots2 = []; var shoot2 = false;

	var shooter1 = new Shooter({x: WIDTH/2, y: HEIGHT/6}, {w: 20, h: 35}, "black", Math.PI);
  var shooter2 = new Shooter({x: WIDTH/2, y: HEIGHT-(HEIGHT/6)}, {w: 20, h: 35}, "yellow", 2*Math.PI);
	var ball = new Shot(shooter1.ballPos.x, (shooter1.ballPos.y-shooter1.h), 0, 325, 12, 0);
  var ball2 = new Shot(shooter2.ballPos.x, shooter2.ballPos.y, 0, -325, 12, 1);

	//var ball = new Shot(shooter1.ballPos.x, shooter1.ballPos.y, {(50, 50)}, {(50, 50)}, 1);
	//var ball2 = new Shot(shooter1.ballPos.x, shooter1.ballPos.y, {(50, 50)}, {(50, 50)}, 0);

	//var nave = new Sprite();

	//var lvl = 0;
  //var pontos1 = 0;
	//var pontos2 = 0;
	var verificaPontos1 = false;
	var verificaPontos2 = false;
	//var gen = new CollectionGenerator(WIDTH, HEIGHT);
	//var builds = [];
	//var asteroids = [];
	//var tiros = 0;
	//var ratio = 0;
	var recomeca = true;
	var verificaInicio = false;
	//var predios = 0;
	//sons
	//var explosao = new Audio('sound/boom.mp3');
	//var musica = new Audio('sound/theme.mp3');
	//var fim = new Audio('sound/gameover.mp3');
	//reset do jogo
	function reset() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		if(!recomeca){
			var msg = new Text("Courier", 25, "black");
			if (verificaInicio) {
				if (ganhador == 1){
					msg.raster(ctx, "Player 1 ganhou!", WIDTH/8, HEIGHT/4);
				}if (ganhador == 2){
					msg.raster(ctx, "Player 2 ganhou!", WIDTH/8, HEIGHT-HEIGHT/3);
				}
				msg.raster(ctx, "Apertem R para continuar", WIDTH/6, HEIGHT/2 );
			}
		}
		verificaInicio = true;
		//reposiciona as naves
		shooter1.center = {x: WIDTH/2, y: HEIGHT/6};
		shooter2.center = {x: WIDTH/2, y: HEIGHT-(HEIGHT/6)};


		//musica.currentTime = 0; //recomeca a musica de fundo
		//lvl = 1;
		//pontos = 0;
		//builds = gen.build(11);//gera predios
		//builds.splice(5, 1); // remove o que esta na frente do shooter1
		//asteroids = gen.asteroid(lvl); //reseta o gen de asteroide
		shooter1.reset();//volta as propriedades do shooter ao padrao do inicio
    shooter2.reset();//volta as propriedades do shooter ao padrao do inicio
		//tiros = 0;
		//ratio = 0;
		//shoot.length = 0;
		ganhador = 0;
		//ctx.clearRect(0, 0, WIDTH, HEIGHT);
	}; reset();
	//regra do jogo
	var loop = function() {
		//ctx.clearRect(0, 0, WIDTH, HEIGHT);
		if(inicio && !pause && recomeca){
		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		//texto da tela do jogo
		texto.raster(ctx, "Player 1", 17, 20);
		texto.raster(ctx, "Pontos: " + shooter1.pontos, 10, 40);
		texto.raster(ctx, "Vidas:" + shooter1.life, 10, 60);

		texto2.raster(ctx, "Player 2", WIDTH-105, 20);
		texto2.raster(ctx, "Pontos: " + shooter2.pontos, WIDTH-110, 40);
		texto2.raster(ctx, "Vidas:" + shooter2.life, WIDTH-100, 60);


		//console.log(shooter2.center);
		//if (recomeca) {
			//ctx.clearRect(0, 0, WIDTH, HEIGHT);
		//}

		for(var i = 0; i < shots.length; i++){
			if(((shots[i].pos.x >= shooter2.center.x-shooter2.size.w) && (shots[i].pos.x <= shooter2.center.x+shooter2.size.w)) &&
			((shots[i].pos.y >= shooter2.center.y-shooter2.size.h) && (shots[i].pos.y <= shooter2.center.y+shooter2.size.h)) &&
			!verificaPontos1){
				verificaPontos1 = true;
				if(verificaPontos1){
					shooter2.life--;
				}
			}
		}
		if (shooter2.life <= 0) {
			shooter1.pontos++;
			shooter2.reset();
		}
		//console.log(shooter2.life);
		for(var i = 0; i < shots2.length; i++){
			if(((shots2[i].pos.x >= shooter1.center.x-shooter1.size.w) && (shots2[i].pos.x <= shooter1.center.x+shooter1.size.w)) &&
			((shots2[i].pos.y >= shooter1.center.y-shooter1.size.h) && (shots2[i].pos.y <= shooter1.center.y+shooter1.size.h)) &&
			!verificaPontos2){
				verificaPontos2 = true;
				if(verificaPontos2){
					shooter1.life--;
				}
			}
		}
		if (shooter1.life <= 0) {
			shooter2.pontos++;
			shooter1.reset();
		}

		/*if(shooter2.tomouTiro()){
			pontos1++;
		}*/
		//musica jogo fundo
		/*musica.play();
		musica.volume = 0.3;
		musica.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
    });*/
		//reseta o jogo, predios destruidos
		/*if(builds.length == 0) {
			fim.play();
			reset();
			recomeca = false;
		}*/
		//calcula a Precisão
		//ratio = Math.round((3*pontos/tiros)*100);
		/*for(var i = 0; i < asteroids.length; i++) {
			var ast = asteroids[i]; ast.move(DT, G);
			if(ast.center.y > HEIGHT + ast.radius || ast.center.x < -ast.radius || ast.center.x > WIDTH + ast.radius)
				asteroids.splice(i, 1);
		}*/
		//contadores para o for do tiro
		var cont, cont2;
		//tiros player 1
		for(cont = 0; cont < shots.length; cont++) {
			shots[cont].move(DT, G);
			//Apaga os tiros que saem da tela
			if(shots[cont].pos.y < 0 || shots[cont].pos.x < 0 || shots[cont].pos.x > WIDTH || shots[cont].pos.y > HEIGHT){// impõe limites
				shots.splice(cont, 1);// remove o tiro do vetor
				verificaPontos1 = false;// liga novamente o contador
			}
		}
		//tiros player 2
		for(cont2 = 0; cont2 < shots2.length; cont2++) {
			shots2[cont2].move(DT, G);
			//Apaga os tiros que saem da tela
			if(shots2[cont2].pos.y < 0 || shots2[cont2].pos.x < 0 || shots2[cont2].pos.x > WIDTH || shots2[cont2].pos.y > HEIGHT){// impõe limites
				shots2.splice(cont2, 1);// remove o tiro do vetor
				verificaPontos2 = false;// liga novamente o contador
			}
		}
		//Movimenta as naves
		shooter1.move(DT, G);
    shooter2.move(DT, G);
		//limite das naves na tela
		//player 1
		if (shooter1.center.x < shooter1.size.w) {
			shooter1.center.x = shooter1.size.w;
		}if (shooter1.center.x > WIDTH-shooter1.size.w) {
			shooter1.center.x = WIDTH-shooter1.size.w;
		}if (shooter1.center.y < shooter1.size.h) {
			shooter1.center.y = shooter1.size.h;
		}if (shooter1.center.y > HEIGHT-shooter1.size.h) {
			shooter1.center.y = HEIGHT-shooter1.size.h;
		}
		//player 2
		if (shooter2.center.x < shooter2.size.w) {
			shooter2.center.x = shooter2.size.w;
		}if (shooter2.center.x > WIDTH-shooter2.size.w) {
			shooter2.center.x = WIDTH-shooter2.size.w;
		}if (shooter2.center.y < shooter2.size.h) {
			shooter2.center.y = shooter2.size.h;
		}if (shooter2.center.y > HEIGHT-shooter2.size.h) {
			shooter2.center.y = HEIGHT-shooter2.size.h;
		}
		//nave.mover(DT);

		/*for(var i = 0; i < asteroids.length; i++) {
			for(var j = 0; j < shots.length; j++) {
				var status = asteroids[i].reached(shots[j]);
				if(status != 0) {
					shots.splice(j, 1);
					if(status == 2) {
						asteroids.splice(i, 1);
						pontos++;
						//controle de nivel
						if(pontos % 3 == 0) {
							lvl++;
						}
						break;
					}
				}
			}
		}
		for(var i = 0; i < builds.length; i++) {
			for(var j = 0; j < asteroids.length; j++) {
				var status = builds[i].colidiu(asteroids[j]);
				if(status != 0) {
					asteroids.splice(j, 1);
					if(status == 2) {
						builds.splice(i, 1);
						break;
					}
				}
			}
		}
		for(var i = 0; i < asteroids.length; i++) {
			var status = shooter1.colidiu(asteroids[i]);
			if(status != 0) {
				asteroids.splice(i, 1);
				if(status == 2) {
					reset();
					fim.play();
					recomeca = false;
					break;
				}
			}
		}*/
		//desenha os objetos no canvas
		//builds.forEach( function(build) { build.draw(ctx); } );
		//asteroids.forEach( function(ast) { ast.draw(ctx, true); } );
		//desenha os tiros na tela
		shots.forEach( function(shot) { shot.draw(ctx); } );
		shots2.forEach( function(shot2) { shot2.draw(ctx); } );
		//desenha as naves na tela
		shooter1.draw(ctx);
		shooter2.draw(ctx);
		//nave.desenhar(ctx);
		//texto placar
		/*destruidos.raster(ctx, "Destruidos: " + pontos, 10, 25);
		textoTiros.raster(ctx, "Tiros: " + tiros, 10, 55);
		canhaoVidas.raster(ctx, "Vidas: " + shooter1.life, 10, 85);
		textoRatio.raster(ctx, "Precisão: " + ratio + "%", 10, 115);
		textoBuilds.raster(ctx, "Prédios: " + builds.length, 10, 145);
    */
		/*if(asteroids.length < lvl){
			asteroids = asteroids.concat(gen.asteroid(lvl));
		}*/
		if (shooter1.pontos >= PTSMAX || shooter2.pontos >= PTSMAX) { // fim de jogo
			//verifica quem ganhou
			if (shooter1.pontos >= PTSMAX) {
				ganhador = 1;
			}if (shooter2.pontos >= PTSMAX) {
				ganhador = 2;
			}
			recomeca = false;
			reset();
		}
	//}
	}else if(!inicio){// exibe a mensagem da tela inicial
		var msg = new Text("Courier", 30, "black");
		msg.raster(ctx, "Apertem ENTER para começar", 25, HEIGHT/2 );
	}else if(pause){// exibe a mensagem de jogo pausado
		var msg = new Text("Courier", 25, "black");
		msg.raster(ctx, "Apertem P para continuar", (WIDTH/6), HEIGHT/2 );
	}
}

	setInterval(loop, 1000/FPS);
	//controle do jogo
	addEventListener("keydown", function(e){
		if(e.keyCode == 32 && !shoot) { // Espaco, tiro player 1
			ball.pos = {x: shooter1.ballPos.x, y: (shooter1.ballPos.y+shooter1.size.h)}; // marca a posicao da bala
			ball.setVelocityVector(shooter1.center); // ajusta a velocidade da bala
			shots.push(ball); // adiciona a bala no vetor de tiros
			ball = null; // apaga a bala auxiliar
			shoot = true;// bloqueia a repeticao do tiro
			e.preventDefault();
		}if(e.keyCode == 37){ // esquerda player 1
			//shooter1.omega = -2;
			//shooter1.ax = -100;
			shooter1.vx = -100;
			e.preventDefault();
		}if(e.keyCode == 39){ // direita player 1
			//shooter1.omega = 2;
			//shooter1.ax = 100;
			shooter1.vx = 100;
			e.preventDefault();
		}if (e.keyCode == 38) { // cima player 1
      //shooter1.newx = -2*G;
			//shooter1.ay = -100;
			shooter1.vy = -100;
			e.preventDefault();
    }if (e.keyCode == 40) { // baixo player 1
      //shooter1.newy = 2*G;
			//shooter1.ay = 100;
			shooter1.vy = 100;
			e.preventDefault();
    }
    if(e.keyCode == 13){// Enter
			inicio = true;
			e.preventDefault();
		}if(e.keyCode == 80){// P
				pause = !pause;
				//e.preventDefault();
		}if (e.keyCode == 82) {// R
				recomeca = true;
		}
		if (e.keyCode == 87) {// W
			//nave.ay = -100;
			shooter2.vy = -100;
			e.preventDefault();
		}
		if (e.keyCode == 83) {// S
			//nave.ay = 100;
			shooter2.vy = 100;
			e.preventDefault();
		}
		if (e.keyCode == 65) {// A
			//nave.ax = -100;
			shooter2.vx = -100;
			e.preventDefault();
		}
		if (e.keyCode == 68) {// D
			//nave.ax = 100;
			shooter2.vx = 100;
			e.preventDefault();
		}
		if (e.keyCode == 16){// Shift Esq
			ball2.pos = {x: shooter2.ballPos.x, y: shooter2.ballPos.y}; // marca a posicao da bala
			ball2.setVelocityVector(shooter2.center); // ajusta a velocidade da bala
			shots2.push(ball2); // adiciona a bala no vetor de tiros
			ball2 = null; // apaga a bala auxiliar
			shoot2 = true;// bloqueia a repeticao do tiro
			e.preventDefault();
		}
	});

	addEventListener("keyup", function(e){
		if(e.keyCode == 32) { // Espaco player 1
			ball = new Shot(shooter1.ballPos.x, shooter1.ballPos.y, 325, 0, 12, 0);// prepara a nova bala
			shoot = false;
		}
		if(e.keyCode == 37 || e.keyCode == 39){ //esquerda e direita player 1
			//shooter1.omega = 0;
			shooter1.ax = 0;
			shooter1.vx = 0;
		}
		if (e.keyCode == 38 || e.keyCode == 40) { //cima e baixo player 1
      shooter1.ay = 0;
			shooter1.vy = 0;
    }
		if (e.keyCode == 87 || e.keyCode == 83) {// W e S
			//nave.ay = 0;
			shooter2.vy = 0;
		}
		if (e.keyCode == 65 || e.keyCode == 68) {// A e D
			//nave.ax = 0;
			shooter2.vx = 0;
		}
		if (e.keyCode == 16) {// Shift Esq
			ball2 = new Shot(shooter2.ballPos.x, shooter2.ballPos.y, 325, 0, 12, 1);// prepara a nova bala
			shoot2 = false;
		}
	});
}
