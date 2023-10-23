import AvatarManager from "@/class/AvatarManager";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import RenderScene from "./RenderScene";

export default function RenderCanvas() {
  const [scene, setScene] = useState<THREE.Scene | null>();
  const [isLoading, setIsLoading] = useState(true);
  const avatarManager = AvatarManager.getInstance();
  useEffect(() => {
    console.log("mount rendercanvas");
    avatarManager
      .loadModel("/models/male-head-flipped.glb")
      .then(() => {
        setScene(avatarManager.getScene());
        setIsLoading(false);
      })
      .catch((e) => {
        alert(e);
      });
  }, []);

  useEffect(() => {
    console.log("scene changed");
  }, [scene]);

  return (
    <>
      <Canvas
        id="renderCanvas"
        frameloop="never"
        camera={{ fov: 30, position: [0, 0.5, 1] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {scene && <RenderScene scene={scene} />}
      </Canvas>
    </>
  );
}
