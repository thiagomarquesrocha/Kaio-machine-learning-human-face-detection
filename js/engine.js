var debug = true;

/** Objeto principal */
var body = (function(){
    var _state = {
        blink : {
            left : true,
            right : true
        }
    };
    var _eye = {
        left : null,
        right : null
    };
    var _mouth = {};

    function bootstrap(){
        //  This sprite is using a texture atlas for all of its animation data
        //  This creates a simple sprite that is using our loaded image and
        //  displays it on-screen and assign it to a variable
        _eye.left = eye('eye_r1_c1.png', 'eye_r1_c2.png', -200, -180);
        _eye.right = eye('eye_r1_c1.png', 'eye_r1_c2.png', 200, -180);
        // Create mouth
        _mouth = mouth();

        sad();
    }

    function eye(frame_begin, frame_end, x, y){
        var new_eye = game.add.sprite(game.world.centerX + x, game.world.centerY + y, "eye_scene", frame_begin);

        var halfWidthEye = new_eye.texture.width/2;
        var halfHeightEye = new_eye.texture.height/2;

        new_eye.position.x -= halfWidthEye;
        new_eye.position.y -= halfHeightEye;
        new_eye.frames = {
            begin : frame_begin,
            end : frame_end
        };

        new_eye.anchor.setTo(0.5);

        new_eye.tween = {
            up : {
                y : new_eye.y - 20
            },
            down : {
                y : new_eye.y + 20
            }
        };

        return new_eye;
    }

    function getMouth(){
        return _mouth;
    }

    function mouth(){
        var new_mouth = game.add.sprite(game.world.centerX, game.world.centerY + 50, "mouth");
        new_mouth.anchor.setTo(0.6);
        new_mouth.tween = {
            left : {
                x : "0"
            },
            right : {
                x : "0"
            }
        };

        return new_mouth;
    }

    function blink(what_eye, value){

        if( typeof value == 'string' )
            value = parseFloat(value.replace(',', '.'));

        var eye_selected = (what_eye != 'left')? _eye.right : _eye.left;

        if( what_eye == 'left' ){
            _state.blink.right = true;
            _state.blink.left = false;
        }else{
            _state.blink.right = false;
            _state.blink.left = true;
        }

        if(value < 0.5 && value > 0) 
            updateFrame(eye_selected, eye_selected.frames.end);
        else{
            updateFrame(eye_selected, eye_selected.frames.begin);   
        }

        //console.log(value);
    }

    function sad(){
        _mouth.anchor.setTo(0.4);
        _mouth.angle = 180;
    }

    function happy(){
        _mouth.anchor.setTo(0.6);
        _mouth.angle = 0;
    }
    
    return{
        bootstrap : bootstrap,
        state : _state,
        eye : _eye,
        getMouth : getMouth,
        blink : blink,
        sad : sad,
        happy : happy
    }

})();

var tween = (function(){

    function eye(what_eye){
        if(what_eye == 'left')
            eye_down(body.eye.left);
        else
            eye_down(body.eye.right);
    }

    function mouth(){
       mouth_on(body.getMouth());
    }

    function mouth_on(mouth){
        //console.log("Animando ", mouth);
        var tween = game.add.tween(mouth).to( { y: mouth.y + 15, x : mouth.tween.left.x }, 1000, Phaser.Easing.In, true);
        tween.onComplete.addOnce(function(){
            mouth_off(mouth);
        }, this);
    }

    function mouth_off(mouth){
        //console.log("Finalizado");
        var tween = game.add.tween(mouth).to( { y: mouth.y - 15, x : mouth.tween.right.x }, 1000, Phaser.Easing.In, true);
        tween.onComplete.addOnce(function(){
            mouth_on(mouth);
        }, this);
    }

    function eye_down(eye){
        //console.log("Animando");
        var tween = game.add.tween(eye).to( { y: eye.tween.down.y }, 1000, Phaser.Easing.In, true);
        eye.tween.self = tween;
        tween.onComplete.addOnce(function(){
            eye_up(eye);
        }, this);
    }

    function eye_up(eye){
        //console.log("Finalizado");
        var tween = game.add.tween(eye).to( { y: eye.tween.up.y }, 1000, Phaser.Easing.In, true);
        eye.tween.self = tween;
        tween.onComplete.addOnce(function(){
            eye_down(eye);
        }, this);
    }

    return{
        eye : eye,
        mouth : mouth
    }
})();

var game = new Phaser.Game(screen.width, screen.height, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update : update });

function preload() {

    var socket = io.connect('http://172.25.9.18:3000');

    socket.on('connect', function () {
        //socket.emit('teste', 'hi!');
        console.log('Conectado');
    });

    socket.on('teste', function(data){
        console.log('Recebido ', data);
        var detection =  data;
        //console.log(detection);

         // Pisca o olho direito
        body.blink('left', detection.olho_esquerdo);

        // Pisca o olho direito
        body.blink('right', detection.olho_direito);
    });

    //clearGameCache();
    game.load.atlasJSONHash('eye_scene', 'assets/eyescene.png', 'js/eyescene.json');

    //  The second parameter is the URL of the image (relative)
    game.load.image('eye', 'assets/eye.png');
    game.load.image('mouth', 'assets/mouth.png');

    game.stage.backgroundColor = "#FFFF00";
}

function clearGameCache () {
    if(!debug) return; 
    game.cache = new Phaser.Cache(game);
    game.load.reset();
    game.load.removeAll();
}

var cursors;

function create() {

    //console.log(bot);

    //	Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS);

    //  Make things a bit more bouncey
    game.physics.p2.defaultRestitution = 0.8;

    // Inicia o objeto
    body.bootstrap();

    // Anima os olhos
    tween.eye('left');
    tween.eye('right');
    
    // Anime the mouth
    tween.mouth();

    cursors = game.input.keyboard.createCursorKeys();
}

function updateFrame(obj, frame){
    //if(true) return;
    obj.frameName = frame;
}

function update(){

    if (cursors.left.isDown){
        // Pisca olho esquerdo
        body.blink('left', 1);
        // Pisca o olho direito
        body.blink('right', 1);
    }else if (cursors.right.isDown){
        // Pisca olho esquerdo
        body.blink('left', 0.1);
        // Pisca o olho direito
        body.blink('right', 0.1);
    }

    if (cursors.up.isDown)
    {
        // eye_right.body.moveUp(400);

        body.sad();
        
    }
    else if (cursors.down.isDown)
    {
        //eye.body.moveDown(400);
         body.happy();
    }
}