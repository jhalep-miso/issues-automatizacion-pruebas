import {DataGenerator} from "./generator.interface";
import axios from "axios";

export class PseudoGenerator implements DataGenerator {

  private response: any[] = [];

  constructor() {}

  async initialize() {
    try {
      const response = await axios.get(
          "https://my.api.mockaroo.com/mock.json?key=d8be7f40"
      );
      this.response = response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  generateName(): string {
    return this.response[this.getRandomPosition()].name;
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
