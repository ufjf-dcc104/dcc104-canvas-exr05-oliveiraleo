//Texto do placar
function Text(font, size, rgb) {
	this.font = font 	|| "Courier";
	this.size = size 	|| 20;
	this.color = rgb 	|| "#000000" ;

	this.raster = function(ctx, text, x, y) {
		ctx.font = "" + this.size + "px " + this.font;
		ctx.fillStyle = this.color;
		ctx.fillText(text, x, y);
	}
}
//variaveis globais
var pause = false;
var inicio = false;

//Regra do jogo
function start() {
	//alert("A diversão vai começar!");
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");
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
	//variaveis globais
	var shots = []; var shoot = false;
	var shots2 = []; var shoot2 = false;

	var shooter = new Shooter({x: WIDTH/2, y: HEIGHT/6}, {w: 20, h: 35}, "black", Math.PI);
  var shooter2 = new Shooter({x: WIDTH/2, y: HEIGHT-(HEIGHT/6)}, {w: 20, h: 35}, "yellow", 2*Math.PI);
	var ball = new Shot(shooter.ballPos.x, (shooter.ballPos.y-shooter.h), 0, 325, 12, 0);
  var ball2 = new Shot(shooter2.ballPos.x, shooter2.ballPos.y, 0, -325, 12, 1);

	//var ball = new Shot(shooter.ballPos.x, shooter.ballPos.y, {(50, 50)}, {(50, 50)}, 1);
	//var ball2 = new Shot(shooter.ballPos.x, shooter.ballPos.y, {(50, 50)}, {(50, 50)}, 0);

	//var nave = new Sprite();

	//var lvl = 0;
  var pontos = 0;
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
		if(recomeca){
			var msg = new Text("Courier", 30, "black");
			if (verificaInicio) {
			msg.raster(ctx, "Aperte R para continuar", WIDTH/4, HEIGHT/2 );
			}
		}
		verificaInicio = true;
		//musica.currentTime = 0; //recomeca a musica de fundo
		//lvl = 1;
		//pontos = 0;
		//builds = gen.build(11);//gera predios
		//builds.splice(5, 1); // remove o que esta na frente do shooter
		//asteroids = gen.asteroid(lvl); //reseta o gen de asteroide
		shooter.reset();//volta o shooter para posicao inicial
    shooter2.reset();
		//tiros = 0;
		//ratio = 0;
		//shoot.length = 0;
	}; reset();
	//regra do jogo
	var loop = function() {
		if(inicio && !pause && recomeca){
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
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
		//atira player 1
		for(var i = 0; i < shots.length; i++) {
			shots[i].move(DT, G);
			if(shots[i].pos.y < 0 || shots[i].pos.x < 0 || shots[i].pos.x > WIDTH)
				shots.splice(i, 1);
		}
		//atira player 2
		for(var i = 0; i < shots2.length; i++) {
			shots2[i].move(DT, G);
			if(shots2[i].pos.y < 0 || shots2[i].pos.x < 0 || shots2[i].pos.x > WIDTH)
				shots2.splice(i, 1);
		}
		shooter.move(DT, G);
    shooter2.move(DT, G);
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
			var status = shooter.colidiu(asteroids[i]);
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
		shots.forEach( function(shot) { shot.draw(ctx); } );
		shots2.forEach( function(shot2) { shot2.draw(ctx); } );
		shooter.draw(ctx);
		shooter2.draw(ctx);
		//nave.desenhar(ctx);
		//texto placar
		/*destruidos.raster(ctx, "Destruidos: " + pontos, 10, 25);
		textoTiros.raster(ctx, "Tiros: " + tiros, 10, 55);
		canhaoVidas.raster(ctx, "Vidas: " + shooter.life, 10, 85);
		textoRatio.raster(ctx, "Precisão: " + ratio + "%", 10, 115);
		textoBuilds.raster(ctx, "Prédios: " + builds.length, 10, 145);
    */
		/*if(asteroids.length < lvl){
			asteroids = asteroids.concat(gen.asteroid(lvl));
		}*/
	}else if(!inicio){
		var msg = new Text("Courier", 30, "black");
		msg.raster(ctx, "Aperte ENTER para começar", 25, HEIGHT/2 );
	}else if(pause){
		var msg = new Text("Courier", 25, "black");
		msg.raster(ctx, "Aperte P para continuar", (WIDTH/6), HEIGHT/2 );
	}//else

}

	setInterval(loop, 1000/FPS);
	//controle do jogo
	addEventListener("keydown", function(e){
		if(e.keyCode == 32 && !shoot) { // Espaco, tiro player 1
			ball.pos = {x: shooter.ballPos.x, y: shooter.ballPos.y};
			ball.setVelocityVector(shooter.center);
			shots.push(ball);
			ball = null;
			shoot = true;
			//tiros++;
		}if(e.keyCode == 37){ // esquerda player 1
			//shooter.omega = -2;
			//shooter.ax = -100;
			shooter.vx = -100;
			e.preventDefault();
		}else if(e.keyCode == 39){ // direita player 1
			//shooter.omega = 2;
			//shooter.ax = 100;
			shooter.vx = 100;
			e.preventDefault();
		}else if (e.keyCode == 38) { // cima player 1
      //shooter.newx = -2*G;
			//shooter.ay = -100;
			shooter.vy = -100;
			e.preventDefault();
    }else if (e.keyCode == 40) { // baixo player 1
      //shooter.newy = 2*G;
			//shooter.ay = 100;
			shooter.vy = 100;
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
			shooter2.ay = -100;
		}
		if (e.keyCode == 83) {// S
			//nave.ay = 100;
			shooter2.ay = 100;
		}
		if (e.keyCode == 65) {// A
			//nave.ax = -100;
			shooter2.ax = -100;
		}
		if (e.keyCode == 68) {// D
			//nave.ax = 100;
			shooter2.ax = 100;
		}
		if (e.keyCode == 17){// Ctrl Esq
			ball2.pos = {x: shooter2.ballPos.x, y: shooter2.ballPos.y};
			ball2.setVelocityVector(shooter2.center);
			shots2.push(ball2);
			ball2 = null;
			shoot2 = true;
		}
	});

	addEventListener("keyup", function(e){
		if(e.keyCode == 32) { // Espaco player 1
			ball = new Shot(shooter.ballPos.x, shooter.ballPos.y, 325, 0, 12, 0);
			shoot = false;
		}
		if(e.keyCode == 37){ //esquerda player 1
			//shooter.omega = 0;
			shooter.ax = 0;
			shooter.vx = 0;
		}
		if(e.keyCode == 39) { //direita player 1
			//shooter.omega = 0;
			shooter.ax = 0;
			shooter.vx = 0;
		}
		if (e.keyCode == 38) { //cima player 1
      shooter.ay = 0;
			shooter.vy = 0;
    }
		if (e.keyCode == 40) { // baixo player 1
      shooter.ay = 0;
			shooter.vy = 0;
    }
		if (e.keyCode == 87 || e.keyCode == 83) {// W e S
			//nave.ay = 0;
			shooter2.ay = 0;
		}
		if (e.keyCode == 65 || e.keyCode == 68) {// A e D
			//nave.ax = 0;
			shooter2.ax = 0;
		}
		if (e.keyCode == 17) {// Ctrl Esq
			ball2 = new Shot(shooter2.ballPos.x, shooter2.ballPos.y, 325, 0, 12, 1);
			shoot2 = false;
		}
	});
}
