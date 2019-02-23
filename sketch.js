let coords = [];
let imgData;

function setup() {
    let ctx = createCanvas(300, 300);
    ctx.parent('drawing');
    background(255);
    stroke(0);
    strokeWeight(10);
    let button = createButton('CLEAR');
    button.parent("control");
    button.mousePressed(clean);
    noLoop();
}

function draw() {
    if (mouseIsPressed) {
        if (mouseX > 0 && mouseX < width &&
            mouseY > 0 && mouseY < height) {
            point(mouseX, mouseY);
            coords.push(createVector(mouseX, mouseY));
            line(mouseX, mouseY, pmouseX, pmouseY);
        }
    }
}

function clean() {
    imgData = [];
    coords = [];
    background(255);
    for (var i = 0; i < 5; i++) {
        $("#d" + i + " h2").text("--");
        $("#d" + i + " h3").text("00");
    }
}