import { STEPS_SCREENSHOTS_PATH } from "../constants/files";
import type { Browser } from "webdriverio";

export type ExtendedBrowser = Browser<"async"> & { stepsCounter: number };

export abstract class AbstractPage {
  driver: ExtendedBrowser;

  constructor(driver: ExtendedBrowser) {
    this.driver = driver;
  }

  async pause(milliseconds = 1000) {
    await this.driver.pause(milliseconds);
  }

  async takeScreenshot(ssName = "screenshot") {
    await this.driver.saveScreenshot(
      `./${STEPS_SCREENSHOTS_PATH}/step${++this.driver
        .stepsCounter}-${ssName}.png`
    );
  }
}
