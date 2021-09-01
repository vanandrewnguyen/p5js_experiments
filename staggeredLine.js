/* Van Andrew Nguyen

Create a line using 2 points. Use an array to get a bunch of points
to lag behind (stagger), then connect all of them. Result is a cloth-like visualisation. 
Sound input is enabled; users can speak into a microphone to speed up the material's flow. */

// Declare canvas Variables
let canvasWidth = 600;
let canvasHeight = 600;
let spacing = 20;
let numW = canvasWidth / spacing;
let numH = canvasWidth / spacing;

// Declare Line Variables
let lineNum = 64;
let xx1 = []; let yy1 = [];
let xx2 = []; let yy2 = [];

// Declare audio Variables
let t = 0;
let mic;
let micLevel = 0;
let micLevelTarget;

function setup() {
    var cnv = createCanvas(canvasWidth, canvasHeight);
    // Init empty arrays
    for (let i = 0; i < lineNum; i++) {
        xx1[i] = 0; yy1[i] = 0;
        xx2[i] = 0; yy2[i] = 0;
    }
    // Start the mic input
    mic = new p5.AudioIn();
    mic.start();
}

function draw() {
    background(255);

    // Mic Levels
    micLevelTarget = mic.getLevel();
    micLevel = lerp(micLevel, micLevelTarget, 0.1);
    t += micLevel * 10;

    fill(255, 77, 163);
    stroke(255, 77, 163);
    strokeWeight(1.5 + 0.5 * sin(frameCount / 48));

    // Set local variables for drawing position
    // Granted, these are completely magic numbers found through experimentation
    var xx = canvasWidth / 2;
    var yy = canvasHeight / 2;
    var amp1 = 180 + 32 * sin(t + frameCount / 96);
    var amp2 = 160 + 24 * sin(t + frameCount / 64);
    var freq1 = 80;
    var freq2 = 64;

    // Establish the first point of each array because we need the data
    xx1[0] = xx + amp1 * sin(1 + frameCount / freq1);
    yy1[0] = yy + amp1 * cos(1 + frameCount / freq1);
    xx2[0] = xx + amp2 * sin(1 + frameCount / freq2);
    yy2[0] = yy + amp2 * cos(1 + frameCount / freq2);
    line(xx1[0], yy1[0], xx2[0], yy2[0]);

    // Loop through the rest of the array
    for (let i = 1; i < lineNum; i++) {
        stroke(255 - i * 4 + 32 * sin(frameCount / 32), 77 + i * 2, 163);

        var followRate = constrain(0.1 + micLevel * 5, 0, 0.5);
        xx1[i] = lerp(xx1[i], xx1[i - 1], followRate);
        yy1[i] = lerp(yy1[i], yy1[i - 1], followRate);
        xx2[i] = lerp(xx2[i], xx2[i - 1], followRate);
        yy2[i] = lerp(yy2[i], yy2[i - 1], followRate);

        // We draw multiple lines per loop to give that illusion of a cloth
        line(xx1[i], yy1[i], xx2[i], yy2[i]);
        line(xx1[i], yy1[i], xx1[i - 1], yy1[i - 1]);
        line(xx2[i], yy2[i], xx2[i - 1], yy2[i - 1]);
    }
}