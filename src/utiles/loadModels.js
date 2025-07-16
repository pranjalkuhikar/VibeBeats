import * as tf from "@tensorflow/tfjs";
import * as faceapi from "face-api.js";

export const loadModels = async () => {
  await tf.setBackend("webgl"); // or 'cpu' if you want
  await tf.ready();
  const MODEL_URL = "/models";
  await faceapi.nets.tinyFaceDetector.loadFromUri(
    MODEL_URL + "/tiny_face_detector"
  );
  await faceapi.nets.faceExpressionNet.loadFromUri(
    MODEL_URL + "/face_expression"
  );
};
