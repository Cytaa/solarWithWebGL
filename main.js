var pointLight, sun, moon, earth, uranus, mercury,urMoon1,  urMoon2, uranusOrbit ,earthOrbit, mercuryOrbit, ring, controls, scene, camera, renderer, scene;
var planetSegments = 48;
var earthData = constructPlanetData(365.2564, 0.015, 50, "earth", "img/earth.jpg", 1, planetSegments);
var moonData = constructPlanetData(29.5, 0.01, 2.8, "moon", "img/moon.jpg", 0.5, planetSegments);
var mercuryData = constructPlanetData(87.969, 0.23, 25, "mercury", "img/mercury.jpg", 0.5, planetSegments);
var uranusData = constructPlanetData(500, 0.024, 100,"uranus","img/uranus.jpg", 5,planetSegments);
var urMoon1Data = constructPlanetData(20, 0.01, 7, "moon", "img/moon.jpg", 0.5, planetSegments);
var urMoon2Data = constructPlanetData(40, 0.015, 5.8, "moon", "img/moon.jpg", 1, planetSegments);
var orbitData = {value: 200, runOrbit: true, runRotation: true};
var clock = new THREE.Clock();

/**
 * 
 * @param {type} myOrbitRate decimal
 * @param {type} myRotationRate decimal
 * @param {type} myDistanceFromAxis decimal
 * @param {type} myName string
 * @param {type} myTexture image file path
 * @param {type} mySize decimal
 * @param {type} mySegments integer
 * @returns {constructPlanetData.mainAnonym$0}
 */
function constructPlanetData(myOrbitRate, myRotationRate, myDistanceFromAxis, myName, myTexture, mySize, mySegments) {
    return {
        orbitRate: myOrbitRate
        , rotationRate: myRotationRate
        , distanceFromAxis: myDistanceFromAxis
        , name: myName
        , texture: myTexture
        , size: mySize
        , segments: mySegments
    };
}

/**
 * 
 * @param {type} size decimal
 * @param {type} innerDiameter decimal
 * @param {type} facets integer
 * @param {type} myColor HTML color
 * @param {type} name string
 * @param {type} distanceFromAxis decimal
 * @returns {THREE.Mesh|myRing}
 */
function getRing(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    var ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
    var ring1Material = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}
 
 /** 
  @param {type} size decimal
 * @param {type} innerDiameter decimal
 * @param {type} facets integer
 * @param {type} myColor HTML color
 * @param {type} name string
 * @param {type} distanceFromAxis decimal
 * @returns {THREE.Mesh|myRing}
 */
function getTube(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    var ringGeometry = new THREE.TorusGeometry(size, innerDiameter, facets, facets);
    var ringMaterial = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    myRing = new THREE.Mesh(ringGeometry, ringMaterial);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}


/**
 * @param {type} type
 * @param {type} color
 * @param {type} myTexture
 * @returns {THREE.MeshStandardMaterial|THREE.MeshLambertMaterial|THREE.MeshPhongMaterial|THREE.MeshBasicMaterial}
 */
function getMaterial(type, color, myTexture) {
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
        map: myTexture === undefined ? null : myTexture
    };

    switch (type) {
        case 'basic':
            return new THREE.MeshBasicMaterial(materialOptions);
        case 'lambert':
            return new THREE.MeshLambertMaterial(materialOptions);
        case 'phong':
            return new THREE.MeshPhongMaterial(materialOptions);
        case 'standard':
            return new THREE.MeshStandardMaterial(materialOptions);
        default:
            return new THREE.MeshBasicMaterial(materialOptions);
    }
}

/** 
 * @returns {undefined}
 */
function createVisibleOrbits() {
    var orbitWidth = 0.01;
    earthOrbit = getRing(earthData.distanceFromAxis + orbitWidth
        , earthData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "earthOrbit"
        , 0);

    mercuryOrbit = getRing(mercuryData.distanceFromAxis + orbitWidth
        , mercuryData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "mercuryOrbit"
        , 0); 

    uranusOrbit = getRing(uranusData.distanceFromAxis + orbitWidth
        , uranusData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "uranusOrbit"
        , 0); 
}

/**
 * @param {type} material THREE.SOME_TYPE_OF_CONSTRUCTED_MATERIAL
 * @param {type} size decimal
 * @param {type} segments integer
 * @returns {getSphere.obj|THREE.Mesh}
 */
function getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;

    return obj;
}

/**
 * @param {type} myData data for a planet object
 * @param {type} x integer
 * @param {type} y integer
 * @param {type} z integer
 * @param {type} myMaterialType string that is passed to getMaterial()
 * @returns {getSphere.obj|THREE.Mesh|loadTexturedPlanet.myPlanet}
 */
function loadTexturedPlanet(myData, x, y, z, myMaterialType) {
    var myMaterial;
    var passThisTexture;

    if (myData.texture && myData.texture !== "") {
        passThisTexture = new THREE.ImageUtils.loadTexture(myData.texture);
    }
    if (myMaterialType) {
        myMaterial = getMaterial(myMaterialType, "rgb(255, 255, 255 )", passThisTexture);
    } else {
        myMaterial = getMaterial("lambert", "rgb(255, 255, 255 )", passThisTexture);
    }

    myMaterial.receiveShadow = true;
    myMaterial.castShadow = true;
    var myPlanet = getSphere(myMaterial, myData.size, myData.segments);
    myPlanet.receiveShadow = true;
    myPlanet.name = myData.name;
    scene.add(myPlanet);
    myPlanet.position.set(x, y, z);

    return myPlanet;
}

/**
 * @param {type} intensity decimal
 * @param {type} color HTML color
 * @returns {THREE.PointLight|getPointLight.light}
 */
function getPointLight(intensity, color) {
    var light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

/**
 * @param {type} myPlanet
 * @param {type} myData
 * @param {type} myTime
 * @param {type} stopRotation 
 * @returns {undefined}
 */
function movePlanet(myPlanet, myData, myTime, stopRotation) {
    if (orbitData.runRotation && !stopRotation) {
        myPlanet.rotation.y += myData.rotationRate;
    }
    if (orbitData.runOrbit) {
        myPlanet.position.x = Math.cos(myTime 
                * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) 
                * myData.distanceFromAxis;
        myPlanet.position.z = Math.sin(myTime 
                * (1.0 / (myData.orbitRate * orbitData.value)) + 10.0) 
                * myData.distanceFromAxis;
    }
}

/**
 * @param {type} myMoon
 * @param {type} myPlanet
 * @param {type} myData
 * @param {type} myTime
 * @returns {undefined}
 */
function moveMoon(myMoon, myPlanet, myData, myTime) {
    movePlanet(myMoon, myData, myTime);
    if (orbitData.runOrbit) {
        myMoon.position.x = myMoon.position.x + myPlanet.position.x;
        myMoon.position.z = myMoon.position.z + myPlanet.position.z;
    }
}

/**
 * @param {type} renderer
 * @param {type} scene
 * @param {type} camera
 * @param {type} controls
 * @returns {undefined}
 */
function update(renderer, scene, camera, controls) {
    pointLight.position.copy(sun.position);
    controls.update();

    var time = Date.now();

    movePlanet(earth, earthData, time);
    movePlanet(mercury, mercuryData, time);
    movePlanet(uranus, uranusData,time, time);
    movePlanet(ring, earthData, time, true);
    moveMoon(moon, earth, moonData, time);
    moveMoon(urMoon1, uranus,urMoon1Data,time);
    moveMoon(urMoon2, uranus,urMoon2Data,time);

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

/**
 * @returns {THREE.Scene|scene}
 */
function init() {
    
    camera = new THREE.PerspectiveCamera(
            45, 
            window.innerWidth / window.innerHeight, 
            1, 
            1000 
            );
    camera.position.z = 30;
    camera.position.x = -30;
    camera.position.y = 30;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    
    scene = new THREE.Scene();

    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    
    document.getElementById('webgl').appendChild(renderer.domElement);

    
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    
    var path = 'cubemap/';
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;

    
    scene.background = reflectionCube;

   
    pointLight = getPointLight(1.5, "rgb(255, 220, 180)");
    scene.add(pointLight);

    
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    
    var sunMaterial = getMaterial("basic", "rgb(255, 255, 255)");
    sun = getSphere(sunMaterial, 16, 48);
    scene.add(sun);

    
    var spriteMaterial = new THREE.SpriteMaterial(
            {
                map: new THREE.ImageUtils.loadTexture("img/glow.png")
                , useScreenCoordinates: false
                , color: 0xffffee
                , transparent: false
                , blending: THREE.AdditiveBlending
            });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(70, 70, 1.0);
    sun.add(sprite); 

    
    earth = loadTexturedPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    mercury = loadTexturedPlanet(mercuryData, mercuryData.distanceFromAxis, 0, 0);
    uranus = loadTexturedPlanet(uranusData, uranusData.distanceFromAxis, 0, 0);
    moon = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    urMoon1 = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    urMoon2 = loadTexturedPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    
    ring = getTube(2, 0.05, 480, 0x757064, "ring", earthData.distanceFromAxis);

    
    createVisibleOrbits();

    
    update(renderer, scene, camera, controls);
}


init();
