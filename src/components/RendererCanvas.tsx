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
    console.log("scene changed");
    if (!kRendererRef.current && scene) {
      kRendererRef.current = new Renderer({ frameLength: 50, fps: 24, scene });
      kRendererRef.current.startRenderLoop();
    }
  }, [scene]);

  return <></>;
}
