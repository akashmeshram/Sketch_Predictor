import UI from "./UI";
import ML from "./ML";
const newui = new UI();
const newML = new ML();

newui.on("start-prediction", (image) => newML.predictSketch(image));

newML.on("prediction-started", () => (newui.statusCode = 1));
newML.on("prediction-complete", (data) => (newui.predictionTable = data));
