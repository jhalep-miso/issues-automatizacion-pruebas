import { Path, glob } from "glob"
import resemble from "resemblejs/compareImages"
import * as fs from "fs/promises"

// Helpers:

const makeImagePairs = async (dir1: string, dir2: string): Promise<[Path, Path][]> => {
  const images1 = await glob(`${dir1}/**/*.{png, jpeg}`, { withFileTypes: true })
  const filesToCompare = new Set(images1.map(path => path.name))

  const allDir2Images = await glob(`${dir2}/**/*.{png, jpeg}`, { withFileTypes: true })
  const images2 = allDir2Images.filter(path => filesToCompare.has(path.name))

  const numFiles = Math.max(images1.length, images2.length)

  return [...Array(numFiles).keys()].map(idx => [images1[idx], images2[idx]])
}

const compareImages = async ([image1, image2]: [Path, Path]): Promise<void> => {
  console.log(`Comparing ${image1.fullpath()} with ${image2.fullpath()}`)
  const data = await resemble(image1.fullpath(), image2.fullpath(), {})

  const resultPath = `${resultsDir}/${image1.name}`
  console.log(`Writing results to ${resultPath}`)
  return fs.writeFile(resultPath, data.getBuffer!(true))
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
