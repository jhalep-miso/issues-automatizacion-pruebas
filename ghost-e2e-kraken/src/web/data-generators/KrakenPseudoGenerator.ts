import {PseudoGenerator} from "data-generators";


export class KrakenPseudoGenerator extends PseudoGenerator {
  private static singleton: KrakenPseudoGenerator;
  private dictionary: Map<string, string>;

  constructor(dictionary: Map<string, string>) {
    super();
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

  public async generateValue(string: string): Promise<string> {
    let finalString = string;
    if (KrakenPseudoGenerator.stringIsAFakerReuse(string)) {
      finalString = this.reuseValueForKey(finalString);
    } else if (KrakenPseudoGenerator.stringIsAFaker(string)) {
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

  static stringIsAFaker(string: String): boolean {
    return string.startsWith("$");
  }

  static stringIsAFakerReuse(string: String): boolean {
    return string.startsWith("$$");
  }
}
