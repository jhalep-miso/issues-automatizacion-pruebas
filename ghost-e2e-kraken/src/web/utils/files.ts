import path from "path";
import fs from "fs/promises";
import { FEATURE_PATH_ARGS_INDEX } from "../constants/args";
import { STEPS_SCREENSHOTS_PATH } from "../constants/files";

export function getScenarioFileName() {
  const scenarioPath = process.argv[FEATURE_PATH_ARGS_INDEX] || "";
  const scenarioFile = path.basename(scenarioPath || "");
  return scenarioFile;
}

export function getScreenshotsPath() {
  const scenarioName = getScenarioName();
  return path.join(STEPS_SCREENSHOTS_PATH, scenarioName);
}

export function getScenarioName() {
  const scenarioFile = getScenarioFileName();
  return scenarioFile.split(".")[0] || "unknown-scenario";
}

export async function createScreenshotsFolder() {
  const fullPath = getScreenshotsPath();
  try {
    await fs.access(fullPath);
  } catch (error) {
    await fs.mkdir(fullPath, { recursive: true });
  }
}
