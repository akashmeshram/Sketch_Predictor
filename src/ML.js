import { EventEmitter } from "events";

class Machine extends EventEmitter {
  constructor() {
    super();
    this.model = null;
    this.loadModel();
  }

  async loadModel() {
    this.model = await tf.loadLayersModel("model/model.json");
  }

  async predictSketch(image) {
    await tf.nextFrame();
    this.emit("prediction-started");
    const sketch = await tf.tidy(() => {
      return tf.image
        .resizeBilinear(tf.browser.fromPixels(image), [28, 28])
        .mean(2)
        .sub(255)
        .abs()
        .toFloat()
        .div(255)
        .reshape([1, 28, 28, 1]);
    });
    const predictions = await tf.tidy(() => {
      return this.model.predict(sketch);
    });
    const predictionTypedArray = Array.from(predictions.dataSync());
    const predictionKeyValue = predictionTypedArray.map(
      (probability, index) => {
        return {
          index,
          probability,
        };
      }
    );
    const result = predictionKeyValue.sort(
      (a, b) => b.probability - a.probability
    );
    await tf.nextFrame();
    this.emit("prediction-complete", result);
  }
}

export default Machine;
