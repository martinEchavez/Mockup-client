/* Use CDN instead of local libraries */
import * as THREE from "https://cdn.skypack.dev/three@0.135.0";
import { ColladaLoader } from "https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/ColladaLoader.js";

let camera, scene, renderer;

window.renderScene = async (itemData) => {
    const canvas = document.querySelector("#app");

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
        preserveDrawingBuffer: true,
        // premultipliedAlpha: false
    });

    renderer.setPixelRatio(1);
    renderer.setSize(itemData.camera.frameWidth, itemData.camera.frameHeight);
    renderer.outputEncoding = THREE.sRGBAEncoding;
    renderer.setClearColor(new THREE.Color(0xff0000), 0);

    scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const TextureLoader = new THREE.TextureLoader();
    TextureLoader.crossOrigin = "Anonymous";

    function loadTexture(url) {
        return new Promise((resolve) => {
            TextureLoader.load(url, resolve);
        });
    }

    const texture = await loadTexture(itemData.texture);
    // texture.format = THREE.RGBAFormat

    const daeLoader = new ColladaLoader();
    daeLoader.load(
        itemData.sceneFileURL,
        function (dae) {
            let collada = dae.scene;

            collada.traverse(function (node) {
                if (node.isMesh) {
                    node.material.color = new THREE.Color(0xffffff);
                    node.material.blending = THREE.NoBlending;
                    node.material.alphaTest = 0.5;
                    node.material.transparent = false;
                    // node.material.side = THREE.DoubleSide; // Enable back-faces

                    if (node.material.name == itemData.targetMaterialName) {
                        node.material.map = texture;
                    }
                }
            });

            scene.add(collada);
            camera = scene.getObjectByName(itemData.camera.name);

            if (!camera) {
                throw new Error("Camera not found");
            }

            camera.aspect = itemData.camera.frameWidth / itemData.camera.frameHeight;

            if (camera.type == "OrthographicCamera") {
                camera.zoom = scene.getObjectByName("zoom").position.x * 100 || 20;
                camera.left = -camera.aspect;
                camera.right = camera.aspect;
                camera.top = 1;
                camera.bottom = -1;
            }

            camera.updateProjectionMatrix();
            renderer.render(scene, camera);

            let div = document.createElement("div");
            div.setAttribute("id", "rendered");
            document.body.appendChild(div);
        },
        undefined,
        (error) => console.error(error)
    );
};