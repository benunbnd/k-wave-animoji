import AvatarManager from "@/class/AvatarManager";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Renderer from "@/class/Renderer";
import { useEffect } from "react";

interface RendererProps {
  scene: THREE.Scene;
}

const kRenderer = new Renderer({ frameLength: 50, fps: 24 });

export default function RenderScene({ scene }: RendererProps) {
  const { clock } = useThree();

  //force clock not to update delta
  useEffect(() => {
    clock.start();
    clock.elapsedTime = 0;
  }, [clock]);

  /*
  // render loop -  TODO: need to make it so we can run faster than realtime
  useFrame(({ gl, scene, camera }) => {
    if (kRenderer.renderComplete || !kRenderer.frameCaptured) return;
    console.log("USEFRAME");
    clock.elapsedTime += 1 / kRenderer.fps;

    gl.render(scene, camera);
    kRenderer.captureFrame();
  }, 1);
*/
  useThree(({ gl, scene, camera }) => {
    while (!kRenderer.renderComplete) {
      if (!kRenderer.frameCaptured) return;
      console.log("usethree");
      clock.elapsedTime += 1 / kRenderer.fps;

      gl.render(scene, camera);
      kRenderer.captureFrame();
    }
  });

  const renderLoop = () => {};

  return (
    <>
      <ambientLight />
      <directionalLight />
      <OrbitControls
        target={[0, 0, 0]}
        enableDamping={false}
        enableRotate={false}
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
      />
      <primitive object={scene} />
    </>
  );
}
