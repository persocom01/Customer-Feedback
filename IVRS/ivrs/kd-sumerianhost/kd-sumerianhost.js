"use strict";
class KDSumerianHost {
    constructor(a) {
        let b = a || {};
        "string" === typeof a && (b = { host: { name: a.toLowerCase() } });
        this.awsConfig = b.awsConfig;
        this.path = b.distPath || "./kd-sumerianhost/";
        window.kdSumerianHostPath = this.path;
        this.logsEnabled = "undefined" !== typeof b.logsEnabled ? b.logsEnabled : !0;
        this.talkKey = b.talkKey || " ";
        this.container = b.container || document.body;
        this.useSpeechRecognitionAPI = b.useSpeechRecognitionAPI;
        b.host.name = (b.host.name || "").toLowerCase();
        this.initialHost = b.host;
        this.tag = "[KDSumerianHost]";
        this.maleHosts = ["jay", "luke", "preston", "wes"];
        this.femaleHosts = ["cristine", "fiona", "grace", "maya"];
        this.hosts = [];
        this.renderFn = [];
        this.ios =
            "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform) ||
            (navigator.userAgent.includes("Mac") && "ontouchend" in document);
        this.init();
    }
    disableTalkKey() {
        this.talkKey = null;
    }
    setTalkKey(a) {
        this.talkKey = ("" + a).toUpperCase();
    }
    getFirst(a, b, c) {
        for (let d = 0; d < a.length; d++) if (a[d][b] === c) return a[d];
        return null;
    }
    getHost(a) {
        return this.getFirst(this.hosts, "name", a);
    }
    getHost3DObject(a) {
        return (a = this.getHost(a)) ? a.character : null;
    }
    setupTTS() {
        this.audioPrimed &&
            this.hosts.forEach((a) => {
                if (a.isSumerian && !a.host.TextToSpeechFeature) {
                    var b = new THREE.AudioListener();
                    this.camera.add(b);
                    a.host.addFeature(HOST.aws.TextToSpeechFeature, !1, {
                        listener: b,
                        attachTo: a.audioAttachJoint || a.character,
                        voice: a.voice,
                        engine: a.voiceEngine,
                    });
                }
            });
    }
    initHost(a) {
        let b = this.getHost(a);
        const c = new HOST.HostObject({ owner: b.character, clock: this.clock });
        this.renderFn.push(() => {
            c.update();
        });
        b.host = c;
        if (b.isSumerian) {
            var [d, f, n, h, g, k, q] = b.clips;
            c.addFeature(HOST.anim.AnimationFeature);
            c.AnimationFeature.addLayer("Base");
            c.AnimationFeature.addAnimation("Base", d[0].name, HOST.anim.AnimationTypes.single, { clip: d[0] });
            c.AnimationFeature.playAnimation("Base", d[0].name);
            c.AnimationFeature.addLayer("Face", { blendMode: HOST.anim.LayerBlendModes.Additive });
            THREE.AnimationUtils.makeClipAdditive(g[0]);
            c.AnimationFeature.addAnimation("Face", g[0].name, HOST.anim.AnimationTypes.single, {
                clip: THREE.AnimationUtils.subclip(g[0], g[0].name, 1, 30 * g[0].duration, 30),
            });
            c.AnimationFeature.playAnimation("Face", g[0].name);
            c.AnimationFeature.addLayer("Blink", {
                blendMode: HOST.anim.LayerBlendModes.Additive,
                transitionTime: 0.075,
            });
            k.forEach((e) => {
                THREE.AnimationUtils.makeClipAdditive(e);
            });
            c.AnimationFeature.addAnimation("Blink", "blink", HOST.anim.AnimationTypes.randomAnimation, {
                playInterval: 3,
                subStateOptions: k.map((e) => ({ name: e.name, loopCount: 1, clip: e })),
            });
            c.AnimationFeature.playAnimation("Blink", "blink");
            c.AnimationFeature.addLayer("Talk", {
                transitionTime: 0.75,
                blendMode: HOST.anim.LayerBlendModes.Additive,
            });
            c.AnimationFeature.setLayerWeight("Talk", 0);
            a = f.find((e) => "stand_talk" === e.name);
            f.splice(f.indexOf(a), 1);
            c.AnimationFeature.addAnimation("Talk", a.name, HOST.anim.AnimationTypes.single, {
                clip: THREE.AnimationUtils.makeClipAdditive(a),
            });
            c.AnimationFeature.playAnimation("Talk", a.name);
            c.AnimationFeature.addLayer("Gesture", {
                transitionTime: 0.5,
                blendMode: HOST.anim.LayerBlendModes.Additive,
            });
            n.forEach((e) => {
                const { name: l } = e,
                    p = b.gestureConfig[l];
                THREE.AnimationUtils.makeClipAdditive(e);
                void 0 !== p
                    ? (p.queueOptions.forEach((m, r) => {
                          m.clip = THREE.AnimationUtils.subclip(e, `${l}_${m.name}`, m.from, m.to, 30);
                      }),
                      c.AnimationFeature.addAnimation("Gesture", l, HOST.anim.AnimationTypes.queue, p))
                    : c.AnimationFeature.addAnimation("Gesture", l, HOST.anim.AnimationTypes.single, { clip: e });
            });
            c.AnimationFeature.addLayer("Emote", { transitionTime: 0.5 });
            h.forEach((e) => {
                const { name: l } = e;
                c.AnimationFeature.addAnimation("Emote", l, HOST.anim.AnimationTypes.single, { clip: e, loopCount: 1 });
            });
            c.AnimationFeature.addLayer("Viseme", {
                transitionTime: 0.12,
                blendMode: HOST.anim.LayerBlendModes.Additive,
            });
            c.AnimationFeature.setLayerWeight("Viseme", 0);
            a = f.map((e) => {
                THREE.AnimationUtils.makeClipAdditive(e);
                return { name: e.name, clip: THREE.AnimationUtils.subclip(e, e.name, 1, 2, 30), weight: 0 };
            });
            c.AnimationFeature.addAnimation("Viseme", "visemes", HOST.anim.AnimationTypes.freeBlend, {
                blendStateOptions: a,
            });
            c.AnimationFeature.playAnimation("Viseme", "visemes");
            b.poiConfig.forEach((e) => {
                c.AnimationFeature.addLayer(e.name, { blendMode: HOST.anim.LayerBlendModes.Additive });
                e.blendStateOptions.forEach((p) => {
                    let m = q.find((r) => r.name === p.clip);
                    THREE.AnimationUtils.makeClipAdditive(m);
                    p.clip = THREE.AnimationUtils.subclip(m, m.name, 1, 2, 30);
                });
                let l = Object.assign({}, e);
                c.AnimationFeature.addAnimation(e.name, e.animation, HOST.anim.AnimationTypes.blend2d, l);
                c.AnimationFeature.playAnimation(e.name, e.animation);
                e.reference = b.character.getObjectByName(e.reference.replace(":", ""));
            });
            a = b.bindPoseOffset;
            void 0 !== a &&
                (c.AnimationFeature.addLayer("BindPoseOffset", { blendMode: HOST.anim.LayerBlendModes.Additive }),
                c.AnimationFeature.addAnimation("BindPoseOffset", a.name, HOST.anim.AnimationTypes.single, {
                    clip: THREE.AnimationUtils.subclip(a, a.name, 1, 2, 30),
                }),
                c.AnimationFeature.playAnimation("BindPoseOffset", a.name));
            c.addFeature(
                HOST.LipsyncFeature,
                !1,
                { layers: [{ name: "Viseme", animation: "visemes" }] },
                {
                    layers: [
                        {
                            name: "Talk",
                            animation: "stand_talk",
                            blendTime: 0.75,
                            easingFn: HOST.anim.Easing.Quadratic.InOut,
                        },
                    ],
                }
            );
            c.addFeature(HOST.GestureFeature, !1, {
                layers: {
                    Gesture: { holdTime: 1, minimumInterval: 3 },
                    Emote: { blendTime: 0.5, easingFn: HOST.anim.Easing.Quadratic.InOut },
                },
            });
            b.gestureMap = c.GestureFeature.createGestureMap();
            b.gestureArray = c.GestureFeature.createGenericGestureArray(["Gesture"]);
            c.addFeature(
                HOST.PointOfInterestFeature,
                !1,
                { target: this.camera, lookTracker: b.lookJoint, scene: this.scene },
                { layers: b.poiConfig },
                { layers: [{ name: "Blink" }] }
            );
        }
    }
    loadScript(a) {
        if (a)
            return new Promise((b, c) => {
                const d = document.createElement("script");
                d.src = a;
                d.addEventListener("load", b);
                d.addEventListener("error", () => c("[kdUI] Error in loading script: " + a));
                d.addEventListener("abort", () => c("[kdUI] Script loading aborted: " + a));
                document.head ? document.head.appendChild(d) : document.body.appendChild(d);
            });
    }
    loadStyle(a, b) {
        if (a)
            return new Promise((c, d) => {
                const f = document.createElement("link");
                f.rel = "stylesheet";
                f.href = a;
                f.addEventListener("load", c);
                f.addEventListener("error", () => d("Error loading stylesheet: " + a));
                f.addEventListener("abort", () => d("Stylesheet loading aborted: " + a));
                b
                    ? document.head
                        ? document.head.insertBefore(f, document.head.firstChild)
                        : document.body.insertBefore(f, document.body.firstChild)
                    : document.head
                    ? document.head.appendChild(f)
                    : document.body.appendChild(f);
            });
    }
    loadDependencies(a, b) {
        return new Promise((c, d) => {
            let f = 0,
                n = (a || []).length + (b || []).length;
            if (0 === n) c();
            else {
                var h = () => {
                    f++;
                    f === n && c();
                };
                (a || []).forEach((g) => {
                    this.loadScript(this.path + g + ".js")
                        .then(h)
                        .catch((k) => {
                            this.log(k);
                            d();
                        });
                });
                (b || []).forEach((g) => {
                    this.loadStyle(this.path + g + ".css")
                        .then(h)
                        .catch((k) => {
                            this.log(k);
                            d();
                        });
                });
            }
        });
    }
    createSilentAudioFile(a) {
        const b = new ArrayBuffer(10),
            c = new DataView(b);
        c.setUint32(0, a, !0);
        c.setUint32(4, a, !0);
        c.setUint16(8, 1, !0);
        return `data:audio/wav;base64,UklGRisAAABXQVZFZm10IBAAAAABAAEA${window
            .btoa(String.fromCharCode(...new Uint8Array(b)))
            .slice(0, 13)}AgAZGF0YQcAAACAgICAgICAAAA=`;
    }
    playNothing() {
        var a = window.AudioContext || window.webkitAudioContext;
        if (a) {
            a = new a();
            const b = new Audio(this.createSilentAudioFile(a.sampleRate));
            a.createMediaElementSource(b).connect(a.destination);
            b.play()
                .then(() => {
                    this.log("Audio started.");
                })
                .catch((c) => {
                    this.log(c);
                    this.log("Audio failed.");
                });
        }
    }
    init() {
        this.log("Loading dependencies ...");
        let a = [];
        window.AWS || a.push("aws-sdk-2.645.0.min");
        window.THREE || a.push("three.min");
        this.loadDependencies(a, ["kd-sumerianhost"]).then(() => {
            let b = [];
            window.THREE.GLTFLoader || b.push("three.GLTFLoader");
            window.HOST || b.push("host.three");
            b.push("audio-recorder");
            this.loadDependencies(b).then(() => {
                this.onDependenciesLoaded();
            });
        });
    }
    addLights() {
        var a = new THREE.HemisphereLight(16777215, 0, 0.6);
        a.position.set(0, 1, 0);
        a.intensity = 0.75;
        this.scene.add(a);
        a = new THREE.DirectionalLight(16777215);
        a.position.set(2, 4, 5);
        a.castShadow = !0;
        a.shadow.mapSize.width = 1024;
        a.shadow.mapSize.height = 1024;
        a.shadow.camera.top = 2.5;
        a.shadow.camera.bottom = -2.5;
        a.shadow.camera.left = -2.5;
        a.shadow.camera.right = 2.5;
        a.shadow.camera.near = 0.1;
        a.shadow.camera.far = 40;
        this.scene.add(a);
        const b = new THREE.Object3D();
        a.add(b);
        b.position.set(0, -0.5, -1);
        a.target = b;
    }
    renderScene() {
        var a = this.container.getBoundingClientRect();
        let b = new THREE.WebGLRenderer({ antialias: !0 });
        b.setPixelRatio(window.devicePixelRatio);
        b.setSize(a.width, a.height, !1);
        b.outputEncoding = THREE.sRGBEncoding;
        b.shadowMap.enabled = !0;
        b.domElement.className = "kd-sumerianhost";
        this.renderer = b;
        this.container.appendChild(b.domElement);
        a = new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(0.8), a.width / a.height, 0.1, 1e3);
        a.position.set(0, 1, 0);
        this.camera = a;
        a = new THREE.Scene();
        a.background = new THREE.Color(13421772);
        this.scene = a;
        this.clock = new THREE.Clock();
        this.addLights();
        let c = () => {
            requestAnimationFrame(c);
            this.renderFn.forEach((d) => {
                d();
            });
            this.renderer.render(this.scene, this.camera);
        };
        c();
        window.addEventListener(
            "resize",
            () => {
                let d = this.container.getBoundingClientRect();
                this.camera.aspect = d.width / d.height;
                this.camera.updateProjectionMatrix();
                b.setSize(d.width, d.height, !1);
            },
            !1
        );
    }
    loadAsset(a, b, c) {
        return new Promise((d) => {
            a.load(b, async (f) => {
                "AsyncFunction" === c[Symbol.toStringTag] ? ((f = await c(f)), d(f)) : d(c(f));
            });
        });
    }
    async addHost(a) {
        let b = a || {};
        if (b.name) {
            this.log(`Loading host: "${b.name}"`);
            var c = { name: b.name, autoSSML: "undefined" === typeof b.autoSSML ? !0 : b.autoSSML },
                d = `${this.path}assets/glTF/animations`,
                { character: f, bindPoseOffset: n } = await this.loadAsset(
                    this.gltfLoader,
                    `${`${this.path}assets/glTF/characters/${b.name}`}/${b.name}.gltf`,
                    (h) => {
                        const g = h.scene;
                        this.scene.add(g);
                        [h] = h.animations;
                        h && THREE.AnimationUtils.makeClipAdditive(h);
                        g.traverse((q) => {
                            q.isMesh && (q.castShadow = !0);
                        });
                        let k = b.position || [0, 0, -3];
                        g.position.set(k[0] || 0, k[1] || 0, k[2] || -3);
                        g.visible = !1;
                        return { character: g, bindPoseOffset: h };
                    }
                );
            c.character = f;
            c.bindPoseOffset = n;
            a = Array.isArray(b.animations) ? b.animations : [];
            if (0 === a.length) {
                let h = this.maleHosts.includes(b.name);
                if (h || this.femaleHosts.includes(b.name)) {
                    a = "stand_idle lipsync gesture emote face_idle blink poi".split(" ");
                    let g = `${d}/adult_female`;
                    h && (g = `${d}/adult_male`);
                    c.gestureConfig = await fetch(`${g}/gesture.json`).then((k) => k.json());
                    c.poiConfig = await fetch(`${g}/poi.json`).then((k) => k.json());
                    c.isSumerian = !0;
                    c.animationsPath = g;
                }
            } else c.animationsPath = `${d}/${b.name}`;
            c.voice = b.voice || (this.maleHosts.includes(b.name) ? "Matthew" : "Joanna");
            c.voiceEngine = b.voiceEngine || "standard";
            c.voiceStyle = b.voiceStyle || "";
            try {
                c.audioAttachJoint = f.getObjectByName(b.audioAttachJoint || "chardef_c_neckB");
            } catch (h) {
                b.audioAttachJoint && this.log("audioAttachJoint object not found in model");
            }
            try {
                c.lookJoint = f.getObjectByName(b.lookJoint || "charjx_c_look");
            } catch (h) {
                b.lookJoint && this.log("lookJoint object not found in model");
            }
            d = [];
            0 < a.length &&
                (d = await Promise.all(
                    a.map((h, g) =>
                        this.loadAsset(this.gltfLoader, `${c.animationsPath}/${h}.glb`, async (k) => k.animations)
                    )
                ));
            c.clips = d;
            this.hosts.push(c);
            this.initHost(b.name);
            this.setupTTS();
            c.character.visible = !0;
            this.log("Host loaded");
            this.raiseEvent("hostloaded", b.name);
        } else this.log('[addHost] Missing parameter "name".');
    }
    raiseEvent(a, b) {
        a = new CustomEvent("kdhost-" + a, { detail: b, bubbles: !0, cancelable: !0 });
        this.container.dispatchEvent(a);
    }
    log(a) {
        this.logsEnabled && console.log(this.tag, a);
    }
    onDependenciesLoaded() {
        let a = (b) => {
            (b.keyCode && 48 > b.keyCode) ||
                (this.initSpeechInput(),
                document.removeEventListener("click", a, !1),
                document.removeEventListener("keyup", a, !1));
        };
        document.addEventListener("click", a, !1);
        document.addEventListener("keyup", a, !1);
        if (this.awsConfig) {
            window.AWS.config.region = this.awsConfig.region;
            window.AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: this.awsConfig.identityPoolId,
            });
            const b = new AWS.Polly(),
                c = new AWS.Polly.Presigner();
            HOST.aws.TextToSpeechFeature.initializeService(b, c, window.AWS.VERSION);
        }
        this.gltfLoader = new THREE.GLTFLoader();
        this.renderScene();
        this.ios && this.addTapToPlay();
        this.log("Initialization complete");
        this.raiseEvent("ready");
        this.initialHost && this.addHost(this.initialHost);
    }
    addTapToPlay() {
        this.container.style.position || (this.container.style.position = "relative");
        this.container.style.textAlign = "center";
        let a = document.createElement("DIV");
        a.className = "kd-sumerianhost-play-speech";
        a.innerHTML = "&#9658; Play Speech";
        a.addEventListener("click", () => {
            this.deferredSpeech &&
                (this._speak(this.deferredSpeech.message, this.deferredSpeech.hostname),
                (a.style.visibility = "hidden"));
        });
        this.container.append(a);
    }
    startListening() {
        try {
            if (this.useSpeechRecognitionAPI)
                if (this.speechrec) this.stopAllSpeech(), this.speechrec.start();
                else {
                    this.log("Speech Recognition is not initialized.");
                    return;
                }
            else if (this.audioRecorder) this.stopAllSpeech(), this.audioRecorder.startRecording();
            else {
                this.log("Audio Input is not initialized.");
                return;
            }
            this.listening = !0;
            this.raiseEvent("listening-started");
            this.log("Listening started");
        } catch (a) {
            this.log(a), (this.listening = !1), this.raiseEvent("listening-stopped");
        }
    }
    stopListening() {
        if (this.listening) {
            this.listening = !1;
            try {
                if (this.useSpeechRecognitionAPI)
                    if (this.speechrec) this.speechrec.stop();
                    else return;
                else if (this.audioRecorder)
                    this.audioRecorder.stopRecording(),
                        this.audioRecorder.exportWAV((a) => {
                            this.raiseEvent("audioinput", a);
                        });
                else return;
            } catch (a) {
                this.log(a);
            }
            this.raiseEvent("listening-stopped");
            this.log("Listening stopped");
        }
    }
    initSpeechInput() {
        if (!this.speechrec && !this.audioRecorder) {
            this.playNothing();
            this.audioPrimed = !0;
            try {
                if (
                    (document.addEventListener("keydown", (a) => {
                        this.talkKey && !a.repeat && a.keyCode === this.talkKey.charCodeAt(0) && this.startListening();
                    }),
                    document.addEventListener("keyup", (a) => {
                        this.talkKey && a.keyCode === this.talkKey.charCodeAt(0) && this.stopListening();
                    }),
                    this.useSpeechRecognitionAPI)
                ) {
                    let a = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (a) {
                        let b = new a();
                        b.onresult = (c) => {
                            this.raiseEvent("speechinput", c.results[c.resultIndex][0].transcript);
                        };
                        this.speechrec = b;
                    } else this.log("Speech Recognition is not supported in this browser.");
                    this.setupTTS();
                } else
                    (this.audioRecorder = window.audioControl({ checkAudioSupport: !1 })),
                        this.audioRecorder.supportsAudio((a) => {
                            this.setupTTS();
                        });
            } catch (a) {
                this.log(a);
            }
        }
    }
    speak(a, b) {
        b || (b = this.initialHost ? this.initialHost.name : "");
        b &&
            (this.ios
                ? ((this.deferredSpeech = { message: a, hostname: b }),
                  (document.querySelector(".kd-sumerianhost-play-speech").style.visibility = "visible"))
                : this._speak(a, b));
    }
    _speak(a, b) {
        if ((b = this.getHost(b)))
            b.autoSSML
                ? ((a = HOST.aws.TextToSpeechUtils.autoGenerateSSMLMarks(a, b.gestureMap, b.gestureArray)),
                  "neural" === b.voiceEngine &&
                      b.voiceStyle &&
                      (a = `<speak><amazon:domain name="${b.voiceStyle}">${a.substring(
                          7,
                          a.length - 8
                      )}</amazon:domain></speak>`),
                  b.host.TextToSpeechFeature.play(a))
                : b.host.TextToSpeechFeature.play(a);
    }
    stopAllSpeech() {
        this.hosts.forEach((a) => {
            a.host.TextToSpeechFeature.stop();
        });
    }
    stopSpeaking(a) {
        a || (a = this.initialHost ? this.initialHost.name : "");
        a && (a = this.getHost(a)) && a.host.TextToSpeechFeature.stop();
    }
}
window.KDSumerianHost = KDSumerianHost;
