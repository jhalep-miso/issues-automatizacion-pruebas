import { glob } from "glob"
import resemble from "resemblejs/compareImages"
import { options } from "./config"
import * as fs from "fs/promises"
import { existsSync } from "fs"

// Helpers:

const makeImagePairs = async (dir1: string, dir2: string): Promise<[string, string, string][]> => {
  const images1 = await glob(`${dir1}/**/*.{png, jpeg}`, { withFileTypes: true })
  const filesToCompare = images1.filter(path => existsSync(`${dir2}/${path.name}`))
  const images2paths = filesToCompare.map(path => `${dir2}/${path.name}`)

  return images1.map((image1, idx) =>
    [image1.name, image1.fullpath(), images2paths[idx]]
  )
}

const compareImages = async ([resultImageName, image1, image2]: [string, string, string]): Promise<void> => {
  console.log(`Comparing ${image1} with ${image2}`)
  const data = await resemble(image1, image2, options)

  const resultPath = `${resultsDir}/${resultImageName}`
  console.log(`Writing results to ${resultPath}`)

  if (data.getBuffer) return fs.writeFile(resultPath, data.getBuffer(false))
  else console.log(`Was not able to extract image while comparing ${image1} with ${image2}`)
}

const executeComparison = async (dir1: string, dir2: string, resultsDir: string): Promise<void> => {
  console.log(`Comparing images from ${dir1} and ${dir2}...`)

  await fs.mkdir(resultsDir, { recursive: true })
  const imagePairs = await makeImagePairs(dir1, dir2)

  await Promise.all(imagePairs.map(compareImages))
}

// Main execution:

const [_node, _script, dir1, dir2, resultsDir] = process.argv

if (dir1 && dir2 && resultsDir) executeComparison(dir1, dir2, resultsDir)
else throw new Error(
  "The script must be called in the following way: node compare-images.js <dir1> <dir2> <resultsDir>"
)
