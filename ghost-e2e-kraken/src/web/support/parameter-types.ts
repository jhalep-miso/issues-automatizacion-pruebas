import {Before, defineParameterType} from "@cucumber/cucumber";
import {getGenerator} from "../data-generators/generator.provider";
import {KrakenWorld} from "./support";
import {KrakenDataGenerator} from "../data-generators/KrakenDataGenerator";

let currentTags: string[] = [];

Before(function (scenario) {
    currentTags = scenario?.pickle?.tags?.map((tag) => tag.name!) || [];
});

defineParameterType({
    regexp: /"([^"]*)"/,
    async transformer(this: KrakenWorld, string: string) {
        let generator: KrakenDataGenerator;

        if (currentTags.includes("@a-priori")) {
            generator = await getGenerator(this.dictionary, "a-priori");
        } else if (currentTags.includes("@pseudo")) {
            generator = await getGenerator(this.dictionary, "pseudo");
        } else {
            generator = await getGenerator(this.dictionary, "random");
        }

        return generator.generateValue(string);
    },
    name: "generated-string",
    useForSnippets: false,
});
