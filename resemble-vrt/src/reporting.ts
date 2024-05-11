import { ScenarioComparisonResult, StepComparisonResult } from "./images";
import * as fs from "fs/promises"

export const writeReport = async (
  dir1: string,
  dir2: string,
  resultsDir: string,
  results: ScenarioComparisonResult[]
) => {
  const today = new Date()
  const dirName = (dirPath: string) => `${dirPath.substring(dirPath.lastIndexOf("/") + 1)}`
  const reportTitle = `VRT Report: ${dirName(dir1)} vs ${dirName(dir2)}`

  await fs.copyFile("./css/index.css", `${resultsDir}/index.css`)
  await Promise.all(results.map(writeScenarioReport(today)))

  const fullReportFile = `${resultsDir}/report.html`
  console.log(`Writing full report to: ${fullReportFile}`)
  console.log("------------------------------------------------")
  await fs.writeFile(fullReportFile, reportAllScenarios(today, reportTitle, results))
}

export const writeScenarioReport = (today: Date) => async (result: ScenarioComparisonResult) => {
  const reportFile = `${result.resultsDir}/report.html`
  console.log(`Writing scenario report to: ${reportFile}`)
  console.log("------------------------------------------------")
  await fs.writeFile(reportFile, reportScenario(today, result))
}

const reportAllScenarios = (today: Date, title: string, results: ScenarioComparisonResult[]) => `
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
        <p>Executed: ${today.toDateString()}</p>
        <h2>Scenarios:</h2>
        <ul>
          ${results.map(result => `<li><a href="${result.resultsDir}/report.html">${result.title}</a></li>`)}
        </ul>
    </body>
  </html>`

const reportScenario = (today: Date, result: ScenarioComparisonResult) => `
  <html>
      <head>
          <title>${result.title}</title>
          <link href="../index.css" type="text/css" rel="stylesheet">
      </head>
      <body>
          <h1>${result.title}</h1>
          <h1>Report for
              <a href="https://ghost-ebcl.onrender.com/">https://ghost-ebcl.onrender.com/</a>
          </h1>
          <p>Executed: ${today.toDateString()}</p>
          ${result.stepComparisonResults.map(step => `<div id="visualizer">${reportStep(result.resultsDir, step)}</div>`)}
      </body>
  </html>`

const reportStep = (scenarioDir: string, result: StepComparisonResult) => `<div class=" browser" id="test0">
  <div class="btitle">
      <h2>${result.title}</h2>
      <p>Data: ${JSON.stringify(result.resultData)}</p>
  </div>
  <div class="imgline">
    <div class="imgcontainer">
      <span class="imgname">Reference</span>
      <img class="img2" src="${result.step.path1}" id="refImage" label="Reference">
    </div>
    <div class="imgcontainer">
      <span class="imgname">Test</span>
      <img class="img2" src="${result.step.path2}" id="testImage" label="Test">
    </div>
  </div>
  <div class="imgline">
    <div class="imgcontainer">
      <span class="imgname">Diff</span>
      <img class="imgfull" src="${scenarioDir}/${result.step.imageName}" id="diffImage" label="Diff">
    </div>
  </div>
  </div>`
