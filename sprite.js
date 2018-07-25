//matematica
const PI2     = Math.PI / 2.0;
const PI3			= Math.PI / 3.0;
const PI4     = Math.PI / 4.0;
const PI6	  = Math.PI / 6.0;
const PI12	  = Math.PI / 12.0;
const RAD4DEG = Math.PI / 180.0;
const DEG4RAD = 180.0 / Math.PI;
//tiros
function Shot(_x, _y, _vx, _vy, r) {
	//this.pos = {x: _x, y: _y};
	this.pos = {_x, _y};
	//this.vel = {vx: _vx, vy: _vy};
	this.vel = {_vx, _vy};
	this.radius = r;

	this.draw = function(ctx) {
		ctx.fillStyle   = "#000000";
		ctx.strokeStyle = "#000000";
		ctx.beginPath();
			ctx.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI, true);
		ctx.closePath();
		ctx.fill();
	}

	this.move = function(dt, g) {
		var prevy = this.pos.y;

		this.pos.x += this.vel.vx * dt;
		this.pos.y += this.vel.vy * dt - (g/2) * dt * dt;
		this.vel.vy -= g * dt;

		this.radius -= 0.1;
	}
	this.setVelocityVector = function(o, _mag) {
		var mag = _mag || 325;
		var d = this.pos;
		var norm = Math.sqrt( Math.pow(d.x - o.x, 2) + Math.pow(o.y - d.y, 2) );

		this.vel = {vx: (d.x - o.x)/norm, vy: (d.y - o.y)/norm};
		this.vel.vx *= mag;
		this.vel.vy *= mag;
	}
}



//naves
function Shooter(center, size) {
	this.center = center || {x: 0, y: 0};
	this.size  = size || {w: 50, h: 50};
	this.theta = 0;
	this.omega = 90;
  //this.newx = 0;
  //this.newy = 0;

	this.x = 100;
  this.y = 100;
  //this.w = 20;
  //this.h = 20;
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;
  this.ang = 0;
  this.vang = 0;
  this.acel = 0;
  //this.cor = "grey";

	this.ballPos = {x: this.center.x, y: this.center.y - this.size.h / 2};

	this.draw = function(ctx) {
		if(!ctx) return;

		ctx.save();
		ctx.translate(this.center.x, this.center.y);
		//ctx.rotate(this.theta);
		//cor
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = "#00ff26";
		ctx.beginPath();
			ctx.moveTo(-this.size.w / 2, this.size.h / 2);
			ctx.lineTo(this.size.w / 2,  this.size.h / 2);
			ctx.lineTo(0, -this.size.h / 2);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.restore();
	}

	this.move = function(dt, g) {
		//limite de rotacao
		//this.theta += this.omega * dt;
		/*if(this.theta < -PI3) {
			this.theta = -PI3;
		} else if(PI3 < this.theta) {
			this.theta = PI3;
		}*/

		this.ballPos.x = this.center.x + (this.size.h / 2) * Math.sin(this.theta);
		this.ballPos.y = this.center.y - (this.size.h / 2) * Math.cos(this.theta);
    //console.log(this.center);
    this.center.x += this.vx * dt;
    this.center.y += this.vy * dt;

		//new

		this.vx += this.ax*dt;
    this.vy += this.ay*dt;

    this.x += this.vx*dt;
    this.y += this.vy*dt;
	}
 //var hit = new Audio('sound/siren.mp3');
	this.colidiu = function(asteroid) {
		var p = asteroid.getFrontPoint();
		var w2 = this.size.w / 2;
		if(this.center.x - w2 -10 <= p.x && p.x <= this.center.x + w2 + 10) {
			if(this.ballPos.y + 10 < p.y) {
				this.life -= 1;
				hit.play();
				if(this.life == 0){
					return 2;
				}
				return 1;
			}
		}
		return 0;
	}

	this.reset = function() {
		this.life = 3;
		//this.theta = 0;
		//this.omega = 0;
	}
}

/*function CollectionGenerator(W, H) {
	this.WIDTH  = W;
	this.HEIGHT = H;

	this.build = function(n){
		var builds = [];
		var lastw = 0;

		for(var i = 0; i < n; i++) {
			var wi = Math.floor(50 + Math.random() * 10);
			var hi = Math.floor(100 + Math.random() * 40);
			var xi = 5 + i * (lastw + 20);
			var yi = this.HEIGHT - hi;


			lastw = wi;

			builds.push(new Build(xi, yi, wi, hi));
		}
		return builds;
	},
	this.asteroid = function(n) {
		var asteroids = [];
		var s = function() {
			return Math.pow(-1, Math.floor(Math.random() * 2));
		}

		for(var i = 0; i < n; i++) {
			var r  = Math.floor(8 + Math.random() * 4);
			var cx = Math.floor(10 + Math.random() * this.WIDTH-10);
			var cy = -r * (i + 2);
			var vx = s() * Math.floor(10 + Math.random() * 10);
			var vy = s() * Math.floor(10 + Math.random() * 10);

			asteroids.push(new Asteroid(cx, cy, r, vx, vy));
		}

		return asteroids;
	}
};*/
