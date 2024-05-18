import { DataGenerator } from "./generator.interface";

const fs = require("fs");
const csv = require("csv-parser");

export class AprioriGenerator implements DataGenerator {

    private response: any[] = [];

    constructor() {
    }

    async initialize() {
        const csvFilePath = "../doc/apriori.csv"
        return new Promise<void>((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on("data", (data: any) => {
                    this.response.push(data);
                })
                .on("end", () => {
                    resolve();
                })
                .on("error", (error: any) => {
                    reject(error);
                });
        });
    }

    generateName(): string {
        return this.response[this.getRandomPosition()].firstName;
    }

    generateSentence(): string {
        return this.response[this.getRandomPosition()].sentence;
    }

    generateParagraph(): string {
        return this.response[this.getRandomPosition()].paragraph;
    }

    generateNumber(): string {
        return this.response[this.getRandomPosition()].number;
    }

    generateEmail(): string {
        return this.response[this.getRandomPosition()].email;
    }

    generateString(): string {
        return this.response[this.getRandomPosition()].string;
    }

    generateDate(): string {
        return this.response[this.getRandomPosition()].datetime;
    }

    generateUrl(): string {
        return this.response[this.getRandomPosition()].url;
    }

    getRandomPosition(): number {
        return Math.floor(Math.random() * this.response.length);
    }
}
