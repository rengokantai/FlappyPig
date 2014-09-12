/**
 * Flappy Pig
 * =======================================
 * @author Hernan Y.Ke
 */

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