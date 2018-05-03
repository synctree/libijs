const libijs = require("../");
const meaco = require("meaco");
const JarvisEmitter = require("jarvis-emitter");
const fs = require("fs-extra");

const { lockdownd, services } = libijs;
const { getService, MCInstall } = services;

function testPair (device) {
  return meaco(function* doTestAfc() {
    console.log(device);
    const lockdownClient = yield libijs.lockdownd.getClient(device);

    const pairRecord = yield lockdownClient.__usbmuxdClient.readPairRecord(device.udid);
    console.log(pairRecord)
    
    // TODO: figure out a better way to detect if paired
    const MCInstall = yield getService(device, 'MCInstall', lockdownClient);

    if (!MCInstall) {
      console.log('not paired?');
      // do the pairing thing
      const response = yield lockdownClient.pair();
      console.log(response);
      return false;
    }

    return true;
  });
  //const afc = yield libijs.services.getService(device, "afc");
}

function runPair (device) {
	testPair(device)
	.error((e) => {
		console.error('Error:', e);
		process.exit(1);
	})
	.catch((e) => {
		console.error('Caught:', e);
		process.exit(1);
	})
	.done((result) => {
    console.log('Result:', result)
		process.exit(result ? 0 : 1);
	});
}

const deviceManager = libijs.createClient().deviceManager;
deviceManager.ready(() => {
  console.log('ready')
  const device = deviceManager.getDevice();
  if (!device) {
    deviceManager.attached(runPair);
  } else {
    runPair(device);
  }
});