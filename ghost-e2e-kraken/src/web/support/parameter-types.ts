import { defineParameterType } from "@cucumber/cucumber";
import { Before } from "@cucumber/cucumber";
import { getGenerator } from "../data-generators/generator.provider";
import { KrakenWorld } from "./support";

let currentTags: string[] = [];

Before(function (scenario) {
  currentTags = scenario?.pickle?.tags?.map((tag) => tag.name!) || [];
});

defineParameterType({
  regexp: /"([^"]*)"/,
  async transformer(this: KrakenWorld, string: string) {
    if (currentTags.includes("@a-priori")) {
      return getGenerator(this.dictionary, "a-priori").generateValue(string);
    } else if (currentTags.includes("@pseudo")) {
      return getGenerator(this.dictionary, "pseudo").generateValue(string);
    } else {
      return getGenerator(this.dictionary, "random").generateValue(string);
    }
  },
  name: "generated-string",
  useForSnippets: false,
});
