import { test as base } from "@playwright/test"
import { AprioriGenerator, DataGenerator, PseudoGenerator, RandomGenerator } from "data-generators"

export type DataGenerationMode = "apriori" | "pseudo" | "random"

export const genModes: DataGenerationMode[] = ["apriori", "pseudo", "random"]

/**
 * An extension of playwright `test` function to expose a DataGenerationProvider for each
 * test defined with this function
 */
export const test = base.extend<{ dataProvider: DataGenerationProvider }>({
  dataProvider: async ({ page }, use) => {
    const provider = await TestData.getProvider()
    await use(provider)
  }
})

/**
 * A lazy variable that allocates and memoizes a DataGenerationProvider. The first time
 * `getProvider` gets called, it initializes a DataGenerationProvider and stores it in the
 * `provider` variable. Subsequence calls of the method will return the same instance without
 * having to initialize it again
 */
class TestDataRef {
  private provider: DataGenerationProvider

  constructor() { }

  getProvider(): Promise<DataGenerationProvider> {
    return !this.provider ? DataGenerationProvider.initialize() : Promise.resolve(this.provider)
  }
}

/**
 * A class that provides one of the available data generation strategies: "apriori" | "pseudo" | "random"
 * On creation, it will initialize all strategies, and will expose a `select` map from DataGenerationMode to
 * a particular DataGenerator
 */
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
