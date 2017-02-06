var debug = true;
var pause_test = false;
var cursors;

var storage = (function(){
    var _data = [];
    var _index;
    var _new_data_map, _new_data;

    function recovery(){
        _data = [];
        var total = parseInt(localStorage.total_registros);
        _index = total = (isNaN(total))? 0 : total;
        for(var i = 0; i<total; i++){
            var test = localStorage.getItem('test_' + i);
            _data[i] = test.split(',');
        }

        return _data;
    }

    function read(){
        var text = '';
        var new_data = shuffle(_data);
        for(var key in new_data){
           text += new_data[key].join() + "\n";
        }
        console.log(text);
    }

    function new_data(){
        _new_data_map = {};
        return this;
    }

    function add(label, value){
        if(!_new_data_map){
            console.error('O mapa ainda nao foi iniciado { _new_data_map = {} }');
            return;
        }
        _new_data_map[label] = value;
    }

    function save_new_data(){
        if(!_user){
            console.error('Nenhum usuario detectado { ?user=x }');
            return;
        }

        var hasEnought = Object.keys(_new_data_map).length;

        if(!hasEnought) return;

        console.log(hasEnought, _new_data_map);

        var ordened = ['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not', 'blink_left', 'blink_right', 'smile_or_not'];

        _new_data = [];
        
        _new_data.unshift(_user);

        // Traduz o mapa de valores para um array
        for(var key in ordened){
            var value = _new_data_map[ordened[key]];
            _new_data.push((value)? value : 0);
        }
        
        console.log('Adicionando - ', _new_data);
        
        // Adiciona o array dentro da lista
        _data.push(_new_data);
        // Incrementa o indice do ultimo salvo
        _index++;

        if(_index > 199){
            pause_test = true;
        }
    }

    function save(){
        if(_index <= 0){
            console.error('Nenhum indice registrado { _index = NaN | 0 }');
            return;
        }
        for(var i = 0; i<_index; i++){
            var test = _data[i].join();
            localStorage.setItem('test_' + i, test); 
        }
        _new_data = [];
        _new_data_map = {};
        localStorage.setItem('total_registros', _index);
        console.log('Dados armazenados');
    }

    function check_url_parameter(){
        console.log(location);
        var search = location.search.substring(1);
        var v = search.split('&');
        for(var i in v){
            var param = v[i].split('=');
            var label = param[0];
            var value = param[1];
            if(label == 'user'){
               setUser(value);
            }
        }
    }

    function setUser(value){
        _user = parseInt(value);
    }

    return{
        recovery : recovery,
        read : read,
        new_data : new_data,
        add : add,
        save_new_data : save_new_data,
        save : save,
        check_url_parameter : check_url_parameter
    }
})();

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

    function smile(value){
        if( typeof value == 'string' )
            value = parseFloat(value.replace(',', '.'));

        value = (value < 0)? 0 : value;

        storage.add('rate_smile_or_not', value);
        
        if(value < 0.4 && value > 0){
            body.sad(value);
        }else if(value > 0.4){
            body.happy(value);
        }
    }

    function blink(what_eye, value){

        if( typeof value == 'string' )
            value = parseFloat(value.replace(',', '.'));

        var eye_selected = (what_eye != 'left')? _eye.right : _eye.left;

        value = (value < 0)? 0 : value;

        if( what_eye == 'left' ){
            _state.blink.right = true;
            _state.blink.left = false;
            // Salva a taxa em tempo real da probabilidade de olho esta piscando
            storage.add('rate_blink_left', value);
        }else{
            _state.blink.right = false;
            _state.blink.left = true;
            // Salva a taxa em tempo real da probabilidade de olho esta piscando
            storage.add('rate_blink_right', value);
        }

        // Piscou o olho
        if(value < 0.5 && value > 0){
            updateFrame(eye_selected, eye_selected.frames.end);
            // Salva a ocorrencia de piscar o olho direito ou esquerdo
            storage.add('blink_' + what_eye, 1);
            //storage.add('blink_right', (what_eye == 'right')? 1 : 0);
        }else if(value > 0.5){ // Nao piscou
            updateFrame(eye_selected, eye_selected.frames.begin);
            // Salva a ocorrencia de piscar o olho direito ou esquerdo
            storage.add('blink_' + what_eye, 0);
            //storage.add('blink_right', (what_eye == 'right')? 0 : 1);   
        }

        //console.log(value);
    }

    function sad(value){
        _mouth.anchor.setTo(0.4);
        _mouth.angle = 180;
        storage.add('smile_or_not', 0);
        storage.add('rate_smile_or_not', value);
    }

    function happy(value){
        _mouth.anchor.setTo(0.6);
        _mouth.angle = 0;
        storage.add('smile_or_not', 1);
        storage.add('rate_smile_or_not', value);
    }
    
    return{
        bootstrap : bootstrap,
        state : _state,
        eye : _eye,
        getMouth : getMouth,
        blink : blink,
        sad : sad,
        happy : happy,
        smile : smile
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

var server = (function(){
    function bootstrap(){
        var socket = io.connect('http://172.25.9.18:3000');

        socket.on('connect', function () {
            //socket.emit('teste', 'hi!');
            console.log('Conectado');

            socket.on('gesture', gesture);
        });

        socket.on('disconnect', function(){
            console.log('Desconectou');
        });

        //socket.on('blink', blink);

        //socket.on('smile', smile);
    }

    function gesture(data){

        if(pause_test){
            console.warn("Teste finalizado, confira o resultado!!!");
            return;
        }
        

        // Inicia o processo de armazenamento de eventos
        storage.new_data();
        
        smile(data);
        blink(data);

        // Salva a nova ocorrencia de eventos
        storage.save_new_data();
    }

    function smile(detection){
        console.log(detection);

        body.smile(detection.mouth);
    }

    function blink(data){
        console.log('Recebido ', data);
        var detection =  data;
        //console.log(detection);

        // Pisca o olho direito
        body.blink('left', detection.left);

        // Pisca o olho direito
        body.blink('right', detection.right);
    }

    return{
        bootstrap : bootstrap
    }
})();

function preload() {

    // Inicia a conexao com o servidor
    server.bootstrap();

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

    game.input.keyboard.onDownCallback = function() {
        //console.log(game.input.keyboard.event.keyCode);
        var code = game.input.keyboard.event.keyCode;
        switch(code){
            case 13 : // Enter
                // Salva todas as ocorrencias
                storage.save();
                break;
            case 77 : // Tecla M
                // Mostra todos os registros encontrados
                storage.read();
                break;
        }       
    };
}

function updateFrame(obj, frame){
    //if(true) return;
    obj.frameName = frame;
}

function random(min, max){
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.random()*(max-min+1.0)+min;
}

function update(){

    // Inicia o processo de armazenamento de eventos
    storage.new_data();

    if (cursors.left.isDown){
        // Pisca olho esquerdo
        body.blink('left', random(0.5, 1));
        // Pisca o olho direito
        body.blink('right', random(0.5, 1));
    }else if (cursors.right.isDown){
        // Pisca olho esquerdo
        body.blink('left', random(0, 0.49));
        // Pisca o olho direito
        body.blink('right', random(0, 0.49));
    }

    if (cursors.up.isDown){
        body.sad(random(0.2, 1));
    }else if (cursors.down.isDown){
        body.happy(random(0, 0.19));
    }

    // Salva a nova ocorrencia de eventos
    storage.save_new_data();
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Recupera os dados de testes armazenados
storage.recovery();
// Ler e mostra os dados armazenados
storage.read();
// Interpreta os parametros passados pela URL
storage.check_url_parameter();
// Inicia o game
var game = new Phaser.Game(screen.width, screen.height, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update : update });
