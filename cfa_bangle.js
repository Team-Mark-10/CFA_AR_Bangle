//##################################
//Inital variables to set for heart rate graph.
var data = []; // Stores bpm data in queue.
var W = 200;
var startX = 25;
var padding = 10;
var startY = 100;
var H = 120;
var MAX_BPM = 200;
var Layout = require("Layout");
var layout = new Layout(
  {
    type: "v",
    c: [
      {
        type: "v",
        c: [
          { type: "txt", font: "15%", label: "Mark 10", id: "title" },
          { type: "txt", font: "8%", label: "Heart Rate", id: "title1" },
        ],
      },
      { type: "v", filly: 1, c: [] }, //empty layout container to set vertical positioning
    ],
  },
  {
    btns: [
      {
        label: "Back",
        cb: (l) => print("Back"),
        cbl: (l) => print("One long press"),
      },
      { label: "Settings", cb: (l) => print("Settings") },
      { label: "Alert", cb: (l) => print("Alert") },
    ],
  }
);

//##################################
// Our custom renderer that draws a graph of heart rate
function renderGraph(data) {
  g.clear();

  //Inital x and y axis lines.
  g.drawLine(startX, startY, startX, startY + H);
  g.drawLine(startX, startY + H, startX + W, startY + H);

  var ly = startY + H - (data[0] / MAX_BPM) * H;
  var lx = padding + startX;

  //for loop iterates over each data point, connecting them together.
  for (let i = 1; i < data.length; i++) {
    var ny = startY + H - (data[i] / MAX_BPM) * H;
    var nx = padding + startX + i * (W / data.length);

    g.drawLine(lx, ly, nx, ny);
    g.drawString(data[i], nx, ny - 10);
    ly = ny;
    lx = nx;
  }
  layout.render();
}

//is called every advertisment. Updates data and draws graphics.
function updateDraw(bpm) {
  // max data points allowed on heart rate monitor/data array
  if (data.length >= 12) {
    data.shift();
  }
  data.push(bpm);

  renderGraph(data);
}

// How often the BLE advertisement goes out.
var ADVERTISE_INTERVAL_SECONDS = 5;

var bpm = 0;

//turns power to the HRM on, this should be turned off when ever not needed.
Bangle.setHRMPower(1);

if (!Bangle.bleAdvert) Bangle.bleAdvert = {};

Bangle.on("HRM", function (hrm) {
  bpm = hrm.bpm;
});

function advertiseHRM() {
  // 0x180D is the Heart Rate Service as defined in the Bluetooth SIG specification.
  Bangle.bleAdvert["0x180D"] = [bpm];

  // Displays debug message to Bangle screen
  console.log(Bangle.bleAdvert);

  updateDraw(bpm);
  NRF.setAdvertising(Bangle.bleAdvert);
}

g.clear();
layout.render();

setInterval(advertiseHRM, ADVERTISE_INTERVAL_SECONDS * 1000);
advertiseHRM();
