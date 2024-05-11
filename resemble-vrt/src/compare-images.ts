import { glob } from "glob"
import { ComparisonResult } from "resemblejs"
import resemble from "resemblejs/compareImages"
import { resolve } from "path"
import { options } from "./config"
import * as fs from "fs/promises"
import { existsSync } from "fs"

type ComparisonData = {
  title: string
  image1path: string
  image2path: string
  resultImageName: string
  resultInfo: ComparisonResult
}

// Image comparison:

const makeImagePairs = async (dir1: string, dir2: string): Promise<[string, string, string][]> => {
  const images1 = await glob(`${dir1}/**/*.png`, { withFileTypes: true })
  const filesToCompare = images1.filter(path => existsSync(`${dir2}/${path.name}`))
  const images2paths = filesToCompare.map(path => `${dir2}/${path.name}`)

  return filesToCompare.map((image1, idx) =>
    [image1.name, image1.fullpath(), images2paths[idx]]
  )
}

const compareImages = async ([resultImageName, image1, image2]: [string, string, string]): Promise<ComparisonData | undefined> => {
  console.log(`Comparing ${image1} with ${image2}`)
  console.log("------------------------------------------------")
  const data = await resemble(image1, image2, options)

  const resultPath = `${resultsDir}/${resultImageName}`
  console.log(`Writing results to ${resultPath}`)
  console.log("------------------------------------------------")

  if (data.getBuffer) {
    await fs.writeFile(resultPath, data.getBuffer(false))
    return {
      title: `Step: ${resultImageName.substring(0, resultImageName.indexOf(".png"))}`,
      image1path: `file://${resolve(image1)}`,
      image2path: `file://${resolve(image2)}`,
      resultImageName: resultImageName,
      resultInfo: data
    }
  }
  else console.log(`Was not able to extract image while comparing ${image1} with ${image2}`)
}

const executeComparison = async (dir1: string, dir2: string, resultsDir: string): Promise<ComparisonData[]> => {
  console.log(`Comparing images from ${dir1} and ${dir2}...`)

  await fs.mkdir(resultsDir, { recursive: true })
  const imagePairs = await makeImagePairs(dir1, dir2)
  const results = await Promise.all(imagePairs.map(compareImages))

  return results.filter((result): result is ComparisonData => !!result).sort(
    (r1, r2) => r1.title.localeCompare(r2.title)
  )
}

// Report Generation:
const makeComparisonInfo = (data: ComparisonData) => `<div class=" browser" id="test0">
    <div class="btitle">
        <h2>${data.title}</h2>
        <p>Data: ${JSON.stringify(data.resultInfo)}</p>
    </div>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Reference</span>
        <img class="img2" src="${data.image1path}" id="refImage" label="Reference">
      </div>
      <div class="imgcontainer">
        <span class="imgname">Test</span>
        <img class="img2" src="${data.image2path}" id="testImage" label="Test">
      </div>
    </div>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Diff</span>
        <img class="imgfull" src="${data.resultImageName}" id="diffImage" label="Diff">
      </div>
    </div>
    </div>`

const makeReport = (title: string, date: Date, results: ComparisonData[]) => `
  <html>
      <head>
          <title>${title}</title>
          <link href="index.css" type="text/css" rel="stylesheet">
      </head>
      <body>
          <h1>${title}</h1>
          <h1>Report for
              <a href="https://ghost-ebcl.onrender.com/">https://ghost-ebcl.onrender.com/</a>
          </h1>
          <p>Executed: ${date.toDateString()}</p>
          ${results.map(data => `<div id="visualizer">${makeComparisonInfo(data)}</div>`)}
      </body>
  </html>`

// Main execution:

const main = async (dir1: string, dir2: string, resultsDir: string): Promise<void> => {
  const today = new Date()
  const comparisonResults = await executeComparison(dir1, dir2, resultsDir)
  const dirName = (dirPath: string) => `${dirPath.substring(dirPath.lastIndexOf("/"))}`
  const reportTitle = `VRT Report: ${dirName(dir1)} VS ${dirName(dir2)}`
  const report = makeReport(reportTitle, today, comparisonResults)
  const reportPath = `${resultsDir}/report.html`

  console.log(`Writing report to: ${reportPath}`)
  await fs.writeFile(reportPath, report)
  await fs.copyFile("./css/index.css", `${resultsDir}/index.css`)
}

const [_node, _script, dir1, dir2, resultsDir] = process.argv

if (dir1 && dir2 && resultsDir)
  main(dir1, dir2, resultsDir)
else
  throw new Error("The script must be called in the following way: node compare-images.js <dir1> <dir2> <resultsDir>")
