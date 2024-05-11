import { Path, glob } from "glob"
import { relative, resolve } from "path"

export type ScenarioComparison = {
  name: string
  comparisons: StepComparison[]
}

export type StepComparison = {
  imageName: string
  path1: string
  path2: string
}

export const scenarioComparisonFiles = async (baseDir1: string, baseDir2: string): Promise<ScenarioComparison[]> => {
  const files1 = await imagesByParentDir(baseDir1)
  const files2 = await imagesByParentDir(baseDir2)

  return Object.entries(files1).flatMap(([scenario, paths1]) =>
    files2[scenario]
      ? [{ name: scenario, comparisons: stepComparisonFiles(paths1, files2[scenario]) }]
      : []
  )
}

/**
 * Groups .png files inside a directory by their parent folders relative to the given base directory
 */
const imagesByParentDir = async (baseDir: string): Promise<Record<string, Path[]>> => {
  const baseDirFullPath = resolve(baseDir)
  const imageFiles = await glob(`${baseDir}/**/*.png`, { withFileTypes: true })
  const files: Record<string, Path[]> = {}

  for (const file of imageFiles) {
    const rel = relative(baseDirFullPath, file.fullpath())
    const key = rel.substring(0, rel.lastIndexOf("/"))
    if (files[key]) files[key].push(file)
    else files[key] = [file]
  }

  return files
}

const stepComparisonFiles = (images1: Path[], images2: Path[]): StepComparison[] => {
  const pathByName1 = Object.fromEntries(images1.map(path => [path.name, path]))
  const pathByName2 = Object.fromEntries(images2.map(path => [path.name, path]))

  return Object.entries(pathByName1).flatMap(([name, path1]) =>
    pathByName2[name]
      ? [{ imageName: path1.name, path1: path1.fullpath(), path2: pathByName2[name].fullpath() }]
      : []
  )
}
