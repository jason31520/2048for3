/**
 * Created by Jason on 2017/3/7.
 * @param container The game container
 */
function gameBox(container) {
    this.container = container;
    this.tiles = new Array(9);
}

gameBox.prototype = {
    init: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            var tile = this.newTile(0);
            tile.setAttribute('index', i);
            this.container.appendChild(tile);
            this.tiles[i] = tile;
        }
        this.randomTile();
        this.randomTile();
    },
    newTile: function(val){
        var tile = document.createElement('div');
        this.setTileVal(tile, val);
        return tile;
    },
    setTileVal: function(tile, val){
        tile.className = 'tile tile' + val;
        tile.setAttribute('val', val);
        tile.innerHTML = val > 0 ? val : '';
    },
    randomTile: function(){
        var zeroTiles = [];
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 0){
                zeroTiles.push(this.tiles[i]);
            }
        }
        var rTile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];
        this.setTileVal(rTile, Math.random() < 0.8 ? 2 : 4);
    },
    move:function(direction){
        var j;
        switch(direction){
            case 38://Up
                for(var i = 3, len = this.tiles.length; i < len; i++){
                    j = i;
                    while(j >= 3){
                        this.merge(this.tiles[j - 3], this.tiles[j]);
                        j -= 3;
                    }
                }
                break;
            case 40://Left
                for(var i = 5; i >= 0; i--){
                    j = i;
                    while(j <= 5){
                        this.merge(this.tiles[j + 3], this.tiles[j]);
                        j += 3;
                    }
                }
                break;
            case 37://Down
                for(var i = 1, len = this.tiles.length; i < len; i++){
                    j = i;
                    while(j % 3 != 0){
                        this.merge(this.tiles[j - 1], this.tiles[j]);
                        j -= 1;
                    }
                }
                break;
            case 39://Right
                for(var i = 7; i >= 0; i--){
                    j = i;
                    while(j % 3 != 2){
                        this.merge(this.tiles[j + 1], this.tiles[j]);
                        j += 1;
                    }
                }
                break;
        }
        this.randomTile();
    },
    merge: function(prevTile, currTile){
        var prevVal = prevTile.getAttribute('val');
        var currVal = currTile.getAttribute('val');
        if(currVal != 0){
            if(prevVal == 0){
                this.setTileVal(prevTile, currVal);
                this.setTileVal(currTile, 0);
            }
            else if(prevVal == currVal){
                this.setTileVal(prevTile, prevVal * 2);
                this.setTileVal(currTile, 0);
            }
        }
    },
    equal: function(tile1, tile2){
        return tile1.getAttribute('val') == tile2.getAttribute('val');
    },
    max: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 512){
                return true;
            }
        }
    },
    over: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 0){
                return false;
            }
            if(i % 3 != 2){
                if(this.equal(this.tiles[i], this.tiles[i + 1])){
                    return false;
                }
            }
            if(i < 6){
                if(this.equal(this.tiles[i], this.tiles[i + 3])){
                    return false;
                }
            }
        }
        return true;
    },
    clean: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            this.container.removeChild(this.tiles[i]);
        }
        this.tiles = new Array(9);
    }
};
/*
* Get keyNum of all browsers
* */
function crossKeyNum(e){
    //return keyNumber of key press
    var keyNum;
    if(window.event){ // IE
        keyNum = e.keyCode;
    }
    else if(e.which){  // Netscape/Firefox/Opera
        keyNum = e.which;
    }
    return keyNum;
}
/*
* A timer with describes
* @param preStr:describes of the timer
* @param obj:where to put the timer
* */
function timer(preStr,obj){
    var time = 0;
    var timer = setInterval(function timer(){
        obj.innerHTML = preStr+(++time)+"s";
    },1000);
    clearInterval(timer);
}

//variables declaration
var game, startBtn;
var isBegin = false;
var gameTimer;

window.onload = function(){
    var container = document.getElementById("container");
    startBtn = document.querySelector("#start");
    gameTimer = document.querySelector("#timer-place");
    window.onclick = function(){
        if(!isBegin){
            isBegin = true;
            startBtn.style.display = "none";
            game = game || new gameBox(container);
            game.init();
            timer("Total time:",gameTimer);
        }

    };
};

window.onkeydown = function(e){
    var keyNum = crossKeyNum(e);
    if([38, 37, 40, 39].indexOf(keyNum) > -1){
        if(game.over()){
            game.clean();
            startBtn.style.display = "block";
            startBtn.innerHTML = "Click to reply?";
            isBegin = false;
            gameTimer.innerHTML = "";
            return;
        }
        game.move(keyNum);
    }
};
window.onkeyup = function(e){
    if(game.max()){
        alert("恭喜你，完成挑战，是否继续？");
    }
};