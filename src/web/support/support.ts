import {
  setWorldConstructor,
  setDefaultTimeout,
  World,
  IWorldOptions,
} from "@cucumber/cucumber";
import { Browser } from "webdriverio";
import { LoginPage } from "../page-objects/login-page";

export class KrakenWorld {
  userId: any;
  device: any;
  testScenarioId: any;
  attach: any;
  driver: any;
  loginPage: LoginPage | null = null;
  constructor(input: IWorldOptions) {
    let params = input.parameters;
    this.userId = params.id;
    this.device = params.device || {};
    this.testScenarioId = params.testScenarioId;
    this.attach = input.attach;
  }
}

setWorldConstructor(KrakenWorld);
setDefaultTimeout(30 * 1000);
