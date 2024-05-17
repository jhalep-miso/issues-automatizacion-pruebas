import { DataGenerator } from "data-generators";
import { KrakenRandomGenerator } from "./KrakenRandomGenerator";

interface KrakenDataGenerator extends DataGenerator {
  generateValue(string: string): Promise<string>;
}

export function getGenerator(
  dictionary: Map<string, string>,
  string: "a-priori" | "pseudo" | "random"
): KrakenDataGenerator {
  switch (string) {
    case "a-priori":
      throw new Error("A priori generator not implemented");

    case "pseudo":
      throw new Error("Pseudo random generator not implemented");

    case "random":
      return KrakenRandomGenerator.getInstance(dictionary);
  }
}
