//matematica
const PI2     = Math.PI / 2.0;
const PI3			= Math.PI / 3.0;
const PI4     = Math.PI / 4.0;
const PI6	  = Math.PI / 6.0;
const PI12	  = Math.PI / 12.0;
const RAD4DEG = Math.PI / 180.0;
const DEG4RAD = 180.0 / Math.PI;
//tiros
function Shot(x, y, vx, vy, r, dir, angle) {
	this.pos = {x, y};
	this.vel = {vx, vy};
	this.radius = r; //raio da circunferencia
	this.angle = angle; //angulo do movimento do tiro
	//desenha os tiros
	this.draw = function(ctx) {
		ctx.fillStyle   = "#b2ff00";
		ctx.strokeStyle = "#ff0000";
		//desenha a circunferencia
		ctx.beginPath();
			ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);// coordenadas, raio, ang inicial, ang final (arco)
		ctx.closePath();
		ctx.fill();
	}
	//Verifica se o tiro saiu da tela
	this.isForaTela = function(){
		if(this.pos.y < 0 || this.pos.x < 0 || this.pos.x > 500 || this.pos.y > 500){
			return true;
		}
		return false;
	}
	//move os tiros
	this.movexUp = function(dt){
		if (!(this.isForaTela())) {
			this.pos.y -= 300 * dt;
		}
	}

	this.movexDown = function(dt){
		if (!(this.isForaTela())) {
			this.pos.y += 300 * dt;
		}
	}

	this.moveyDir = function(dt){
		if (!(this.isForaTela())) {
			this.pos.x += 300 * dt;
		}
	}

	this.moveyEsq = function(dt){
		if (!(this.isForaTela())) {
			this.pos.x -= 300 * dt;
		}
	}
	//define a direcao do movimento do tiro
	this.move = function(dt){
		if (this.angle == 90 || this.angle == -270) {
			this.movexUp(dt);
		}if (this.angle == -90 || this.angle == 270) {
			this.movexDown(dt);
		}if (this.angle == 180 || this.angle == -180) {
			this.moveyDir(dt);
		}if (this.angle == 0) {
			this.moveyEsq(dt);
		}
	}
}
//naves
function Shooter(center, size, color, rotacao, img) {
	this.center = center || {x: 0, y: 0};
	this.size  = size || {w: 50, h: 50};
	this.theta = 0;
	this.omega = 0;
	this.g = 0;
  this.vx = 0;
  this.vy = 0;
	this.color = " ";
	this.pontos = 0;
	this.ax = 0;
	this.ay = 0;
	this.am = 0; //aceleracao de movimento
	this.angle = 90;
	this.image = img;

	this.ballPos = {x: this.center.x, y: this.center.y - this.size.h / 2};
	//desenha a nave
	this.draw = function(ctx) {
		if(!ctx) return;// somente desenha se existe contexto

		ctx.save();
		ctx.translate(this.center.x, this.center.y);
		ctx.rotate(this.angle*2*Math.PI/360);
		//define a cor
		ctx.fillStyle = color;
		ctx.strokeStyle = "#00ff26";
		ctx.beginPath();//desenha o shooter
			ctx.moveTo(this.size.w / 2, this.size.h / 2);
			ctx.lineTo(-this.size.w / 2,  this.size.h / 32);
			ctx.lineTo(this.size.w / 2, -this.size.h / 2);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		//ctx.drawImage(img, -this.size.w/2, -this.size.h/2, this.size.w, this.size.h);
		//mostra o contorno da caixa de colisao
		if(true){
	    ctx.strokeStyle = "grey";
	    ctx.strokeRect(-this.size.w/2, -this.size.h/2, this.size.w, this.size.h);
	  }
	ctx.restore();
}
	//move a nave
	this.move = function(dt) {
		//verifica os limites da tela
		if (this.center.x < this.size.w/2) {
			this.center.x = this.size.w/2;
		}if (this.center.x > 500-this.size.w/2) {
			this.center.x = 500-this.size.w/2;
		}if (this.center.y < this.size.h/2) {
			this.center.y = this.size.h/2;
		}if (this.center.y > 500-this.size.h/2) {
			this.center.y = 500-this.size.h/2;
		}
		if(this.angle >= 360 || this.angle <= -360){
			this.angle = 0;
		}
		this.vx = this.am*Math.cos(Math.PI*this.angle/180);
		this.vy = this.am*Math.sin(Math.PI*this.angle/180);
		this.vy = this.vy + this.ay*dt;
		this.vx = this.vx + this.ax*dt;
		this.center.x += this.vx * dt;
    this.center.y += this.vy * dt;
	}
  //reset da nave
	this.reset = function() {
		//reseta os contadores
		this.life = 5;
		//reposiciona as naves
		this.reposiciona();
	}

	this.reposiciona = function(){
		if(rotacao == 0){
				this.center = {x:500*Math.random() ,y:30 }
		}else {
			this.center = {x:500*Math.random() ,y:470 }
		}
	}
}
//Objetos do mapa
function Barreira(pos, size, image){
	this.pos = pos;
	this.size = size;
	this.sprite = image;

	this.draw = function(ctx){
		//mostra a caixa de colisao
		ctx.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
		ctx.strokeStyle = "white";
		//ctx.lineWidth = "2";
		//ctx.fillStyle = "purple";
		//ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
		//imagem
		ctx.drawImage(this.sprite, this.pos.x, this.pos.y, this.size.w, this.size.h);
		ctx.stroke();
		//ctx.lineWidth = "0";
	}
}
