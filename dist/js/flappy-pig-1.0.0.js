/**
 * Flappy Pig
 * =======================================
 * @author Hernan Y.Ke
 */

var flappy = (function (self) {
    'use strict';

    //Configuration
    self.option = {
        //gravity
        g: 400,
        //Initial speed
        v0: 400,
        //speed of pillar
        vp: 2.5,
        //fps, default 20ms
        frequency: 20,
        //number of levels
        levels: 100,
        //black distance
        safeLift: 500,

        //floorHeight
        floorHeight: 64,

        //width of pig picture
        pigWidth: 33,
        //height of pig picture
        pigHeight: 30,
        //current height
        pigY: 300,
        //distance of pig from left
        pigLeft: 80,

        //pillar Html
        pillarHtml: '<div class="top"></div><div class="bottom"></div>',
        //pillar width
        pillarWidth: 45,
        //pillar gap from up to down
        pillarGapY: 108,
        //pillar gap from left to right
        pillarGapX: 250,
        //up pillar base CSS
        pillarTop: -550,
        //down pillar base CSS
        pillarBottom: -500
    };

    return self;

})(flappy || {});


var flappy = (function (self) {
    'use strict';

    //utility
    self.util = {
        preventDefaultEvent: function (event) {
            event = window.event || event;
            if (event) {
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
            }
        },
        $: function (id) {
            return document.getElementById(id);
        },
        getChilds: function (obj) {
            var childs = obj.children || obj.childNodes,
                childsArray = [];
            for (var i = 0, len = childs.length; i < len; i++) {
                if (childs[i].nodeType == 1) {
                    childsArray.push(childs[i]);
                }
            }
            return childsArray;
        }
    };

    return self;

})(flappy || {});


var flappy = (function (self) {
    'use strict';

    var option = self.option,
        $ = self.util.$;

    //pig
    self.pig = {
        Y: 0, //current height of pig
        init: function (overCallback, controller) {
            var t = this;

            t.s = 0, //distance
            t.time = 0, //time
            t.$pig = $('pig');
            t.$pig.style.left = option.pigLeft + 'px';
            t._controller = controller;

            t._addListener(overCallback);
        },
        //add listener
        _addListener: function (overCallback) {
            this._overCallback = overCallback;
        },
        //start
        start: function () {
            var t = this,
                interval = option.frequency / 1000;

            t.s = option.v0 * t.time - t.time * t.time * option.g * 2; //v0*t-1/2*g*t^2
            if (t.Y >= option.floorHeight) {
                t.$pig.style.bottom = t.Y + 'px';
            } else {
                t._dead();
            }
            t.time += interval;
        },
        //jump
        jump: function () {
            var t = this;

            option.pigY = parseInt(t.$pig.style.bottom, 10);
            t.s = 0;
            t.time = 0;
        },
        //trigger when hit the ground
        _dead: function () {
            this._overCallback.call(this._controller);
        },
        //hit the ground
        fall: function () {
            var t = this;

            //fall down, so amend the height
            t.Y = option.floorHeight;
            t.$pig.style.bottom = t.Y + 'px';
        },
        //When hit the pillar
        hit: function () {
            var t = this;

            //fall down
            var timer = setInterval(function () {
                t.$pig.style.bottom = t.Y + 'px';
                if (t.Y <= option.floorHeight) {
                    clearInterval(timer);
                }
                t.Y -= 12;
            }, option.frequency);
        }
    };

    return self;

})(flappy || {});

var flappy = (function (self) {
    'use strict';

    var option = self.option,
        util = self.util,
        $ = util.$;

    //pillar
    self.pillar = {
        currentId: -1, //current pillar id
        init: function () {
            var t = this;

            //convert to CSS
            t._factor = option.pillarBottom - option.pillarGapY + 450;
            //"sensor"
            t._s = option.pigLeft + option.pigWidth + 10;

            t._render();
        },
        //draw pillar via DOM
        _render: function () {
            var t = this,
                initleft = option.safeLift;

            t.left = 0;
            t.dom = document.createElement('div');

            t.dom.className = t.dom.id = 'pillarWrapper';
            for (var i = 0, j = option.levels; i < j; i++) {
                var el = document.createElement('div');

                el.innerHTML = option.pillarHtml;
                el.className = 'pillar';
                el.id = 'pillar-' + i;
                el.style.left = initleft + 'px';

                var childs = util.getChilds(el),
                    topEl = childs[0],
                    bottomEl = childs[1],
                    pos = t._random(i);

                topEl.style.top = pos.top + 'px';
                bottomEl.style.bottom = pos.bottom + 'px';

                el.setAttribute('top', 600 + pos.top);
                el.setAttribute('bottom', 0 - pos.bottom);

                t.dom.appendChild(el);
                initleft += option.pillarGapX;
            }
            $('screen').appendChild(t.dom);
        },
        //calculate location of pillar
        _random: function (i) {
            var t = this,
                x = Math.random(),
                h = Math.abs(Math.sin((i+1) * x)) * 290;
            
            return {
                top: option.pillarTop + h,
                bottom: t._factor - h
            };
        },
        //move pillar
        move: function () {
            var t = this;

            t.dom.style.left = -t.left + 'px';
            t._find(t.left);

            t.left += option.vp;
        },
        //find current pillar
        _find: function (l) {
            var t = this,
                x = (t._s + l - option.safeLift) / option.pillarGapX,
                intX = parseInt(x,10); //intX s current pillar
            if (x > 0 && t.currentId != intX && Math.abs(x - intX) < 0.1) {
                t.currentId = intX;
            }
        }
    };

    return self;

})(flappy || {});

var flappy = (function (self) {
    'use strict';

    var pig = self.pig,
        pillar = self.pillar,
        option = self.option,
        $ = self.util.$;

    //judge position
    self.position = {
        init: function (overCallback, controller) {
            var t = this;

            t.pillarWrapper = $('pillarWrapper');
            
            t.pigX1 = option.pigLeft,
            t.pigX2 = option.pigLeft + option.pigWidth, //pig position. (fixed)

            t._controller = controller;
            t._addListener(overCallback);
        },
        //addListener
        _addListener: function (overCallback) {
            this._overCallback = overCallback;
        },
        judge: function () {
            var t = this,
                currentPillar = $('pillar-' + pillar.currentId);

            if (pillar.currentId == -1) {
                return;
            }

            t.pigY2 = 600 - pig.Y;
            t.pigY1 = t.pigY2 - option.pigHeight; //position of pig
            t.pY1 = currentPillar.getAttribute('top');
            t.pY2 = currentPillar.getAttribute('bottom');
            t.pX1 = parseInt(currentPillar.style.left,10) + parseInt(t.pillarWrapper.style.left,10);
            t.pX2 = t.pX1 + option.pillarWidth; //position of pillar

            if (option.pigLeft + option.pigWidth >= t.pX1 && option.pigLeft <= t.pX2) {
                if (t.pigY1 < t.pY1 || t.pigY2 > t.pY2) {
                    t._dead();
                }
            }
        },
        //dead.......
        _dead: function () {
            this._overCallback.call(this._controller);
        }
    };

    return self;

})(flappy || {});

var flappy = (function (self) {
    'use strict';

    var pig = self.pig,
        pillar = self.pillar,
        pos = self.position,
        util = self.util,
        $ = util.$,
        option = self.option;

    //Controller
    self.controller = {
        init: function () {
            var t = this;

            t._isStart = false;
            t._timer = null;

            pig.init(t.fall, t);
            pillar.init();
            pos.init(t.hit, t);

            t.addKeyListener();
        },
        addKeyListener: function () {
            var t = this;
            document.onkeydown = function (e) {
                e = e || event;
                var currKey = e.keyCode || e.which || e.charCode;
                if (currKey == 32) {
                    t.jump();
                    util.preventDefaultEvent(e);
                }
            };
        },
        jump: function () {
            var t = this;
            if (!t._isStart) {
                $('begin').style.display = 'none';
                t._createTimer(function () {
                    pig.start();
                    pillar.move();
                    pos.judge();
                    $('score').innerHTML = pillar.currentId + 1;
                });
                t._isStart = true;
            } else {
                pig.jump();
            }
        },
        hit: function () {
            var t = this;
            
            t.over();
            pig.hit();
        },
        fall: function () {
            var t = this;
            
            t.over();
            pig.fall();
        },
        over: function () {
            var t = this;
            clearInterval(t._timer);
            $('end').style.display = 'block';
        },
        _createTimer: function (fn) {
            var t = this;

            t._timer = setInterval(fn, option.frequency);
        }
    };

    return self;

})(flappy || {});

var flappy = (function (self) {
    'use strict';

    var controller = self.controller,
        option = self.option,
        pig = self.pig,
        pillar = self.pillar,
        pos = self.position,
        util = self.util,
        $ = self.util.$;

    //Main Program
    self.game = {
        init: function () {
            var t = this;

            t._isStart = false;
            t._isEnd = false;
            t._timer = null;

            pig.init(t.fall, t);
            pillar.init();
            pos.init(t.hit, t);

            t.addKeyListener();
        },
        addKeyListener: function () {
            var t = this;
            document.onkeydown = function (e) {
                e = e || event;
                var currKey = e.keyCode || e.which || e.charCode;
                if (currKey == 32) {
                    if (!t._isEnd) {
                        t.jump();
                    } else {
                        window.location.reload();
                    }
                    util.preventDefaultEvent(e);
                }
            };
        },
        jump: function () {
            var t = this;
            if (!t._isStart) {
                $('start').style.display = 'none';
                t._createTimer(function () {
                    pig.start();
                    pillar.move();
                    pos.judge();
                    $('score').innerHTML = pillar.currentId + 1;
                });
                t._isStart = true;
            } else {
                pig.jump();
            }
        },
        hit: function () {
            var t = this;

            t.over();
            pig.hit();
        },
        fall: function () {
            var t = this;

            t.over();
            pig.fall();
        },
        over: function () {
            var t = this;
            clearInterval(t._timer);
            t._isEnd = true;
            $('end').style.display = 'block';
        },
        _createTimer: function (fn) {
            var t = this;

            t._timer = setInterval(fn, option.frequency);
        }
    };

    flappy.init = function () {
        self.game.init();
    };

    return self;

})(flappy || {});