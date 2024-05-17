const axios = require("axios");

export class KrakenPseudoGenerator implements KrakenGenerator {
    private static singleton: KrakenPseudoGenerator | null = null;
    private dictionary: Map<string, string>;
    private response: any[] = [];

    private constructor(dictionary: Map<string, string>) {
        this.dictionary = dictionary;
    }


    public static async getInstance(dictionary: Map<string, string>): Promise<KrakenPseudoGenerator> {
        if (!KrakenPseudoGenerator.singleton) {
            const instance = new KrakenPseudoGenerator(dictionary);
            await instance.initialize();
            KrakenPseudoGenerator.singleton = instance;
        }
        return KrakenPseudoGenerator.singleton;
    }

    private async initialize() {
        try {
            const response = await axios.get(
                "https://my.api.mockaroo.com/mock.json?key=d8be7f40"
            );
            this.response = response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    public async generateValue(string: string): Promise<string> {
        let finalString = string;
        if (KrakenPseudoGenerator.stringIsAFakerReuse(string)) {
            finalString = this.reuseValueForKey(finalString);
        } else if (KrakenPseudoGenerator.stringIsAFaker(string)) {
            finalString = this.generateValueForKey(finalString);
        }
        return finalString;
    }

    private generateValueForKey(key: string): string {
        let value = "";
        if (key.startsWith("$name")) {
            value = this.generateName();
        } else if (key.startsWith("$number")) {
            value = this.generateNumber();
        } else if (key.startsWith("$email")) {
            value = this.generateEmail();
        } else if (key.startsWith("$string")) {
            value = this.generateString();
        } else if (key.startsWith("$date")) {
            value = this.generateDate();
        } else if (key.startsWith("$url")) {
            value = this.generateUrl();
        } else if (key.startsWith("$sentence")) {
            value = this.generateSentence();
        } else if (key.startsWith("$paragraph")) {
            value = this.generateParagraph();
        } else {
            throw new Error(`ERROR: Faker key not supported.`);
        }
        this.saveKeyValueInDict(key, value);
        return value;
    }

    private reuseValueForKey(key: string): string {
        const value = this.dictionary.get(key.substring(1));
        if (value == null) {
            throw new Error(`ERROR: Key does not exist.`);
        }
        return value;
    }

    private getDictionary(): Map<string, string> {
        return this.dictionary;
    }

    private saveKeyValueInDict(key: string, value: string) {
        this.dictionary.set(key, value);
    }

    private getRandomPosition(): number {
        return Math.floor(Math.random() * this.response.length);
    }

    private generateName(): string {
        return this.response[this.getRandomPosition()].name;
    }

    private generateSentence(): string {
        return this.response[this.getRandomPosition()].sentence;
    }

    private generateParagraph(): string {
        return this.response[this.getRandomPosition()].paragraph;
    }

    private generateNumber(): string {
        return this.response[this.getRandomPosition()].number;
    }

    private generateEmail(): string {
        return this.response[this.getRandomPosition()].email;
    }

    private generateString(): string {
        return this.response[this.getRandomPosition()].string;
    }

    private generateDate(): string {
        return this.response[this.getRandomPosition()].datetime;
    }

    private generateUrl(): string {
        return this.response[this.getRandomPosition()].url;
    }

    static stringIsAFaker(string: string): boolean {
        return string.startsWith("$");
    }

    static stringIsAFakerReuse(string: string): boolean {
        return string.startsWith("$$");
    }
}
