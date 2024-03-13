var player;
var platforms;
var stars;
var cursors;
var bombs;
var rock;
var tree;
var sign;
var dirt;
var resetButton;

var lives = 3;
var hearts = [];

var score = 0;
var scoreText;

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
    
    this.load.image('dirt', 'assets/dirt.png');
    
    this.load.image('heart', 'assets/heart.png');
    this.load.image('noheart', 'assets/noheart.png');
    this.load.image('zone', 'assets/zone.png');
    this.load.image('zone1', 'assets/zone1.png');
}

function create() {
    zones = this.physics.add.staticGroup();
    zones.create(-200, 100, 'zone1').setScale(2).setDepth(1);
    zones.create(worldWidth+200, 100, 'zone1').setScale(2).setDepth(1);
    //this.add.image(0, 0, 'sky').setOrigin(0,0).setScale(1);
    this.add.tileSprite(0, 0, worldWidth, 1080, 'sky').setOrigin(0, 0).setScale(1).setDepth(0);
    
    platforms = this.physics.add.staticGroup();

    zone = this.physics.add.staticGroup();

    for(var x=-500; x<worldWidth+500; x=x+700)
    {
        zone
            .create(x, 1080, 'zone')
            .setDepth(2)
            console.log(zone.X, zone.Y)
    }

    rock = this.physics.add.staticGroup();

    for(var x=0; x<worldWidth; x=x+Phaser.Math.FloatBetween(800, 1200))
    {
        rock
            .create(x, 1080-120, 'rock')
            .setOrigin(0, 1)
            .setScale(Phaser.Math.FloatBetween(0.5, 2))
            .setDepth(Phaser.Math.Between(1, 10));

            console.log(rock.X, rock.Y)
    }

    tree = this.physics.add.staticGroup();

    for(var x=200; x<worldWidth; x=x+Phaser.Math.FloatBetween(400, 800))
    {
        tree
            .create(x, 1080-120, 'tree')
            .setOrigin(0, 1)
            .setScale(Phaser.Math.FloatBetween(0.5, 2))
            .setDepth(Phaser.Math.Between(1, 10));

            console.log(tree.X, tree.Y)
    }

    sign = this.physics.add.staticGroup();

    for(var x=500; x<worldWidth; x=x+Phaser.Math.FloatBetween(1000, 1200))
    {
        sign
            .create(x, 1080-120, 'sign')
            .setOrigin(0, 1)
            .setScale(Phaser.Math.FloatBetween(0.5, 2))
            .setDepth(Phaser.Math.Between(1, 10));

            console.log(sign.X, sign.Y)
    }

    player = this.physics.add.sprite(300, 450, 'dude').setScale(1.5).setDepth(5);
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
        var y = 205 * yStep

        platforms.create(x, y, 'skyL');

        var i;
        for(i = 1; 1 < Phaser.Math.Between(0, 5); i++)
    {
        platforms.create(x + 128 * i, y, 'skyC')
    }

    platforms.create(x + 128 * i, y, 'skyR');
}

for(var x=200; x<worldWidth; x=x+Phaser.Math.FloatBetween(400, 500))
    {
        var y = 1020

        platforms.create(x, y, 'floorL').setDepth(5);

        var i;
        for(i = 1; 1 < Phaser.Math.Between(0, 5); i++)
    {
        platforms.create(x + 128 * i, y, 'floorC').setDepth(5)
    }

    platforms.create(x + 128 * i, y, 'floorR').setDepth(5);
}

dirt = this.physics.add.staticGroup();

for(var x=0; x<worldWidth; x=x+128)
    {
        var y = 1020

        dirt.create(x, y, 'dirt').setDepth(1);
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
        repeat: 12,
        setXY: { x:15, y: 0, stepX: 300}
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0, 0.1));

    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    scoreText = this.add.text(30, 30, 'Score: 0', { fontSize: '32px', fill: '#000' }).setScrollFactor(0).setOrigin(0,0);

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    this.physics.add.collider(player, zone, underGround, null, this);

    this.physics.add.collider(player, zones, underGround, null, this);

    boomSound = this.sound.add('boom');
    deathSound = this.sound.add('death');
    jumpSound = this.sound.add('jump');
    coinSound = this.sound.add('coin');

    for (var i = 0; i < lives; i++) {
        hearts.push(this.add.image(config.width - 50 - i * 50, 50, 'heart').setScrollFactor(0));
    }
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

    var x = Phaser.Math.Between(0, worldWidth);

    var bomb = bombs.create(x, 16, 'bomb').setScale(3);
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });
    }
}

function hitBomb(player, bomb) {
    deathSound.play();
    boomSound.play();
    player.anims.stop();
    player.setTexture('dude');

    lives--;

    if (lives <= 0) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;

        var self = this;

        var resetButton = this.add.image(900, 800, 'reset').setInteractive().setScrollFactor(0);
    resetButton.setScale(1);

        resetButton.on('pointerdown', function () {
            self.physics.resume();
            player.disableBody(true, true);
            player = self.physics.add.sprite(100, 450, 'dude');
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            gameOver = false;
            self.scene.restart();
            score = 0;
            lives = 3;
        });
    } else {
        var heartIndex = hearts.length - lives - 1;
        hearts[heartIndex].setTexture('noheart');
    }

    bomb.disableBody(true, true);
}

function updateHearts() {
    hearts.forEach(function (heart) {
        heart.destroy();
    });

    hearts = [];

    for (var i = 0; i < lives; i++) {
        hearts.push(this.add.image(config.width - 50 - i * 50, 50, 'heart'));
    }

    for (var i = lives; i < 3; i++) {
        hearts.push(this.add.image(config.width - 50 - i * 50, 50, 'noheart'));
    }
}

function underGround () {
    this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;

        var self = this;

        var resetButton = this.add.image(900, 800, 'reset').setInteractive().setScrollFactor(0);
    resetButton.setScale(1);

        resetButton.on('pointerdown', function () {
            self.physics.resume();
            player.disableBody(true, true);
            player = self.physics.add.sprite(100, 450, 'dude');
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            gameOver = false;
            self.scene.restart();
            score = 0;
            lives = 3;
        });
}