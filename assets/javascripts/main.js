// start enchant.js
enchant();

// on document load
window.onload = function() {
  // start
  var game = new Game(320, 440);
  // preload resources
  game.preload( 'assets/media/BG.png',
                'assets/media/penguinSheet.png',
                'assets/media/Ice.png',
                'assets/media/Hit.mp3',
                'assets/media/bgm.mp3');
  // game settings
  game.fps = 30;
  game.scale = 1;
  game.onload = function () {
    // once game finishes loading
    console.log("Hi, Ocean!");
    var scene = new SceneGame();

    game.pushScene(scene);
  }
  game.start();

  // SceneGame
  var SceneGame = Class.create(Scene, {
    // Main gameplay scene
    initialize: function () {
      var game, lable, bg, penguin, iceGroup;
      // Calls superclass constructor
      Scene.apply(this);
      game = Game.instance;
      // Create child nodes
      label = new Label("SCORE<br>0");
      label.x = 9;
      label.y = 32;
      label.color = 'white';
      label.font = "16px strong";
      label.textAlign = 'center';
      label._style.textShadow = "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
      this.scoreLabel = label;
      bg = new Sprite(320, 440);
      bg.image = game.assets['assets/media/BG.png'];
      // Penguin
      penguin = new Penguin();
      penguin.x = game.width/2 - penguin.width/2;
      penguin.y = 280;
      this.penguin = penguin;

      // Ice Group
      iceGroup = new Group();
      this.iceGroup = iceGroup;

      // Timer for generating ice
      this.generateIceTimer = 0;

      // Background music
      this.bgm = game.assets['assets/media/bgm.mp3'];
      this.bgm.play();

      this.addChild(bg);
      this.addChild(iceGroup);
      this.addChild(penguin);
      this.addChild(label);
      this.addEventListener(Event.TOUCH_START, this.handleTouchControl);
      this.addEventListener(Event.ENTER_FRAME, this.update);
      // this.addEventListener(Event.TOUCH_MOVE, this.handleTouchControl);
      // this.addEventListener(Event.TOUCH_END, this.handleTouchControl);

      this.scoreTimer = 0;
      this.score = 0;
    },

    handleTouchControl: function (evt) {
      var laneWidth, lane;
      laneWidth = 320/3;
      lane = Math.floor(evt.x/laneWidth);
      lane = Math.max(Math.min(2, lane), 0);
      this.penguin.switchToLaneNumber(lane);
      console.log('touched');
    },

    update: function (evt) {
      this.scoreTimer += evt.elapsed * 0.001;
      if (this.scoreTimer >= 0.5) {
        this.setScore(this.score + 1);
        this.scoreTimer -= 0.5;
      }
      this.generateIceTimer += evt.elapsed * 0.001;
      if (this.generateIceTimer >= 0.5) {
        var ice;
        this.generateIceTimer -= 0.5;
        ice = new Ice(Math.floor(Math.random()*3));
        this.iceGroup.addChild(ice);
      }
      // check collision
      for (var i = this.iceGroup.childNodes.length - 1; i >= 0; i--) {
        var ice;
        ice = this.iceGroup.childNodes[i];
        if (ice.intersect(this.penguin)) {
          var game = Game.instance;
          game.assets['assets/media/Hit.mp3'].play();
          this.iceGroup.removeChild(ice);
          break;
        }
      }

      if (this.bgm.currentTime >= this.bgm.duration) {
        this.bgm.play();
      }
    },

    setScore: function (value) {
      this.score = value;
      this.scoreLabel.text = 'SCORE<br>' + this.score;
    }

  });

  // Penguin
  var Penguin = Class.create(Sprite, {
    initialize: function () {
      Sprite.apply(this, [30, 43]);
      this.image = Game.instance.assets['assets/media/penguinSheet.png'];
      this.animationDuration = 0;
      this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
    },

    updateAnimation: function (evt) {
      this.animationDuration += evt.elapsed * 0.001;
      if (this.animationDuration >= 0.25) {
        this.frame = (this.frame + 1) % 2;
        this.animationDuration -= 0.25;
      }
    },

    switchToLaneNumber: function (lane) {
      var targetX = 160 - this.width/2 + (lane - 1)*90;
      this.x = targetX;
    }
  });

  var Ice = Class.create(Sprite, {
    initialize: function (lane) {
      Sprite.apply(this, [48, 49]);
      this.image = Game.instance.assets['assets/media/Ice.png'];
      this.rotationSpeed = 0;
      this.setLane(lane);
      this.addEventListener(Event.ENTER_FRAME, this.update);
    },

    setLane: function (lane) {
      var game, distance;
      game = Game.instance;
      distance = 90;
      this.rotationSpeed = Math.random() * 100 - 50;

      this.x = game.width/2 - this.width/2 + (lane - 1)*distance;
      this.y = -this.height;
      this.rotation = Math.floor(Math.random()*360);
    },

    update: function (evt) {
      var ySpeed, game;
      game = Game.instance;
      ySpeed = 300;

      this.y += ySpeed * evt.elapsed * 0.001;
      this.rotation += this.rotationSpeed * evt.elapsed * 0.001;

      if (this.y > game.height) {
        this.parentNode.removeChild(this);
      }
    }
  });
}
