import AvatarManager from "@/class/AvatarManager";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";

import Renderer from "@/class/Renderer";
export default function RenderCanvas() {
  const [scene, setScene] = useState<THREE.Scene | null>();
  const [isLoading, setIsLoading] = useState(true);
  const avatarManager = AvatarManager.getInstance();
  const kRendererRef = useRef<Renderer>();

  useEffect(() => {
    setIsLoading(true);
    const avatarManager = AvatarManager.getInstance();
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
    if (!kRendererRef.current) {
      console.log("create renderer");
      kRendererRef.current = new Renderer({ frameLength: 12, fps: 24 });
    }
    if (scene && kRendererRef.current.scene === undefined) {
      kRendererRef.current.init(scene);
      kRendererRef.current.startRenderLoop();
    }
  }, [scene, kRendererRef]);

  return <></>;
}
