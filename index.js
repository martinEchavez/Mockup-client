THREE = require("three");
const fs = require('fs');
// Create a DOM
const MockBrowser = require('mock-browser').mocks.MockBrowser;
mock = new MockBrowser();
document = MockBrowser.createDocument();
window = MockBrowser.createWindow();
navigator = window.navigator;
width = 500;
height = 333;

//REST API
const express = require('express');
const app = express();
const router = express.Router();

gl = require('gl')(1, 1); //headless-gl

pngStream = require('three-png-stream');
const port = process.env.PORT || 8080;

router.get('/render', function (req, res) {
    let scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({ context: gl });

    scene.add(camera);


    renderer.setSize(this.width, this.height);
    renderer.setClearColor(0xFFFFFF, 1);
    
    // Add Geometry
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);


    target = new THREE.WebGLRenderTarget(this.width, this.height);

    // renderer.render(scene, camera, target);
    renderer.render(scene, camera);
    let data = renderer.domElement.toDataURL();
    console.log(data)
    res.send(data);
    /*
    res.setHeader('Content-Type', 'image/png');
    pngStream(renderer, target).pipe(res);
    */
});

app.use('/api', router);

app.listen(port);
console.log('Server active on port: ' + port);