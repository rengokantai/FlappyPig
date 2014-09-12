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