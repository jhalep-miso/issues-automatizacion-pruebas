import { After, Before, BeforeAll, AfterAll } from "@cucumber/cucumber";
import dns from "dns";
import { KrakenWorld } from "./support";
import { CustomWebClient } from "./custom-web-client";
import path from "path";

const REPORT_PATH_ARGS_INDEX = 5;
const FEATURE_PATH_ARGS_INDEX = 6;

BeforeAll(async function () {
  dns.setDefaultResultOrder("ipv4first");
});

Before(async function (this: KrakenWorld) {
  this.deviceClient = new CustomWebClient("chrome", {}, this.userId);
  this.driver = await this.deviceClient.startKrakenForUserId(this.userId);
  await this.init();
  const scenarioFileName = getScenarioFileName();
  console.log(`\x1b[33m Running scenario: ${scenarioFileName} \x1b[0m`);
});

After(async function (this: KrakenWorld) {
  await this.deviceClient.stopKrakenForUserId(this.userId);
});

AfterAll(async function () {
  const reportHtml = getHtmlReportPath();
  console.log(`\x1b[36m Done! Report saved to: ${reportHtml} \x1b[0m`);
});

function getScenarioFileName() {
  const scenarioPath = process.argv[FEATURE_PATH_ARGS_INDEX] || "";
  const scenarioFile = path.basename(scenarioPath || "");
  return scenarioFile;
}

function getHtmlReportPath() {
  const reportPath = process.argv[REPORT_PATH_ARGS_INDEX] || "";
  const dirName = path.dirname(reportPath.replace("json:", ""));
  const htmlReport = path.join(dirName, "feature_report.html");
  return htmlReport;
}
