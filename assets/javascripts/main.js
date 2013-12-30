// start enchant.js
enchant();

// on document load
window.onload = function() {
  // start
  var game = new Game(320, 440);
  // preload resources
  game.preload('assets/media/BG.png');
  // game settings
  game.fps = 30;
  game.scale = 1;
  game.onload = function () {
    // once game finishes loading
    console.log("Hi, Ocean!");

    var scene, label, bg;
    scene = new Scene();
    label = new Label("Hi, Ocean!");
    bg = new Sprite(320, 440);
    bg.image = game.assets['assets/media/BG.png'];

    scene.addChild(bg);
    scene.addChild(label);

    game.pushScene(scene);
  }
  game.start();
}
