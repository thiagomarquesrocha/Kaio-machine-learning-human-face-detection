var debug = true;
var pause_test = false;
var cursors;
var MAX_TEST = 200;
var FEEL = 2; // Muito feliz 
var text;
var DELAY_MSG = false;
// 172.25.9.96
var SERVER = '192.168.1.114';

var storage = (function(){
    var _data = [];
    var _index;
    var _user = 1;
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
        //var new_data = shuffle(_data);
        var new_data = _data;
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

        var ordened = ['rate_blink_left', 'rate_blink_right', 'rate_smile_or_not'];

        _new_data = [];
        
        _new_data.unshift(_user);

        // Traduz o mapa de valores para um array
        for(var key in ordened){
            var value = _new_data_map[ordened[key]];
            _new_data.push((value)? value : 0);
        }

        // Adiciona o sentimento 
        _new_data.push(FEEL);
        
        console.log('Adicionando - ', _new_data);
        
        // Adiciona o array dentro da lista
        _data.push(_new_data);
        // Incrementa o indice do ultimo salvo
        _index++;

        if(_index > MAX_TEST){
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
            }else if(label == 'test'){
                setTest(value);
            }else if(label == 'feel'){
                setFeel(value);
            }
        }
    }

    function setFeel(value){
        switch (value) {
            case 'sad':
                FEEL = 0;
                break;
            case 'angry':
                FEEL = 1;
                break;
            default: // happy
                FEEL = 2;
                break;
        }
        //FEEL = value;
    }

    function setTest(value){
        MAX_TEST = parseInt(value);
    }

    function setUser(value){
        _user = parseInt(value);
    }

    function getData(){
        return _data;
    }

    function isTestFinished(){
        if(pause_test){
            show_msg("O kaio aprendeu sobre vc!");
            console.warn("Teste finalizado, confira o resultado!!!");
            return true;
        }
        return false;
    }

    function save_whois(predict){
        if(isTestFinished()){
            var gestures = '';
            var new_data = getData();
            for(var key in new_data){
                gestures += new_data[key].join() + "|";
            }
            //console.log(gestures);
            // Salva os dados aprendidos
            $.ajax({
                method: "GET",
                url: "http://"+SERVER+":3000/analysis/save/whois/",
                data: { whois: gestures, predict : predict }
            })
            .done(function( msg ) {
                console.log( "Data Saved: ", msg );
                // Tentar prever quem eh o usuario
                $.ajax({
                    method: "GET",
                    url: "http://"+SERVER+":3000/analysis/predict/",
                    data: {  }
                })
                .done(function( data ) {
                    console.log( "Data Saved: ", data.msg );
                    show_msg(data.msg);
                    body.show_emotion(data.emotion);
                    DELAY_MSG = true;
                    setTimeout(function(){
                        DELAY_MSG = false;
                        body.hide_emotion(data.emotion);
                    }, 2000);
                });
            });
            return true;
        }

        return false;
    }

    function save_data(){
        recovery();
        var gestures = '';
        var new_data = getData();
        for(var key in new_data){
            gestures += new_data[key].join() + "|";
        }
        $.ajax({
            method: "GET",
            url: "http://"+SERVER+":3000/analysis/save/data",
            data: { data : gestures }
        })
        .done(function( msg ) {
            console.log( "Data Saved: ", msg );
            show_msg(msg);
            DELAY_MSG = true;
            setTimeout(function(){
                DELAY_MSG = false;
            }, 2000);
        });
    }

    return{
        save_data : save_data,
        isTestFinished : isTestFinished,
        save_whois : save_whois,
        getData : getData,
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
    // Objeto de animacao para guardar o estado de normalizacao
    var animation; 

    function preload(){
        //  There are 18 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
        //  blank frames at the end, so we tell the loader how many to load
        game.load.atlas('idle', '/static/analysis/assets/idle.png', '/static/analysis/js/idle.json');
        game.load.atlas('smile', '/static/analysis/assets/smile.png', '/static/analysis/js/smile.json');
        game.load.atlas('sad', '/static/analysis/assets/sad.png', '/static/analysis/js/sad.json');
        game.load.image('state_sad', '/static/analysis/assets/state_sad.png');
        game.load.image('state_angry', '/static/analysis/assets/state_angry.png');
        game.load.image('state_happy', '/static/analysis/assets/state_happy.png');
        game.load.image('blink_left', '/static/analysis/assets/blink_left.png');
        game.load.image('blink_right', '/static/analysis/assets/blink_right.png');
        game.load.image('blink', '/static/analysis/assets/blink.png');
    }

    function bootstrap(){
        var x = game.world.centerX - 78;
        var y = game.world.centerY - 98;
        var idle = create_state_animated('idle', x, y);
        var blink = create_state_static('blink', x, y);
        var blink_left = create_state_static('blink_left', x, y);
        var blink_right = create_state_static('blink_right', x, y);
        var smile = create_state_animated('smile', x, y);
        var sad = create_state_animated('sad', x, y);
        var state_sad = create_state_static('state_sad', x, y);
        var state_angry = create_state_static('state_angry', x, y);
        var state_happy = create_state_static('state_happy', x, y);
        smile.show();
        smile.play();
        smile.hide();
        sad.show();
        sad.play();
        sad.hide();
        idle.show();
        idle.play();
    }

    function play(action, name){
        //  30 is the frame rate (30fps)
        //  true means it will loop when it finishes
        action.animations.play(name, 30, true);
    }

    function create_state_static(state, x, y){
        var obj = game.add.image(x, y, state);
        _state[state] = {
            "state" : obj,
            "show" : function(){
                obj.alpha = 1;
            },
            "hide" : function(){
                obj.alpha = 0;
            }
        };

        _state[state].hide();

        if(debug)
            console.log('Created '+state+' state');

        return _state[state];
    }

    function create_state_animated(state, x, y){
        var obj = game.add.sprite(x, y, state);
        //  Here we add a new animation called 'state'
        //  Because we didn't give any other parameters it's going to make an animation from all available frames in the state sprite sheet
        var action = obj.animations.add(state);

        _state[state] = {
            "action" : action,
            "state" : obj,
            "play" : function(){
                play(obj, state)
            },
            "show" : function(){
                obj.alpha = 1;
            },
            "hide" : function(){
                obj.alpha = 0;
            }
        };

        _state[state].hide();

        if(debug)
            console.log('Created '+state+' state');

        return _state[state];
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
            body.sad();
        }else if(value > 0.4){
            body.happy();
        }
    }

    function normalize_value(value){
        if( typeof value == 'string' )
            value = parseFloat(value.replace(',', '.'));

        value = (value < 0)? 1 : value;
        return value;    
    }

    function what_eye_blink(what_eye, left, right){
        if(what_eye == 'both'){
            _state.blink.right = true;
            _state.blink.left = true;
            clear_animation();
            _state.idle.hide();
            _state.blink.show();
        }else if( what_eye == 'left' ){
            _state.blink.right = false;
            _state.blink.left = true;
            clear_animation();
            _state.idle.hide();
            _state.blink_left.show();

            // console.log('Piscando o olho esquerdo');
        }else if( what_eye == 'right'){
            _state.blink.right = true;
            _state.blink.left = false;
            clear_animation();
            _state.idle.hide();
            _state.blink_right.show();

            // console.log('Piscando o olho direito');
        }

        // Salva a taxa em tempo real da probabilidade de olho esta piscando
        storage.add('rate_blink_left', left);
         // Salva a taxa em tempo real da probabilidade de olho esta piscando
        storage.add('rate_blink_right', right);

        return what_eye;
    }

    function blink(left, right){

        left = normalize_value(left);
        right = normalize_value(right);

        //console.log(left, right);

        var what_eye = '';

        if(left < 0.5 && right < 0.5){ // Piscou os dois olhos
            what_eye = what_eye_blink('both', left, right);
        }else if(left < 0.5 && right >= 0.5){ // Piscou o olho esquerdo
            what_eye = what_eye_blink('left', left, right);
        }else if(right < 0.5 && left >= 0.5){ // Piscou o olho direito
            what_eye = what_eye_blink('right', left, right);
        }else{ // Os olhos permanecem abertos
            what_eye = what_eye_blink('normal', left, right);
        }

        has_animation();

        //console.log(left);
    }

    function has_animation(){
        if(animation != null)
            clearTimeout(animation);

        animation = setTimeout(clear_animation, 100);
    }

    function clear_animation(){
        _state.blink.hide();
        _state.blink_left.hide();
        _state.blink_right.hide();
        _state.smile.hide();
        _state.sad.hide();
        _state.idle.show();
    }

    function smile_or_not(value){

        if( typeof value == 'string' )
            value = parseFloat(value.replace(',', '.'));

        value = (value < 0)? 0 : value;

        storage.add('rate_smile_or_not', value);

        if(value > 0.25){
            happy();
        }else{
            has_animation();
        }
    }

    function sad(){
        clear_animation();
        _state.idle.hide();
        _state.sad.show();
        has_animation();
    }

    function happy(){
         clear_animation();
        _state.idle.hide();
        _state.smile.show();
        has_animation();
    }

    function show_emotion(emotion){

        clear_animation();
        _state.idle.hide();

        switch (emotion) {
            case 0:
                _state.state_sad.show();
                break;
            case 1:
                _state.state_angry.show();
                break;
            default:
                _state.state_happy.show();
                break;
        }
    }

    function hide_emotion(emotion){
        switch (emotion) {
            case 0:
                _state.state_sad.hide();
                break;
            case 1:
                _state.state_angry.hide();
                break;
            default:
                _state.state_happy.hide();
                break;
        }

        clear_animation();
    }
    
    return{
        preload : preload,
        bootstrap : bootstrap,
        state : _state,
        eye : _eye,
        getMouth : getMouth,
        blink : blink,
        sad : sad,
        happy : happy,
        smile_or_not : smile_or_not,
        show_emotion : show_emotion,
        hide_emotion : hide_emotion
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
        // if(true) return;
        var socket = io.connect('http://'+SERVER+':8000');

        socket.on('connect', function () {
            //socket.emit('teste', 'hi!');
            console.log('Conectado');

            socket.on('gesture', gesture);
        });

        socket.on('disconnect', function(){
            console.log('Desconectou');
        });
    }

    function gesture(data){

        if( storage.isTestFinished() ) return;

        console.log('Gesture', data);

        show_msg("O Kaio está aprendendo seus movimentos...");

        // Inicia o processo de armazenamento de eventos
        storage.new_data();
        
        blink(data);
        smile(data);

        // Salva a nova ocorrencia de eventos
        storage.save_new_data();
    }

    function smile(detection){
        console.log(detection);

        body.smile_or_not(detection.mouth);
    }

    function blink(data){
        console.log('Recebido ', data);
        var detection =  data;
        //console.log(detection);

        // Pisca o olho direito e esquerdo
        body.blink(detection.left, detection.right);
    }

    return{
        bootstrap : bootstrap
    }
})();

function preload() {

    // Inicia a conexao com o servidor
    server.bootstrap();

    // Preload body
    body.preload();

    //clearGameCache();

    game.stage.backgroundColor = "#000000";
}

function clearGameCache () {
    if(!debug) return; 
    game.cache = new Phaser.Cache(game);
    game.load.reset();
    game.load.removeAll();
}

function create() {

    //console.log(bot);

    text = game.add.text(game.world.centerX, game.world.centerY - 200, "Você parece ser o %s", { font: "65px Arial", fill: "#ffff00", align: "center" });

    text.anchor.set(0.5);
    text.alpha = 0;

    //	Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS);

    //  Make things a bit more bouncey
    game.physics.p2.defaultRestitution = 0.8;

    cursors = game.input.keyboard.createCursorKeys();

    game.input.keyboard.onDownCallback = function() {
        // console.log(game.input.keyboard.event.keyCode);
        var code = game.input.keyboard.event.keyCode;
        switch(code){
            case 67: // C - Limpa os dados aprendidos
                localStorage.clear();
                location.reload();
                break;
            case 65: // A - Salvar os dados de aprendizagem
                storage.save();
                storage.save_data();
                break;
            case 49 : case 50: // Number 1 or 2 - Save unknown user to predict the feeling
                /**
                 * Keyboard
                 *  49 - number 1 ( send predict 1 )
                 *  50 - number 2 ( send predict 0 )
                 */
                // save_whois(predict) where predict values is:
                // 0 - create whois.csv and add the new lines at the end of csv file
                // 1 - create predict.csv rewriting the existing file if he was created
                storage.save_whois((code == 49)? 1 : 0);
                break;
            case 45 : // 0 and Ins - Pisca ambos os olhos
                // Pisca olho esquerdo e direito
                body.blink(random(0, 0.49), random(0, 0.49));
                break;
            case 13 : // Enter - Salva os dados de aprendizagem no storage do navegador (local)
                // Salva todas as ocorrencias
                storage.save();
                break;
            case 77 : // M - Mostra os dados armazenados localmente 
                // Mostra todos os registros encontrados
                storage.read();
                break;
        }       
    };

    // Inicia o objeto
    body.bootstrap();
}

function show_msg(msg){
    if(DELAY_MSG) return;
    text.text = msg;
    text.alpha = 1;
}

function hide_msg(){
    text.alpha = 0;
}

function updateFrame(obj, frame){
    //if(true) return;
    obj.frameName = frame;
}

function random(min, max){
    min = parseFloat(min);
    max = parseFloat(max);
    // console.log(min, max);
    return Math.random()*(max-min)+min;
}

function update(){
    if(!cursors) return;

    if( storage.isTestFinished() ) return;

    show_msg("O Kaio está aprendendo seus movimentos...");

    // Inicia o processo de armazenamento de eventos
    storage.new_data();

    if (cursors.left.isDown){
       // Pisca olho esquerdo
       body.blink(random(0, 0.49), random(0.5, 1));
    }else if (cursors.right.isDown){
       // Pisca olho esquerdo
       body.blink(random(0.5, 1), random(0, 0.49));
    }

    if (cursors.up.isDown){
        body.smile_or_not(random(0.25, 1));
    }else if (cursors.down.isDown){
        body.smile_or_not(random(0, 0.24));
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
