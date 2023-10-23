import AvatarManager from "@/class/AvatarManager";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";

import Renderer from "@/class/Renderer";
export default function RenderCanvas() {
  const [scene, setScene] = useState<THREE.Scene | null>();
  const [isLoading, setIsLoading] = useState(true);
  const avatarManager = AvatarManager.getInstance();
  let kRenderer: Renderer | null = null;
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
    if (!kRenderer && scene) {
      kRenderer = new Renderer({ frameLength: 50, fps: 24, scene });
      kRenderer.startRenderLoop();
    }
  }, [scene]);

  return <></>;
}
