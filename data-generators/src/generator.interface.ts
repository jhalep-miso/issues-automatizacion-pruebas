export interface DataGenerator {
  generateName(): string;
  generateSentence(): string;
  generateParagraph(): string;
  generateNumber(): string;
  generateEmail(): string;
  generateString(): string;
  generateDate(): string;
  generateUrl(): string;
}
