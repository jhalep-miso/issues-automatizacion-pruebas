import { After, Before, BeforeAll, AfterAll } from "@cucumber/cucumber";
import dns from "dns";
import { KrakenWorld } from "./support";
import { CustomWebClient } from "./custom-web-client";
import {
  createScreenshotsFolder,
  getHtmlReportPath,
  getScenarioFileName,
} from "../utils/files";

BeforeAll(async function () {
  dns.setDefaultResultOrder("ipv4first");
  await createScreenshotsFolder();
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
