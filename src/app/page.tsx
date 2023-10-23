"use client";

import Head from "next/head";
import dynamic from "next/dynamic";
import RenderCanvas from "../components/RendererCanvas";

// Use dynamic loading to fix document undefined error
const FaceLandmarkCanvas = dynamic(
  () => {
    return import("../components/FaceLandmarkCanvas");
  },
  { ssr: false }
);

export default function Home() {
  const urlParams = new URLSearchParams(window.location.search);
  const renderParam = urlParams.get("render");
  if (renderParam) {
    return <RenderCanvas />;
  }
  return (
    <div className="flex flex-col items-center px-2 pt-10 bg-gradient-to-r from-purple-500 to-blue-800 min-h-screen text-white">
      <Head>
        <title>Mediapie FaceLandmarker Demo</title>
        <meta
          name="description"
          content="A demo application showcasing Mediapie FaceLandmarker's real-time facial landmark and blendshape score estimation."
        />
        <meta
          name="keywords"
          content="Mediapie, FaceLandmarker, AR Filter, ReadyPlayerMe, Facial landmarks, tensorflow-js"
        />
      </Head>
      <div className="flex justify-center w-full">
        <FaceLandmarkCanvas />
      </div>
    </div>
  );
}
