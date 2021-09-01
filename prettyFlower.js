/* Van-Andrew Nguyen 

This code generates a shape which resembles a plant from the top-down angle. 
Mic interactivity added. Once the user passes a volume threshold, 
the plant will add a new petal and increase its petal width + radius.
The flowerVariationOne script 
*/

// Declare canvas Variables
let canvasWidth = 500;
let canvasHeight = 500;

// Declare flower Variables
let petalNum = 8;
let petalWidth = 20;
let rad = 0;
let baseRad = 16;
let baseAngle = 0;
let angleRot = 1 / 256;
let radThreshold = 64;
let locked = false;
let halfShape = false;

// Declare audio Variables
let mic;
let micLevel = 0;
let micLevelTarget;

function setup() {
    createCanvas(canvasWidth, canvasHeight);

    // Start audio input
    mic = new p5.AudioIn();
    mic.start();
}

function draw() {
    background(255);
    frameRate(30);

    // Mic Levels
    micLevelTarget = mic.getLevel();
    micLevel = lerp(micLevel, micLevelTarget, 0.02);

    // Play with base values
    baseAngle += angleRot + micLevel / 4;
    var amp = 4 + micLevel * 100;
    rad = baseRad + (micLevel * 2000) + (amp * sin(frameCount / 32));
    if (rad > radThreshold) {
        if (locked == false) {
            petalNum++;
            petalWidth += 2;
            baseRad += 4;
            locked = true;
        }
    } else {
        locked = false;
    }

    var xx = canvasWidth / 2;
    var yy = canvasHeight / 2;

    // Draw Flower
    fill(252, 97 + micLevel * 200, 179 - micLevel * 500);
    stroke(97, 13, 38);
    // The last couple arguments determine the whether the plant has flowers on the end, flowers on each petal, and the number of background patterns
    flowerVariationOne(xx, yy, rad, petalNum, petalWidth, 1, 8, 6);


}

// Set up variations of flowers
function flowerVariationOne(x, y, rad, petalNum,
    petalWidth, flowers, circleRep, flowerEdge) {
    let angle = TWO_PI / petalNum;
    // Begin drawing loop
    push();
    translate(x, y);
    rotate(-PI / 2);
    // Create Inner Shape Fill
    push();
    for (let i = 0; i < TWO_PI; i += angle) {
        // Create points with endpoints determined by 360 / angle
        // Using structs
        let p1 = { x: 0, y: 0 };
        let p2 = { x: rad / 2, y: -petalWidth };
        let p3 = { x: rad, y: 0 };
        let p4 = { x: rad / 2, y: petalWidth };

        push();
        noStroke();
        rotate(i + baseAngle);
        beginShape();
        vertex(p1.x, p1.y);
        bezierVertex(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        if (halfShape == true) {
            bezierVertex(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y);
        }
        vertex(p1.x, p1.y);
        endShape();

        // ADD ONS ////
        var flowerRad = 8 + 2 * sin(frameCount / 32) + micLevel * 100;
        
        // Flowers at the tips
        if (flowers == 1) {
            circle(p3.x, p3.y, flowerRad);
        }

        // Flowers on the edges
        if (flowerEdge > 0) {
            for (var w = 0; w < flowerEdge; w++) {
                var xDis = abs(p1.x - p3.x);
                var xInc = xDis / flowerEdge;
                var xx = xInc * w;
                var yDis = abs(p1.y - p3.y);
                var yInc = yDis / flowerEdge;
                var yy = yInc * w;
                var incRad = rad / 12;
                //text(str((micLevel)),20,20); // cool words!!
                incRad = constrain(incRad, 0, 24)
                circle(xx, yy, incRad);
            }
        }

        // Circle reps
        if (circleRep > 0) {
            for (var q = 0; q < circleRep; q++) {
                rotate(q * 4 * sin(frameCount / 6000));
                fill(252 - q * 32, 97 + micLevel * 200 + q * 2, 179 - micLevel * 500);
                var circleRepDis = rad * q + (rad / 4) * sin(frameCount / 48);
                var halfwayP = { x: circleRepDis, y: circleRepDis }
                var xx = halfwayP.x + 64 * sin(frameCount / 32);
                var yy = halfwayP.y + 64 * sin(frameCount / 32);
                circle(xx, yy, flowerRad);
            }
        }

        pop();
    }
    pop();

    // Create Outer Outlines
    push();
    for (let k = 0; k < TWO_PI; k += angle) {
        // Loop through with structs to give end coords
        let p1 = { x: 0, y: 0 };
        let p2 = { x: rad / 2, y: -petalWidth };
        let p3 = { x: rad, y: 0 };
        let p4 = { x: rad / 2, y: petalWidth };

        push();
        noFill();
        rotate(k + baseAngle);
        beginShape();
        vertex(p1.x, p1.y);
        bezierVertex(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        bezierVertex(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y);
        vertex(p1.x, p1.y);
        endShape();
        
        // Flowers at the tips
        if (flowers == 1) {
            var flowerRad = 8 + 2 * sin(frameCount / 32) + micLevel * 100;
            circle(p3.x, p3.y, flowerRad);
        }
        pop();
    }
    pop();
    pop();
}