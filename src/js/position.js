/**
 * Flappy Pig
 * =======================================
 * @author Hernan Y.Ke
 */
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