import faker from "@faker-js/faker";

export class KrakenRandomGenerator implements KrakenGenerator  {
  private static singleton: KrakenRandomGenerator;
  private dictionary: Map<string, string>;

  constructor(dictionary: Map<string, string>) {
    this.dictionary = dictionary;
  }

  public static getInstance(
      dictionary: Map<string, string>
  ): Promise<KrakenRandomGenerator> {
    return new Promise((resolve, reject) => {
      try {
        if (!KrakenRandomGenerator.singleton) {
          KrakenRandomGenerator.singleton = new KrakenRandomGenerator(dictionary);
        }
        resolve(KrakenRandomGenerator.singleton);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async generateValue(string: string) {
    let finalString = string;
    if (KrakenRandomGenerator.stringIsAFakerReuse(string)) {
      finalString = this.reuseValueForKey(finalString);
    } else if (KrakenRandomGenerator.stringIsAFaker(string)) {
      finalString = this.generateValueForKey(finalString);
    }
    return finalString;
  }

  generateValueForKey(key: string): string {
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

  reuseValueForKey(key: string): string {
    let dictionary = this.getDictionary();
    let value = dictionary.get(key.substring(1));
    if (value == null || value == undefined) {
      throw new Error(`ERROR: Key does not exist.`);
    }

    return value;
  }

  private getDictionary(): Map<string, string> {
    return this.dictionary;
  }

  private saveKeyValueInDict(key: string, value: string) {
    let dictionary = this.getDictionary();
    dictionary.set(key, value);
  }

  private generateName(): string {
    return faker.name.firstName();
  }

  private generateSentence(): string {
    return faker.lorem.sentence();
  }

  private generateParagraph(): string {
    return faker.lorem.paragraph();
  }

  private generateNumber(): string {
    return `${faker.datatype.number()}`;
  }

  private generateEmail(): string {
    return faker.internet.email();
  }

  private generateString(): string {
    return faker.datatype.string();
  }

  private generateDate(): string {
    return faker.datatype.datetime({}).toDateString();
  }

  private generateUrl(): string {
    return faker.internet.url();
  }

  static stringIsAFaker(string: String): boolean {
    return string.startsWith("$");
  }

  static stringIsAFakerReuse(string: String): boolean {
    return string.startsWith("$$");
  }
}
