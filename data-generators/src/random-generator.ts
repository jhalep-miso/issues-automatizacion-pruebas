import { faker } from "@faker-js/faker";
import { DataGenerator } from "./generator.interface";

export class RandomGenerator implements DataGenerator {
  constructor() { }

  generateName(): string {
    return faker.person.firstName();
  }

  generateSentence(): string {
    return faker.lorem.sentence();
  }

  generateParagraph(): string {
    return faker.lorem.paragraph();
  }

  generateNumber(): string {
    return `${faker.number.int()}`;
  }

  generateEmail(): string {
    return faker.internet.email();
  }

  generateString(): string {
    return faker.string.sample();
  }

  generateDate(): string {
    return faker.date.recent().toDateString();
  }

  generateUrl(): string {
    return faker.internet.url();
  }
}
