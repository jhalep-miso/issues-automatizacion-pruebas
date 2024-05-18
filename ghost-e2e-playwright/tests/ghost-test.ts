import { test as base } from "@playwright/test"
import { AprioriGenerator, DataGenerator, PseudoGenerator, RandomGenerator } from "data-generators"

export type DataGenerationMode = "apriori" | "pseudo" | "random"

export const genModes: DataGenerationMode[] = ["apriori", "pseudo", "random"]

export const test = base.extend<{ dataProvider: DataGenerationProvider }>({
  dataProvider: async ({ page }, use) => {
    const provider = await TestData.getProvider()
    await use(provider)
  }
})

class TestDataRef {
  private provider: DataGenerationProvider

  constructor() { }

  getProvider(): Promise<DataGenerationProvider> {
    return !this.provider ? DataGenerationProvider.initialize() : Promise.resolve(this.provider)
  }
}

export class DataGenerationProvider {

  private constructor(readonly select: Record<DataGenerationMode, DataGenerator>) { }

  static async initialize(): Promise<DataGenerationProvider> {
    const apriori = new AprioriGenerator()
    const pseudo = new PseudoGenerator()
    const random = new RandomGenerator()

    await Promise.all([apriori.initialize(), pseudo.initialize()])

    return new DataGenerationProvider({ apriori, pseudo, random })
  }
}

export const TestData = new TestDataRef()
