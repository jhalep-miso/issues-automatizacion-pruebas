import {DataGenerator} from "data-generators";

export interface KrakenDataGenerator extends DataGenerator {
    generateValue(string: string): Promise<string>;
}