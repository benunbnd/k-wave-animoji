import * as THREE from "three";
const DEBUG_UNLOCK = false;
export default class Renderer {
  fps = -1;
  resolution = 1024;
  frameWaiting = false;
  frameCount = 0;
  frameData = {};
  frameLength = -1;
  renderComplete = false;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  constructor({
    frameLength = 100,
    fps = 24,
    scene,
  }: {
    frameLength: number;
    fps: number;
    scene: THREE.Scene;
  }) {
    this.scene = scene;
    this.fps = fps;
    this.frameLength = frameLength;
    this.renderer = new THREE.WebGLRenderer();
    //antialias
    this.renderer.setPixelRatio(2);

    this.camera = new THREE.PerspectiveCamera();
    (window as any).getFrameData = this.getFrameData;
    this.init();
    console.log("Renderer initialized");
  }

  init() {
    let canvas = this.renderer.domElement;
    document.body.appendChild(canvas);
    canvas.id = "renderCanvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this.renderer.setSize(this.resolution, this.resolution);
    this.camera.position.z = 0.6;
  }

  update() {
    this.scene.rotateY(0.01);
  }

  scheduleNextFrame() {
    if (this.frameWaiting && !DEBUG_UNLOCK) {
      //wait for frame to be sent to puppeteer
      setTimeout(this.scheduleNextFrame.bind(this), 1);
      return;
    }

    this.processFrame().then(() => {
      if (!this.renderComplete)
        setTimeout(this.scheduleNextFrame.bind(this), 1);
    });
  }

  startRenderLoop() {
    this.renderComplete = false;
    this.scheduleNextFrame();
  }

  renderCompleted() {
    return this.renderComplete;
  }

  async processFrame() {
    this.frameCount++;
    this.update();
    this.renderer.render(this.scene, this.camera);
    await this.captureFrame();
  }

  async captureFrame() {
    //capture canvas to img element and name after frameCount
    let canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob(resolve as BlobCallback)
    );
    const buffer = await blob.arrayBuffer();

    this.frameData = {
      frameBuffer: Array.from(new Uint8Array(buffer)),
      frameCount: this.frameCount,
    };

    // Log the buffer and frameCount for Puppeteer to pick up
    console.info("FRAME_CAPTURED::");
    this.frameWaiting = true;

    if (this.frameCount >= this.frameLength) {
      this.renderComplete = true;
      console.info("ALL_FRAMES_RENDERED");
    }
  }

  // Accessed from Puppeteer
  getFrameData() {
    this.frameWaiting = false;

    return this.frameData;
  }
}
