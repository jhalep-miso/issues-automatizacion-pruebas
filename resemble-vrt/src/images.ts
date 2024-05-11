import { ScenarioComparison, StepComparison } from "./files"
import { ComparisonResult, ComparisonOptions } from "resemblejs"
import resemble from "resemblejs/compareImages"
import * as fs from "fs/promises"
import { resolve } from "path"

export type ScenarioComparisonResult = {
  title: string
  resultsDir: string
  stepComparisonResults: StepComparisonResult[]
}


export type StepComparisonResult = {
  title: string
  step: StepComparison
  resultData: ComparisonResult
}

export const executeScenarioComparison = async (
  baseResultDir: string,
  options: ComparisonOptions,
  scenario: ScenarioComparison
): Promise<ScenarioComparisonResult> => {
  const resultsDir = resolve(`${baseResultDir}/${scenario.name}`)
  await fs.mkdir(resultsDir, { recursive: true })

  const results = await Promise.all(
    scenario.comparisons.map(executeStepComparision(resultsDir, options))
  )

  return {
    title: `VRT Scenario Report: ${scenario.name}`,
    resultsDir,
    stepComparisonResults: results.filter((result): result is StepComparisonResult => !!result)
  }
}

const executeStepComparision = (
  resultsDir: string,
  options: ComparisonOptions,
) => async (step: StepComparison): Promise<StepComparisonResult | undefined> => {
  console.log(`Comparing ${step.path1} with ${step.path2}`)
  console.log("------------------------------------------------")
  const data = await resemble(step.path1, step.path2, options)

  const resultsFile = `${resultsDir}/${step.imageName}`
  const stepName = step.imageName.substring(0, step.imageName.indexOf(".png"))

  console.log(`Writing results to ${resultsFile}`)
  console.log("------------------------------------------------")

  if (data.getBuffer) {
    await fs.writeFile(resultsFile, data.getBuffer(false))

    return {
      title: `Step: ${stepName}`,
      step: step,
      resultData: data
    }
  }
  else console.log(`Was not able to extract image while comparing ${step.path1} with ${step.path2}`)
}
