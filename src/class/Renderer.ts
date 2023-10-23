export default class Renderer {
  fps = -1;
  frameCaptured = true;
  frameCount = 0;
  frameData = {};
  frameLength = -1;
  renderComplete = false;
  constructor({ frameLength = 100, fps = 24 }) {
    this.frameLength = frameLength;
    (window as any).getFrameData = this.getFrameData;
  }

  renderCompleted() {
    return this.renderComplete;
  }

  nextFrame() {}

  processFrame() {}

  async captureFrame() {
    this.frameCaptured = false;
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
    this.frameCaptured = true;

    if (this.frameCount >= this.frameLength) {
      this.renderComplete = true;
      console.info("ALL_FRAMES_RENDERED");
    }
  }

  // Accessed from Puppeteer
  getFrameData() {
    this.frameCaptured = false;
    this.frameCount++;
    return this.frameData;
  }
}
