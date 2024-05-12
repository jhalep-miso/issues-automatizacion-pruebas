import { options } from "./config"
import { scenarioComparisonFiles } from "./files"
import { executeScenarioComparison } from "./images"
import { Reporter } from "./reporting"

const main = async (dir1: string, dir2: string, resultsDir: string): Promise<void> => {
  const scenarios = await scenarioComparisonFiles(dir1, dir2)

  const results = await Promise.all(
    scenarios.map(scenario => executeScenarioComparison(resultsDir, options, scenario))
  )

  await new Reporter({ dir1, dir2, resultsDir }).writeReport(results)
}

const [_node, _script, dir1, dir2, resultsDir] = process.argv

if (dir1 && dir2 && resultsDir)
  main(dir1, dir2, resultsDir)
else
  throw new Error("The script must be called in the following way: node build/index.js <dir1> <dir2> <resultsDir>")
