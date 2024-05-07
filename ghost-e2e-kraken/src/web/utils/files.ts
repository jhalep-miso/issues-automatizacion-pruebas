import path from "path";
import fs from "fs/promises";
import {
  FEATURE_PATH_ARGS_INDEX,
  REPORT_PATH_ARGS_INDEX,
} from "../constants/args";
import { STEPS_SCREENSHOTS_PATH } from "../constants/files";

export function getScenarioFileName() {
  const scenarioPath = process.argv[FEATURE_PATH_ARGS_INDEX] || "";
  const scenarioFile = path.basename(scenarioPath || "");
  return scenarioFile;
}

export function getHtmlReportPath() {
  const reportPath = process.argv[REPORT_PATH_ARGS_INDEX] || "";
  const dirName = path.dirname(reportPath.replace("json:", ""));
  const htmlReport = path.join(dirName, "feature_report.html");
  return htmlReport;
}

export async function createScreenshotsFolder() {
  try {
    await fs.access(STEPS_SCREENSHOTS_PATH);
  } catch (error) {
    await fs.mkdir(STEPS_SCREENSHOTS_PATH, { recursive: true });
  }
}
