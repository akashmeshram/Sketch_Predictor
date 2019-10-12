
let mbb;
const dpi = window.devicePixelRatio;
let model;
let classNames = [];



/*===========================================
  Loading the model and class names 
=============================================*/

async function loadDict() {
    loc = './model/class_names.txt'

    await $.ajax({
        url: loc,
        dataType: 'text',
    }).done(success);
}

function success(data) {
    const lst = data.split(/\n/);
    for (var i = 0; i < lst.length - 1; i++) {
        let symbol = lst[i];
        classNames[i] = symbol;
    }
}

async function start() {

    model = await tf.loadLayersModel('./model/model.json')

    model.predict(tf.zeros([1, 28, 28, 1]))

    allowDrawing()

    await loadDict()
}

function allowDrawing() {
    canvas.isDrawingMode = 1;
    canvas.freeDrawingBrush.width = 10;
}



/*===========================================
  Data Preprocessing
=============================================*/

function getData() {
    mbb = boundingBox();
    imgData = canvas.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
                (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
    return imgData;
}

function boundingBox() {
    let cX = coords.map((p) => {
        return p.x;
    });
    let cY = coords.map((p) => {
        return p.y;
    });

    var min_coords = {
        x: Math.min.apply(null, cX),
        y: Math.min.apply(null, cY)
    }
    var max_coords = {
        x: Math.max.apply(null, cX),
        y: Math.max.apply(null, cY)
    }

    return {
        min: min_coords,
        max: max_coords
    };
}


function preprocess(data) {
    return tf.tidy(() => {
        let tensor = tf.browser.fromPixels(data, numChannels = 1);
        const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat();
        const offset = tf.scalar(255.0);
        const normalized = tf.scalar(1.0).sub(resized.div(offset));
        const batched = normalized.expandDims(0);
        return batched;
    });
}



/*===========================================
  Predicting from the model and taking output
=============================================*/

function mouseReleased() {
    if (coords.length >= 2) {
        const imgData = getData();
        const pred = model.predict(preprocess(imgData)).dataSync();

        const indices = findIndicesOfMax(pred, 5);
        const probs = findTopValues(pred, 5);
        const names = getClassNames(indices);

        setTable(names, probs);
    }
}

function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i);
        if (outp.length > count) {
            outp.sort(function(a, b) {
                return inp[b] - inp[a];
            });
            outp.pop();
        }
    }
    return outp;
}

function findTopValues(inp, count) {
    var outp = [];
    let indices = findIndicesOfMax(inp, count)
    for (var i = 0; i < indices.length; i++)
        outp[i] = inp[indices[i]]
    return outp
}

function getClassNames(indices) {
    var outp = []
    for (var i = 0; i < indices.length; i++)
        outp[i] = classNames[indices[i]]
    return outp
}

function setTable(top5, probs) {
    var total = probs.reduce((a, b) => a + b, 0) 
    for (var i = 0; i < top5.length; i++) {
        $("#d" + i + " h2").text(top5[i]);
        $("#d" + i + " h3").text(Math.round((probs[i]/total) * 10000)/100 + "%");        
    }
}