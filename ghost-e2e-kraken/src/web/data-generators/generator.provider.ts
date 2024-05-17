import {KrakenRandomGenerator} from "./KrakenRandomGenerator";
import {KrakenPseudoGenerator} from "./KrakenPseudoGenerator";

export function getGenerator(
    dictionary: Map<string, string>,
    string: "a-priori" | "pseudo" | "random"
): Promise<KrakenGenerator> {
    switch (string) {
        case "a-priori":
            return KrakenPseudoGenerator.getInstance(dictionary);

        case "pseudo":
            return KrakenRandomGenerator.getInstance(dictionary);

        case "random":
            return KrakenRandomGenerator.getInstance(dictionary);
    }
}
