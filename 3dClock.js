/* Van Andrew Nguyen

I wanted to try out p5.js's 3D functions. This one plays with a 'clock-face' which can be manipulated with user audio input.
The 3D aspect can be shown through mouse movement. The camera can be panned and zoomed. */

// Declare global Variables
let canvasWidth = 500;
let canvasHeight = 500;

//Declare audio Variables
let mic;
let micLevel = 0;
let micLevelTarget;

// Declare clock Variables
let timeMinute = 0;
let timeRateMinute = 0.01;
let timeHour = 0;
let timeRateHour = 0.01 / 240;

// Declare 3D drawing variables
let d = 72;
let zDis = 600;

function setup() {
    var cnv = createCanvas(canvasWidth, canvasHeight, WEBGL);
    // Start audio input
    mic = new p5.AudioIn();
    mic.start();
}

function draw() {
    background(255);
    frameRate(30);


    // Mic Levels
    micLevelTarget = mic.getLevel();
    micLevel = lerp(micLevel, micLevelTarget, 0.1);
    timeMinute += timeRateMinute + micLevel * 50;
    timeHour += timeRateHour + micLevel * 5;

    // 3D 
    orbitControl();
    noStroke();

    for (let i = 0; i <= 12; i++) {
        for (let j = 0; j <= 12; j++) {
            // Push drawing method 
            push();
            // We loop through and set a, b to points on a circle. Then we can draw points in a 3d space.
            let a = (j / 12) * PI;
            let b = (i / 12) * PI;
            translate(sin(2 * a) * canvasWidth * sin(b) + 4 * sin(i * 2 + frameCount / 32),
                     (cos(b) * canvasWidth) / 2 + 16 * sin(i * j * 4 + frameCount / 32),
                      cos(2 * a) * canvasWidth * sin(b));
            fill(244 + j * 4, 191, 213 - i * 8);
            if (i % 2 === 0) {
                sphere(30);
            }
            pop();
        }
    }


    // Start Drawing
    translate(-canvasWidth / 2, -canvasHeight / 2, -zDis);
    zDis = 100 - micLevel * 4000;
    d = 72 + 4 * sin(frameCount / 64) + micLevel * 100;

    // Okay granted, going back and formatting the code, I could've used a recursive function to loop each wheel.
    // Could've avoided repeating for each radius of 'clocks'

    // Middle Clock
    strokeWeight(1.5 + 0.4 * sin(frameCount / 32));
    stroke(67, 34, 34);
    fill(244, 191, 213);
    var wheel = new Wheel(canvasWidth / 2, canvasHeight / 2, 64);
    wheel.draw();

    // Outer 1 Clock
    strokeWeight(1.0 + 0.3 * sin(frameCount / 28));
    stroke(67, 34, 34);
    fill(240, 153, 174);
    var wheelO1 = new Wheel(canvasWidth / 2 - d, canvasHeight / 2, 48);
    wheelO1.draw();
    var wheelO2 = new Wheel(canvasWidth / 2 + d, canvasHeight / 2, 48);
    wheelO2.draw();
    var wheelO3 = new Wheel(canvasWidth / 2, canvasHeight / 2 - d, 48);
    wheelO3.draw();
    var wheelO4 = new Wheel(canvasWidth / 2, canvasHeight / 2 + d, 48);
    wheelO4.draw();

    // Outer 2 Clock
    strokeWeight(0.8 + 0.2 * sin(frameCount / 24));
    stroke(67, 34, 34);
    fill(213, 128, 144);
    var wheelO1 = new Wheel(canvasWidth / 2 - d * 2, canvasHeight / 2, 32);
    wheelO1.draw();
    var wheelO2 = new Wheel(canvasWidth / 2 + d * 2, canvasHeight / 2, 32);
    wheelO2.draw();
    var wheelO3 = new Wheel(canvasWidth / 2, canvasHeight / 2 - d * 2, 32);
    wheelO3.draw();
    var wheelO4 = new Wheel(canvasWidth / 2, canvasHeight / 2 + d * 2, 32);
    wheelO4.draw();

    // Outer 3 Clock
    strokeWeight(0.6 + 0.1 * sin(frameCount / 20));
    stroke(67, 34, 34);
    fill(193, 105, 105);
    var wheelO1 = new Wheel(canvasWidth / 2 - d * 3, canvasHeight / 2, 16);
    wheelO1.draw();
    var wheelO2 = new Wheel(canvasWidth / 2 + d * 3, canvasHeight / 2, 16);
    wheelO2.draw();
    var wheelO3 = new Wheel(canvasWidth / 2, canvasHeight / 2 - d * 3, 16);
    wheelO3.draw();
    var wheelO4 = new Wheel(canvasWidth / 2, canvasHeight / 2 + d * 3, 16);
    wheelO4.draw();

}

// Define the class 'wheel'
class Wheel {
    constructor(cx, cy, rad, numSpokes) {
        this.cx = cx;
        this.cy = cy;
        this.rad = rad;
        this.numSpokes = numSpokes;
    }

    draw() {
        push();
        translate(this.cx, this.cy);
        rotate(timeHour);
        ellipse(0, 0, this.rad);
        line(0, 0, this.rad / 4, 0);
        rotate(timeMinute);
        line(0, 0, this.rad / 2, 0);
        pop();
    }
}
