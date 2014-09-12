/**
 * Flappy Pig
 * =======================================
 * @author Hernan Y.Ke
 */


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