import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { loadGltf } from "@/utils/loaders";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { decomposeMatrix } from "../utils/decomposeMatrix";

class AvatarManager {
  private static instance: AvatarManager = new AvatarManager();
  private scene!: THREE.Scene;
  isModelLoaded = false;

  private constructor() {
    this.scene = new THREE.Scene();
  }

  static getInstance(): AvatarManager {
    return AvatarManager.instance;
  }

  getScene = () => {
    return this.scene;
  };

  loadModel = async (url: string) => {
    this.isModelLoaded = false;
    if (this.scene.children.length === 1) {
      this.scene.children[0].removeFromParent();
    }
    let gltf = await loadGltf(url);
    gltf = gltf.scene;
    // const fbxLoader = new FBXLoader();

    // const gltf: any = await new Promise((resolve, reject) => {
    //   fbxLoader.load(url, resolve, () => {}, reject);
    // });

    gltf.name = 'Head';

    console.log (gltf.name);

    gltf.traverse((obj: any) => (obj.frustumCulled = false));
    this.scene.add(gltf);

    // make hands invisible
    // const LeftHand = this.scene.getObjectByName("LeftHand");
    // const RightHand = this.scene.getObjectByName("RightHand");
    // LeftHand?.scale.set(0, 0, 0);
    // RightHand?.scale.set(0, 0, 0);
    this.isModelLoaded = true;
  };

  updateFacialTransforms = (results: FaceLandmarkerResult, flipped = true) => {
    if (!results || !this.isModelLoaded) return;

    this.updateBlendShapes(results, flipped);
    this.updateTranslation(results, flipped);
  };

  updateBlendShapes = (results: FaceLandmarkerResult, flipped = true) => {
    if (!results.faceBlendshapes) return;

    const blendShapes = results.faceBlendshapes[0]?.categories;
    if (!blendShapes) return;

    this.scene.traverse((obj) => {
      if ("morphTargetDictionary" in obj && "morphTargetInfluences" in obj) {
        const morphTargetDictionary = obj.morphTargetDictionary as {
          [key: string]: number;
        };
        const morphTargetInfluences =
          obj.morphTargetInfluences as Array<number>;

        for (const { score, categoryName } of blendShapes) {
          let updatedCategoryName = categoryName;
          console.log (updatedCategoryName);
          if (flipped && categoryName.includes("Left")) {
            updatedCategoryName = categoryName.replace("Left", "Right");
          } else if (flipped && categoryName.includes("Right")) {
            updatedCategoryName = categoryName.replace("Right", "Left");
          }
          const index = morphTargetDictionary[updatedCategoryName];
          console.log (index);
          morphTargetInfluences[index] = score;
        }
      }
    });
  };

  updateTranslation = (results: FaceLandmarkerResult, flipped = true) => {
    if (!results.facialTransformationMatrixes) return;

    const matrixes = results.facialTransformationMatrixes[0]?.data;
    if (!matrixes) return;

    const { translation, rotation, scale } = decomposeMatrix(matrixes);
    const euler = new THREE.Euler(rotation.x, rotation.y, rotation.z, "ZYX");
    const quaternion = new THREE.Quaternion().setFromEuler(euler);
    if (flipped) {
      // flip to x axis
    }
      quaternion.z *= -2;
      quaternion.y *= -2;
      translation.x *= -1;

    const Head = this.scene.getObjectByName("Head");
    Head?.quaternion.slerp(quaternion, 1.0);

    Head?.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / -6);
    // values empirically calculated
    Head?.position.set(
      translation.x * 0.01,
      (translation.y * 0.01) + 0.66 + (translation.z * 0.0125),
      (translation.z + 54) * 0.0225
    );
  };
}

export default AvatarManager;
