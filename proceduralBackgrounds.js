/* Van-Andrew Nguyen 

This script draws multiple backgrounds on-screen. Each background can be cycled through with left mouse.
Each background focuses on a new drawing method from the p5.js drawing library; lines, circles, triangles. 
As on par with my other experiments; these backgrounds can be manipulated with user audio input. */

// Declare canvas Variables
let cnv;
let canvasWidth = 500; let canvasHeight = 500;

// Declare scrolling Variables
let index = 0;
let indexMax = 6;

// Declare audio Variables
let mic;
let micLevel = 0;
let micLevelTarget;

function setup() {
    cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.mousePressed();

    // Begin audio input
    mic = new p5.AudioIn();
    mic.start();
}

function draw() {

    // Target audio levels
    micLevelTarget = mic.getLevel();
    micLevel = lerp(micLevel, micLevelTarget, 0.05);

    // Here we're using a switch case to cycle between the different backgrounds
    switch (index) {
        case 0: // Base circle pattern
            /*
            This background uses white circles to 'cut out' holes within the coloured circles. 
            This creates a nice, patterned effect. 
            */
            background(255);
            noStroke();
            // Set local variables
            var height = 20; 
            var width = 20;
            var numH = canvasHeight / height;
            var numW = canvasWidth / width;
            // Start looping through each point on the canvas
            for (var i = 0; i < numW; i++) {
                for (var k = 0; k < numH; k++) {
                    // Use modulo to determine every 2nd circle to be white vs coloured
                    if (i % 2 == 0 && k % 2 == 0) {
                        fill(255 - k * 8, 80 + 20 * sin(frameCount / 32), 80 + i * 2);
                    } else {
                        fill(255);
                    }
                    // Finally draw the circle with (sadly) a bunch of magic numbers.
                    var xx = i * width + (micLevel * 400 + 4) * sin(micLevel * 10 + i * 2 - k + frameCount / 32);
                    var yy = k * width + (micLevel * 400 + 4) * sin(micLevel * 10 + k * 2 - i + frameCount / 32);
                    circle(xx, yy, width + 4 * sin(i * k + frameCount / 48));
                }
            }
            stroke(255);
            break;
        case 1: // Base Circle Pattern
            /*
            This backgrounds builds on the previous technique. However there is a greater emphasis on white circles.
            These white circles are offset to 'cut-out' more holes; creating semi-circles and hollow circles.
            */
            background(255);
            noStroke();
            // Set local variables
            var height = 20; var width = 20;
            var numH = canvasHeight / height;
            var numW = canvasWidth / width;
            // Start looping through points
            for (var i = 0; i < numW; i++) {
                for (var k = 0; k < numH; k++) {
                    // This time because white vs coloured circles draw different things, we can't combine the
                    // two and simply set coords within the if statements. So we draw them seperately.
                    if (i % 2 == 0 && k % 2 == 0) {
                        fill(69 + k * 2 + micLevel * 600, 220 - micLevel * 1500, 61 + i * 4 + micLevel * 1200);
                        var xx = i * width + 6 * sin(micLevel * 12 + i * 2 - k + frameCount / 32);
                        var yy = k * width + 6 * sin(micLevel * 12 + k * 2 - i + frameCount / 32);
                        circle(xx, yy, width + 4 * sin(i * k + frameCount / 48));
                        fill(255)
                        circle(xx, yy, width - (4 + micLevel * 500) + 4 * sin(i * k + 90 + frameCount / 32));
                    } else {
                        fill(255);
                        var xx = i * width + 6 * sin(micLevel * 12 + i * 2 - k + frameCount / 32);
                        var yy = k * width + 6 * sin(micLevel * 12 + k * 2 - i + frameCount / 32);
                        circle(xx, yy, width + 4 * sin(i * k + frameCount / 48));
                    }

                }
            }
            stroke(255);
            break;
        case 2: // Waterfall Pattern
            /*
            Pretty neat pattern; I draw larger circles which unlike case 1/2, now overlap each other. 
            By just using modulo on the x values, we get vertical stripes of points. By staggering them we get wave shapes.
            Afterwards, we can exaggerate these offsets to get a nice wave shape.
            */
            background(255);
            noStroke();
            // Set local variables
            var height = 20; var width = 20;
            var numH = canvasHeight / height;
            var numW = canvasWidth / width;
            // Loop through points
            for (var i = 0; i < numW; i++) {
                for (var k = 0; k < numH; k++) {
                    if (i % 2 == 0 && k % 1 == 0) {
                        fill(39 + i * 4 + micLevel * 2500, 200, 200 + k - micLevel * 500);
                    } else {
                        fill(255);
                    }
                    // Set the frequency but lock it
                    var freq1 = 24 - micLevel * 200;
                    var freq2 = 32 - micLevel * 200;
                    freq1 = constrain(freq1, 12, 24);
                    freq2 = constrain(freq2, 12, 32);
                    // Then finally draw the ellipse, not circle
                    var xx = i * width + 4 * sin(micLevel * 200 + i * 4 - k + frameCount / freq1);
                    var yy = k * width + 4 * sin(micLevel * 200 + k * 2 - i + frameCount / freq2);
                    ellipse(xx, yy, width * 2, height * 2.5);
                }
            }
            stroke(255);
            break;
        case 3: // Jelly pattern
            /*
            This one is achieved through mimcking case 1. The difference is that instead of set circles,
            we draw ellipses with varying width and height. This variation results in a 'jelly' like squash and stretch.
            To compliment this, I added mouse interaction.
            If you move your mouse around, the points containing ellipses near the mouse will 'shrink' and shy away.
            Any audio input will increase this radius around the mouse.
            */
            background(255);
            noStroke();
            // Declare local variables
            var height = 20; var width = 20;
            var numH = canvasHeight / height;
            var numW = canvasWidth / width;

            // Start looping through
            for (var i = 0; i < numW; i++) {
                for (var k = 0; k < numH; k++) {
                    // We grab the distance from EACH POINT to the mouse. Hence it is initialised within the loop.
                    var xDis = abs(mouseX - i * width);
                    var yDis = abs(mouseY - k * height);
                    var finalDis = sqrt(xDis * xDis + yDis * yDis);
                    // We get the distance and normalise it to use as a ratio
                    var pc = finalDis / (100 + micLevel * 4000);
                    pc = constrain(pc, 0, 1);

                    // Set coords for drawing
                    var xx = i * width + 4 * sin(i * 2 - k + frameCount / 24);
                    var yy = k * width + 4 * sin(k * 2 - i + frameCount / 24);
                    var xx2 = (i + 1) * width + 4 * sin((i + 1) * 2 - k + frameCount / 24);
                    var yy2 = (k + 1) * width + 4 * sin((k + 1) * 2 - i + frameCount / 32);
                    // Set height and width using the ratio
                    var ww = abs(xx2 - xx) * pc;
                    var hh = abs(yy2 - yy) * pc;
                    var shakeX = random(-2, 2) * (1 - pc);
                    var shakeY = random(-2, 2) * (1 - pc);
                    
                    // Same technique of using modulo, then draw the ellipse
                    if (i % 2 == 0 && k % 2 == 0) {
                        fill(157 + i * 4 * pc, 109 + k * 2 * pc, 229);
                    } else {
                        fill(255);
                    }
                    ellipse(xx + shakeX, yy + shakeY, ww * 1.5, hh * 1.5);
                }
            }
            stroke(255);
            break;
        case 4: // Wiggly triangle stuff 
            /*
            A bit of a weird one, I tried establishing a bunch of points and drawing triangles. 
            By overlapping them, it gave this very faint shifting effect that looked like glass refractions. 
            */
            background(255);
            noStroke();
            // Declare local variables
            var height = 12; var width = 12;
            var numH = canvasHeight / height;
            var numW = canvasWidth / width;
            // Start looping
            for (var i = 0; i < numW; i++) {
                for (var k = 0; k < numH; k++) {
                    if (i % 2 == 0 && k % 2 == 0) {
                        fill(49, 211 + i * 8, 66 + k * 4);
                    } else {
                        fill(255);
                    }
                    // Set drawing coords
                    var xx = i * width + 4 * sin(i * 2 - k * 4 + frameCount / 24);
                    var yy = k * width + 4 * sin(k * 2 - i * 12 + frameCount / 32);
                    var xx2 = (i + 1) * width + 4 * sin((i + 1) * 2 - (k + 1) * 4 + frameCount / 24);
                    var yy2 = (k + 1) * width + 4 * sin((k + 1) * 2 - (i + 1) * 12 + frameCount / 32);
                    // Set height and width using mic level
                    var ww = abs(xx2 - xx) * micLevel * 50;
                    var hh = abs(yy2 - yy) * micLevel * 50;
                    // For every 2nd point we draw a triangle vs an ellipse
                    if (i % 2 == 0 && k % 2 == 0) {
                        triangle(xx, yy, xx2 + 8, yy2 + 8, xx + (ww + 4) * 2, yy + (hh + 4) * 2)
                    } else {
                        ellipse(xx, yy, ww, hh);
                    }
                }
            }
            stroke(255);
            break;
        case 5: // Veins 
            /*    
            I wanted to use the in-built bezier curve function from the p5.js library.
            So I made points just like any other background, then connected them using curves. 
            */
            background(255);
            noStroke();
            // Declare local variables
            var height = 20; var width = 20;
            var numH = canvasHeight / height;
            var numW = canvasWidth / width;
            // Start looping
            for (var i = 0; i < numW; i++) {
                for (var k = 0; k < numH; k++) {
                    if (i % 2 == 0 && k % 2 == 0) {
                        fill(250, 171 - k * 4, 58 + i * 4);
                    } else {
                        fill(255);
                    }

                    var amp1 = 4 + micLevel * 1000;
                    var amp2 = 4 + micLevel * 1000;
                    var xx = i * width + amp1 * sin(i * 2 - k + frameCount / 16);
                    var yy = k * width + amp1 * cos(k * 2 - i + frameCount / 24);
                    var xx2 = (i + 2) * width + amp2 * sin((i + 2) * 2 - (k + 2) + frameCount / 16);
                    var yy2 = (k + 2) * width + amp2 * cos((k + 2) * 2 - (i + 2) + frameCount / 24);
                    // Draw the lines and circles
                    strokeWeight(1 + 0.5 * sin(frameCount / 32 + i * 2 + k * 2));
                    stroke(250 - micLevel * 500, 171 - k * 4, 58 + i * 8);
                    line(xx, yy, xx2, yy2);
                    circle(xx, yy, 4);
                }
            }
            stroke(255);
            break;
        case 6: // Lightning Line
            /*
            Experimented with sensitivity and clamping instead of shape this time.
            The shape is that of a simple lightning shape, however the points are extra sensitive to any audio input.
            Input will lead to high rebound which looks really good. This is done through seperate 'stutter' variables.
            */
            background(255);
            noStroke();
            // Declare local Variables
            var height = 20; var width = 20;
            var numH = canvasHeight / height;
            var numW = canvasWidth / width;
            // Start looping
            for (var i = 0; i < numW; i++) {
                for (var k = 0; k < numH; k++) {
                    // Set these variables within each point because we want variation
                    // These points are the BASE, the ones thereafter are each point of the lightning shape.
                    var x1B = i * width;
                    var y1B = k * height;
                    var x2B = (i + 1) * width;
                    var y2B = (k + 1) * height;
                    var stutter1 = 8 + 4 * micLevel * 100;
                    var stutter2 = 12 + 4 * micLevel * 50;
                    var stag = 4 * i * micLevel * 10;
                    var amp = 32 - micLevel * 50;
                    amp = constrain(amp, 16, 32);

                    var x1 = x1B + stutter1 * sin(i + stag + frameCount / amp);
                    var y1 = y1B + stutter1 * sin(i + stag + frameCount / amp);
                    var x2 = x2B + stutter2 * sin(i + k + frameCount / amp);
                    var y2 = y1B + stutter2 * sin(i + k + frameCount / amp);
                    var x3 = x2B + stutter1 * sin(k + stag + frameCount / amp);
                    var y3 = y2B + stutter1 * sin(k + stag + frameCount / amp);
                    var x4 = x1B + stutter2 * sin(i - k + frameCount / amp)
                    var y4 = y2B + stutter2 * sin(i - k + frameCount / amp);

                    // We only draw on every third point
                    if (i % 3 == 0 && k % 3 == 0) {
                        fill(255 - k * 8, 80, 80 + i * 2);
                        strokeWeight(1 + 0.5 * sin(frameCount / 32 + i * 2 + k * 2));
                        stroke(250 - micLevel * 500, 171 - k * 4, 58 + i * 8);
                        line(x1, y1, x2, y2);
                        line(x3, y3, x1, y1);
                        line(x3, y3, x4, y4);

                    } else {
                        fill(255);
                    }
                }
            }
            stroke(255);
            break;
    }
}

function mousePressed() {
    // Loop through each background on mouse button 
    index++;
    if (index > indexMax) { index = 0; }
}