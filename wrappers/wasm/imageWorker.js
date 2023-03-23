importScripts("./zxing_reader.js");
let zxing;

const isLoad = () => {
    new Promise(async (resolve, reject) => {

        console.debug("[DEBUG] ==== LOADING WASM MODULE");
        // const wasm = await fetch(`./zxing_reader.wasm`);
        // const script = await fetch('./zxing_reader.js');

        // const scriptBuffer = await script.text();
        // const buffer = await wasm.arrayBuffer();
        // eval(scriptBuffer);

        ZXing().then((instance) => {
            zxing = instance;
            console.debug("[DEBUG] ==== WASM MODULE LOADED");
            resolve('loaded');
        });
    });
};
isLoad();

console.debug("[DEBUG] ==== WORKER INITIALIZED");

// init at worker load
// var zxing = ZXing().then(function(instance) {
//     zxing = instance; // this line is supposedly not required but with current emsdk it is :-/
// });

// Just main message is to scan barcode
self.addEventListener('message', async (event) => {
    // handle the message from the main thread
    console.debug("[DEBUG][WORKER] ==== WORKER MESSAGE POSTED", event);
    const imageData = event.data.imageData;
    const format = event.data.selectedFormat;

    const scanResult = await scanData(imageData, format);

    console.debug("[DEBUG][WORKER] ==== SCAN RESULT", scanResult);
    // this.self.postMessage(resultMessage);
});

const scanData = async (imgData, selectedFormat) => {
    if (!zxing) {
        await isLoad();
    }
    const byteArray = imgData.data;
		
    var buffer = zxing._malloc(byteArray.length);
    zxing.HEAPU8.set(byteArray, buffer);

    const start = performance.now();
    var result = zxing.readBarcodeFromPixmap(buffer, imgData.width, imgData.height, true, selectedFormat);
    const end = performance.now();

    console.debug(`Execution time: ${ end - start } ms`);

    zxing._free(buffer);
    
    return result;
}