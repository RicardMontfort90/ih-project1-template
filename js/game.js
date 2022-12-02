class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.falcon = new Player(500, 400, 70, 70);
    this.droplets = [];
    this.points = 0;
    this.generateInterval = null;
    this.backgroundMusic = new Audio('audio/force.mp3');
    this.winAudio = new Audio('audio/spaceballs.mp3');
    this.loseAudio = new Audio('audio/tellme.mp3');
  }

  
  _generatethings() {
    // Generate new droplet every second
    this.generateInterval = setInterval(() => {
      const newDroplet = new Droplet();
      // Apply effects
      newDroplet._assignRole();
      newDroplet._assignImage();
      newDroplet._fallLateral();
      // Add to the array
      this.droplets.push(newDroplet);
      
    }, 500) // cantidad de cosas que aparecen ( nª Pequeño =  MAS APARICIÓN)
  }

  
  
  _drawDroplets() {
    this.droplets.forEach((elem) => {
      // Si pintamos círculos:
      // this.ctx.beginPath()
      // this.ctx.fillStyle = "black";
      // this.ctx.arc(elem.x, elem.y, elem.width, 0, 2 * Math.PI);
      // this.ctx.fill();
      // this.ctx.closePath()
      this.ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height);
    })
  }

  

  _assignControls() {
    document.addEventListener('keydown', (e) => {
      console.log(e.code);
      switch (e.code) {
        case 'ArrowDown':
          this.falcon.moveDown();
          break;
        case 'ArrowUp':
          this.falcon.moveUp();
          break;
        case 'Space': // Bullets
          this.falcon.shoot() ////////////////////////////////////
          console.log()
          break;
          default:
          break;
      }
    });
  }

  _Collisions() {
    this.droplets.forEach((droplet) => {
      if (
        (
          // Compruebo si mi meatball está dentro de la X + width del droplet
          this.falcon.x >= droplet.x && this.falcon.x <= droplet.x + droplet.width ||
          this.falcon.x + this.falcon.width >= droplet.x && this.falcon.x + this.falcon.width <= droplet.x + droplet.width ||
          // Incluso si mi meatball es más grande que el droplet
          droplet.x >= this.falcon.x && droplet.x <= this.falcon.x + this.falcon.width
        ) &&
        (
          // Lo mismo con el eje Y
          this.falcon.y >= droplet.y && this.falcon.y <= droplet.y + droplet.height ||
          this.falcon.y + this.falcon.height >= droplet.y && this.falcon.y + this.falcon.height <= droplet.y + droplet.height ||
          droplet.y >= this.falcon.y && droplet.y <= this.falcon.y + this.falcon.height
        )
      ) {
        if (droplet.role === 'bonus') {
          this.points++  ; // this.points++ && this.healthBar++ ???????
        } else if (droplet.role === 'enemies') {
          this._gameOver() ; // this.points-- && this.healthBar-- ????????
        }
        
        if (this.points > 1) {
          this._winPage();
        }
        let index = this.droplets.indexOf(droplet);
        this.droplets.splice(index, 1);
      }
    })
  }

  _writeScore() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Verdana";
    this.ctx.fillText(`Points: ${this.points}`, 850, 50);
  }


//////////////////////////////////////////////////////////////////////////////////////
_drawBullets(){
  this.falcon.bullets.forEach((bullet) => {
   this.ctx.drawImage(bullet.image, bullet.x, bullet.y, bullet.width, bullet.height);
     //this.ctx.fillStyle = "black";
     //this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  })
}
/////////////////////////////////////////////////////////////////////////////////////
  _drawFalcon() {
    this.ctx.drawImage(this.falcon.image, this.falcon.x, this.falcon.y, this.falcon.width, this.falcon.height);
  }

  _clean() {
    this.ctx.clearRect(0, 0, 1000, 600);
  }

  _gameOver() {
    clearInterval(this.generateInterval);
    canvas.classList.add('hidden');
    const loosePage = document.getElementById("lose-page");
    loosePage.style = "display: block";
    this.backgroundMusic.pause();
    this.loseAudio.play();
  }

  _winPage() {
    clearInterval(this.generateInterval);
    const winPage = document.getElementById('win-page');
    winPage.style = "display: flex";
    const canvas = document.getElementById('canvas');
    canvas.style = "display:none";
    this.backgroundMusic.pause();
    this.winAudio.play();
    
   }

  _update() {
    this._clean();
    this._drawFalcon();
    this._drawDroplets();
    this._Collisions();
    this._writeScore();
    //////////////////////////////////
    this._drawBullets();
     
    //////////////////////////////////
    // window.requestAnimationFrame(this._update.bind(this))
    window.requestAnimationFrame(() => this._update());
  }

  start() {
    this._update();
    this._generatethings();
    this._assignControls();
    this.backgroundMusic.play();
  }

  
}

