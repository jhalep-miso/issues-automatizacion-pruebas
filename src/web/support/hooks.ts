import { After, Before, BeforeAll } from "@cucumber/cucumber";
import { WebClient } from "kraken-node";
import dns from "dns";
import { KrakenWorld } from "./support";

BeforeAll(async function () {
  dns.setDefaultResultOrder("ipv4first");
});

Before(async function (this: KrakenWorld) {
  this.deviceClient = new WebClient("chrome", {}, this.userId);
  this.driver = await this.deviceClient.startKrakenForUserId(this.userId);
  await this.init();
});

After(async function (this: KrakenWorld) {
  await this.deviceClient.stopKrakenForUserId(this.userId);
});
