var nave;
var balas;
var tiemproEntreBalas=400;
var tiempo = 0;
var malos;
var timer;
var puntos;
var txtPuntos;
var vidas;
var txtVidas;
let sonidoLaser = new Audio('sonido/laser.mp3');
let sonidoColision = new Audio('sonido/colision.mp3');

var Juego={
	preload: function () {
		juego.load.image('nave','img/nave2.png');
		juego.load.image('laser','img/laser.png');
		juego.load.image('malo','img/enemigo1.png');
		juego.load.image('bg','img/bg.png');
		juego.load.image('nombre','img/nombre.jpg');
	},

	create: function(){
		// Fondo del juego
		juego.add.tileSprite(0,0,400,540,'bg');
		fondoJuego = juego.add.tileSprite(0,0,400,540,'bg');
		nombres = juego.add.sprite(75,485,'nombre');
		// Centramos el punto de apoyo
		nave=juego.add.sprite(juego.width/2,485,'nave');
		nave.anchor.setTo(0.5);
		// Habilitar mecanicas
		juego.physics.arcade.enable(nave,true);

		// Mecanicas de balas - Arcade
		balas=juego.add.group();
		balas.enableBody=true; // Cuerpo de balas
		balas.setBodyType=Phaser.Physics.ARCADE; 
		balas.createMultiple(50,'laser'); // Cantidad
		balas.setAll('anchor.x',0.5);
		balas.setAll('anchor.y',0.5);
		balas.setAll('checkWorldBounds',true);
		balas.setAll('outOfBoundsKill',true); // Se eliminan cuando salen

		// Enemigos:
		malos=juego.add.group();
		malos.enableBody=true;
		malos.setBodyType=Phaser.Physics.ARCADE;
		malos.createMultiple(30,'malo');
		malos.setAll('anchor.x',0.5);
		malos.setAll('anchor.y',0.5);
		malos.setAll('checkWorldBounds',true);
		malos.setAll('outOfBoundsKill',true);

		// Cada 2000 milisegundos se crea un enemigo
		timer=juego.time.events.loop(2000,this.crearEnemigo,this);

		// Puntaje en pantalla 
		puntos=0;
		juego.add.text(20,20,"Puntos: ",{font:"14px Arial", fill:"#FFF"});
		txtPuntos=juego.add.text(80,20,"0",{font:"14px Arial", fill:"#FFF"});

		// Contador de vidas
		vidas=3;
		juego.add.text(310,20,"Vidas: ",{font:"14px Arial", fill:"#FFF"});
		txtVidas=juego.add.text(360,20,"3",{font:"14px Arial", fill:"#FFF"});
	},

	update: function(){
		fondoJuego.tilePosition.y+=1;
		// Rotar la imagen hacia el puntero
		nave.rotation=juego.physics.arcade.angleToPointer(nave)+Math.PI/2;

		// Cuando se presiona sale la bala
		if(juego.input.activePointer.isDown){
			this.disparar();
		}

		juego.physics.arcade.overlap(balas,malos,this.colision,null,this);

		// Contador de vidas
		malos.forEachAlive(function(m){
			if(m.position.y > 520 && m.position.y < 521){
				vidas-=1;
				txtVidas.text=vidas;
			}
		});
		
		if(vidas==0){
			juego.state.start('Terminado');
		}
	},

	disparar: function(){
		if(juego.time.now > tiempo && balas.countDead() > 0){
			tiempo=juego.time.now + tiemproEntreBalas;
			var bala = balas.getFirstDead();
			bala.anchor.setTo(0.5);
			// Posicion de nave y bala
			bala.reset(nave.x, nave.y);
			// La bala rota en funcion a la nave
			bala.rotation = juego.physics.arcade.angleToPointer(bala)+Math.PI/2;
			// La bala se mueve hacia el cursor y la velocidad
			juego.physics.arcade.moveToPointer(bala,200);
			sonidoLaser.play();
		}
	},

	crearEnemigo: function(){
		var enem=malos.getFirstDead();
		var num=Math.floor(Math.random()*10+1); // Aleatorio
		enem.reset(num*38,0); // Posicion 
		enem.anchor.setTo(0.5); 
		enem.body.velocity.y=100; // Velocidad 
		enem.checkWorldBounds=true;
		enem.outOfBoundsKill=true; // Se elemina cuando sale
	},

	colision: function(b,m){
		b.kill();
		m.kill();
		// Puntaje en pantalla
		puntos++;
		txtPuntos.text=puntos;
		sonidoColision.play();
	}

};