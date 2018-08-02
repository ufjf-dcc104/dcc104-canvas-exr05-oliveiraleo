//matematica
const PI2     = Math.PI / 2.0;
const PI3			= Math.PI / 3.0;
const PI4     = Math.PI / 4.0;
const PI6	  = Math.PI / 6.0;
const PI12	  = Math.PI / 12.0;
const RAD4DEG = Math.PI / 180.0;
const DEG4RAD = 180.0 / Math.PI;

//Posicao barra
function Point(x, y) {
	this.x = x;
	this.y = y;
}
//Tamanho barra
function Size(w, h) {
	this.w = w;
	this.h = h;
}

//tiros
function Shot(x, y, vx, vy, r, dir) {
	this.pos = {x, y};
	this.vel = {vx, vy};
	this.radius = r;
	//desenha os tiros
	this.draw = function(ctx) {
		ctx.fillStyle   = "red";
		ctx.strokeStyle = "black";
		ctx.beginPath();
			ctx.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI, true);
		ctx.closePath();
		ctx.fill();
		//console.log("Desenha");
	}
	//move os tiros
	this.move = function(dt, g) {

		//this.pos = {x: this.ballPos.x, y: this.ballPos.y}
		//if(dir == 0){
			this.pos.x += this.vel.vx * dt;
			this.pos.y += this.vel.vy * dt;
		//}else if (dir == 1) {
			//this.pos.x += this.vel.vx * dt;
			//this.pos.y += this.vel.vy * dt;
		//}
		console.log(this.pos);
	}
	//cria o vetor de velocidade do tiro
	this.setVelocityVector = function(o, _mag) {
		if(dir == 0){
			var mag = _mag || 325;
		}if (dir == 1) {
			var mag = _mag || 325;
		}

		var d = this.pos;
		var norm = Math.sqrt( Math.pow(d.x - o.x, 2) + Math.pow(o.y - d.y, 2) );

		this.vel = {vx: (d.x - o.x)/norm, vy: (d.y - o.y)/norm};
		this.vel.vx *= mag;
		this.vel.vy *= mag;
		console.log(this.vel);
	}
}

//naves
function Shooter(center, size, color, rotacao) {
	this.center = center || {x: 0, y: 0};
	//this.x = 0;
	//this.y = 0;
	//this.center = center;
	this.size  = size || {w: 50, h: 50};
	this.theta = 0;
	this.omega = 0;
	this.g = 0;
  this.vx = 0;
  this.vy = 0;
	this.color = " ";
	//this.rotacao = rotacao;
	this.pontos = 0;
	this.ax = 0;
	this.ay = 0;
	this.am = 0;
	this.angle = 90;
	this.vang = 0;

	this.ballPos = {x: this.center.x, y: this.center.y - this.size.h / 2};
	//desenha a nave
	this.draw = function(ctx) {
		if(!ctx) return;// somente desenha se existe contexto

		ctx.save();
		ctx.translate(this.center.x, this.center.y);
		ctx.rotate(this.angle*2*Math.PI/360);
		//cor
		ctx.fillStyle = color;
		ctx.strokeStyle = "#00ff26";
		ctx.beginPath();
			ctx.moveTo(this.size.w / 2, this.size.h / 2);
			ctx.lineTo(-this.size.w / 2,  this.size.h / 32);
			ctx.lineTo(this.size.w / 2, -this.size.h / 2);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

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
		if(this.angle > 360 || this.angle < -360){
			this.angle = 0;
		}

 		//posiciona o tiro na ponta da nave e define a direcao
		//this.ballPos.x = this.center.x + (this.size.h / 2) * Math.sin(this.angle);
		//this.ballPos.y = this.center.y + (this.size.h / 2) * Math.cos(this.angle);

		this.ballPos.x = this.center.x * Math.tan(this.size.h*(this.size.w/2));
		this.ballPos.y = this.center.y * Math.cos(this.angle);
		//move a nave

		this.angle = this.angle + this.vang*dt;
		this.vx = this.am*Math.cos(Math.PI*this.angle/180);
		this.vy = this.am*Math.sin(Math.PI*this.angle/180);
		this.vy = this.vy + this.ay*dt;
		this.vx = this.vx + this.ax*dt;
		this.center.x += this.vx * dt;
    this.center.y += this.vy * dt;
		this.angle = this.angle + this.vang*dt;
	}
  //reset da nave
	this.reset = function() {
		//reseta os contadores
		this.life = 3;
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

function Barreira(pos, size){
	this.pos = pos;
	this.size = size;

	this.draw = function(ctx){
		ctx.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
		ctx.strokeStyle = "black";
		//ctx.lineWidth = "2";
		ctx.fillStyle = "red";
		ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
		ctx.stroke();
		//ctx.lineWidth = "0";
	}
}
