let coords = [];
let canvas;
let mousePressed = false;

// setup
$(function() {
    canvas = window._canvas = new fabric.Canvas('canvas');
    canvas.backgroundColor = '#ffffff';
    canvas.isDrawingMode = 0;
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 10;
    canvas.renderAll();
    
    canvas.on('mouse:up', function(e) {
        mouseReleased();
        mousePressed = false
    });
    canvas.on('mouse:down', function(e) {
        mousePressed = true
    });
    canvas.on('mouse:move', function(e) {
        draw(e)
    });
})

function draw() {
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;

    if (posX >= 0 && posY >= 0 && mousePressed) {
        coords.push(pointer)
    }
}

function clean() {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    coords = [];
    for (var i = 0; i < 5; i++) {
        $("#d" + i + " h2").text("--");
        $("#d" + i + " h3").text("00");
    }
}