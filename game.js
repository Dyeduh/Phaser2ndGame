var player;
var platforms;
var stars;
var cursors;
var bombs;
var rock;
var tree;
var sign;


var score = 0;
var scoreText;
var HighScore = 0;
var HighScoreText;

var gameOver = false;

var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: game,
    playerSpeed: 1000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var worldWidth = config.width * 2;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('reset', 'assets/reset.png');
    this.load.image('rock', 'assets/rock.png');
    this.load.image('tree', 'assets/tree.png');
    this.load.image('sign', 'assets/sign.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('boom', 'assets/boom.mp3');
    this.load.audio('death', 'assets/death.mp3');
    this.load.audio('jump', 'assets/jump.mp3');
    this.load.audio('coin', 'assets/coin.mp3');

    this.load.image('floorL', 'assets/floor1.png');
    this.load.image('floorC', 'assets/floor2.png');
    this.load.image('floorR', 'assets/floor3.png');

    this.load.image('skyL', 'assets/sky1.png');
    this.load.image('skyC', 'assets/sky2.png');
    this.load.image('skyR', 'assets/sky3.png');
}

function create() {
    //this.add.image(0, 0, 'sky').setOrigin(0,0).setScale(1);
    this.add.tileSprite(0, 0, worldWidth, 1080, 'sky').setOrigin(0, 0).setScale(1).setDepth(0);
    
    platforms = this.physics.add.staticGroup();
    

    rock = this.physics.add.staticGroup();

    for(var x=0; x<worldWidth; x=x+Phaser.Math.FloatBetween(800, 1200))
    {
        rock
            .create(x, 1080-128, 'rock')
            .setOrigin(0, 1)
            .setScale(Phaser.Math.FloatBetween(0.5, 2))
            .setDepth(Phaser.Math.Between(1, 10));

            console.log(rock.X, rock.Y)
    }

    tree = this.physics.add.staticGroup();

    for(var x=200; x<worldWidth; x=x+Phaser.Math.FloatBetween(400, 800))
    {
        tree
            .create(x, 1080-128, 'tree')
            .setOrigin(0, 1)
            .setScale(Phaser.Math.FloatBetween(0.5, 2))
            .setDepth(Phaser.Math.Between(1, 10));

            console.log(tree.X, tree.Y)
    }

    sign = this.physics.add.staticGroup();

    for(var x=500; x<worldWidth; x=x+Phaser.Math.FloatBetween(1000, 1200))
    {
        sign
            .create(x, 1080-128, 'sign')
            .setOrigin(0, 1)
            .setScale(Phaser.Math.FloatBetween(0.5, 2))
            .setDepth(Phaser.Math.Between(1, 10));

            console.log(sign.X, sign.Y)
    }

    player = this.physics.add.sprite(300, 450, 'dude').setScale(1.5);
    player
        .setBounce(0.2)
        .setCollideWorldBounds(false)
        .setDepth(5);

    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);
    this.cameras.main.startFollow(player);

    for(var x=0; x<worldWidth; x=x+Phaser.Math.FloatBetween(400, 500))
    {
        var yStep = Phaser.Math.Between(1, 4);
        var y = 200 * yStep

        platforms.create(x, y, 'skyL');

        var i;
        for(i = 1; 1 < Phaser.Math.Between(0, 5); i++)
    {
        platforms.create(x + 128 * i, y, 'skyC')
    }

    platforms.create(x + 128 * i, y, 'skyR');
}

for(var x=0; x<worldWidth; x=x+Phaser.Math.FloatBetween(400, 500))
    {
        var y = 1020

        platforms.create(x, y, 'floorL');

        var i;
        for(i = 1; 1 < Phaser.Math.Between(0, 5); i++)
    {
        platforms.create(x + 128 * i, y, 'floorC')
    }

    platforms.create(x + 128 * i, y, 'floorR');
}


    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);

    stars = this.physics.add.group({
        key: 'star',
        repeat: 15,
        setXY: { x:15, y: 0, stepX: 100}
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0, 0.1));

    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(30, 30, 'Score: 0', { fontSize: '32px', fill: '#000' });
    HighScoreText = this.add.text(1600, 30, ('High score: ' + HighScore), { fontSize: '32px', fill: '#000' });

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    boomSound = this.sound.add('boom');
    deathSound = this.sound.add('death');
    jumpSound = this.sound.add('jump');
    coinSound = this.sound.add('coin');
}

function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-config.playerSpeed);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(config.playerSpeed);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-500);
        jumpSound.play();
    }
}

function collectStar(player, star) {
    coinSound.play();

    star.disableBody(true, true);

    score += 1;
    scoreText.setText('Score: ' + score);

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb').setScale(3);
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

    if (HighScore < score) {
        HighScore = score;
    }

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    deathSound.play();
    boomSound.play();

    player.anims.play('turn');

    gameOver = true;

    var self = this;

    //var resetButton = this.add.image(960, 800, 'reset').setInteractive();
    //resetButton.setScale(1);

    //resetButton.on('pointerdown', function () {
    //    self.physics.resume();
    //    player.disableBody(true, true);
    //    player = self.physics.add.sprite(100, 450, 'dude').setScale(2);
    //    player
    //        .setBounce(0.2)
    //        .setCollideWorldBounds(true)
    //        .setDepth(5)
    //    gameOver = false;
    //    self.scene.restart();
    //    score = 0;
    //});
}
