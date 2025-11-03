import { initializeApp, getApp, getApps } from "firebase-admin/app";
import { firebaseConfig } from "./config";

const app = getApps().length
  ? getApp()
  : initializeApp({ projectId: firebaseConfig.projectId });

export { app };
