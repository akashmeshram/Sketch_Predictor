import { EventEmitter } from "events";
import { CANVAS_SIZE, CLASSES } from "./data";

class UI extends EventEmitter {
  constructor() {
    super();
    this.predict = document.getElementsByTagName("button")[0];
    this.clear = document.getElementsByTagName("button")[1];

    this.messages = [
      "Draw and click predict !!!",
      "Processing ....",
      "Prediction Results",
    ];
    this.status = document.getElementsByTagName("p")[0];

    this.tabel = document.getElementsByTagName("table")[0];
    this.canvas = document.getElementsByTagName("canvas")[0];
    this.ctx = this.canvas.getContext("2d");

    this.statusCode = 0;
    this.setup();
    this.addAllEventListeners();
    this.pos = { x: 0, y: 0 };
  }

  addAllEventListeners() {
    document.addEventListener("resize", (e) => this.resize(e));
    document.addEventListener("mousemove", (e) => this.draw(e));
    document.addEventListener("mousedown", (e) => this.setPosition(e));
    document.addEventListener("mouseenter", (e) => this.setPosition(e));

    this.predict.addEventListener("click", () =>
      this.emit("start-prediction", this.canvas)
    );
    this.clear.addEventListener("click", () => this.clearCanvas());
  }

  setup() {
    this.ctx.canvas.width = CANVAS_SIZE;
    this.ctx.canvas.height = CANVAS_SIZE;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clearCanvas() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.tabel.innerHTML = "";
    this.statusCode = 0;
    t;
  }

  setPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.pos.x = e.clientX - rect.left;
    this.pos.y = e.clientY - rect.top;
  }

  draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    this.ctx.beginPath(); // begin

    this.ctx.lineWidth = 20;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "#000";

    this.ctx.moveTo(this.pos.x, this.pos.y); // from
    this.setPosition(e);
    this.ctx.lineTo(this.pos.x, this.pos.y); // to

    this.ctx.stroke(); // draw it!
  }

  set predictionTable(data) {
    data.slice(0, 5).map(({ index, probability }) => {
      const row = document.createElement("tr");
      const rank = document.createElement("td");
      const value = document.createElement("td");
      rank.innerHTML = CLASSES[index];
      value.innerHTML = `${(Number(probability) * 100).toFixed(2)}%`;
      row.append(rank);
      row.append(value);
      this.tabel.append(row);
    });
    this.statusCode = 2;
  }

  set statusCode(code) {
    this.status.innerHTML = this.messages[code];
  }
}

export default UI;
