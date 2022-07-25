var ADVERTISE_INTERVAL_SECONDS = 5;

var bpm = 0;

Bangle.setHRMPower(1);

if(!Bangle.bleAdvert) Bangle.bleAdvert={};

Bangle.on('HRM', function(hrm) {
  bpm = hrm.bpm;
});

function advertiseHRM() {
  // 0x180D is the Heart Rate Service as defined in the Bluetooth SIG specification.
  Bangle.bleAdvert["0x180D"] = [bpm];
  console.log(Bangle.bleAdvert);

  // Displays debug message to Bangle screen
  E.showMessage(bpm);

  NRF.setAdvertising(Bangle.bleAdvert);
}

setInterval(advertiseHRM, ADVERTISE_INTERVAL_SECONDS * 1000);
advertiseHRM();


