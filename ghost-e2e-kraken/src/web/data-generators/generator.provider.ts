import {KrakenRandomGenerator} from "./KrakenRandomGenerator";
import {KrakenPseudoGenerator} from "./KrakenPseudoGenerator";
import {KrakenDataGenerator} from "./KrakenDataGenerator";
import {KrakenAPrioriGenerator} from "./KrakenAPrioriGenerator";


export function getGenerator(
    dictionary: Map<string, string>,
    string: "a-priori" | "pseudo" | "random"
): Promise<KrakenDataGenerator> {
    switch (string) {
        case "a-priori":
            return KrakenAPrioriGenerator.getInstance(dictionary);

        case "pseudo":
            return KrakenPseudoGenerator.getInstance(dictionary);

        case "random":
            return KrakenRandomGenerator.getInstance(dictionary);
    }
}
