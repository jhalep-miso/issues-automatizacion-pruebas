import { ScenarioComparisonResult, StepComparisonResult } from "./images";
import * as fs from "fs/promises"

type ReporterProps = {
  dir1: string
  dir2: string
  resultsDir: string
}

export class Reporter {
  private readonly dirName1: string
  private readonly dirName2: string
  private readonly stepTitlePattern = /step(?<number>\d\d*).*/i

  constructor(private readonly props: ReporterProps) {
    this.dirName1 = this.dirName(props.dir1)
    this.dirName2 = this.dirName(props.dir2)
  }

  writeReport = async (results: ScenarioComparisonResult[]) => {
    const today = new Date()
    const reportTitle = `VRT Report: ${this.dirName1} vs ${this.dirName2}`

    await fs.copyFile("./css/index.css", `${this.props.resultsDir}/index.css`)
    await Promise.all(results.map(this.writeScenarioReport(today)))

    const fullReportFile = `${this.props.resultsDir}/report.html`
    console.log(`Writing full report to: ${fullReportFile}`)
    console.log("------------------------------------------------")
    await fs.writeFile(fullReportFile, this.reportAllScenarios(today, reportTitle, results))
  }

  private writeScenarioReport = (today: Date) => async (result: ScenarioComparisonResult) => {
    const reportFile = `${result.resultsDir}/report.html`
    console.log(`Writing scenario report to: ${reportFile}`)
    console.log("------------------------------------------------")
    await fs.writeFile(reportFile, this.reportScenario(today, result))
  }

  private reportAllScenarios = (
    today: Date,
    title: string,
    results: ScenarioComparisonResult[]
  ) => {
    const resultListItems = results
      .sort((r1, r2) => r1.title.localeCompare(r2.title))
      .map(result => `<li><a href="${result.resultsDir}/report.html">${result.title}</a></li>`)

    return `
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
          <ul>${resultListItems}</ul>
      </body>
    </html>`
  }

  private reportScenario = (
    today: Date,
    result: ScenarioComparisonResult
  ) => {
    const stepReports = result.stepComparisonResults
      .sort((step1, step2) => this.compareStepNumber(step1.title, step2.title))
      .map(step => `<div id="visualizer">${this.reportStep(result.resultsDir, step)}</div>`)

    return `
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
              ${stepReports}
          </body>
      </html>`
  }

  private reportStep = (
    scenarioDir: string,
    result: StepComparisonResult
  ) => `<div class=" browser" id="test0">
    <div class="btitle">
        <h2>${result.title}</h2>
        <p>Data: ${JSON.stringify(result.resultData)}</p>
    </div>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">${this.dirName1}</span>
        <img class="img2" src="${result.step.path1}" id="refImage" label="Reference">
      </div>
      <div class="imgcontainer">
        <span class="imgname">${this.dirName2}</span>
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

  private compareStepNumber = (stepTitle1: string, stepTitle2: string): number => {
    const s1 = this.getStepNumber(stepTitle1)
    const s2 = this.getStepNumber(stepTitle2)
    return s1 && s2 ? s1 - s2 : stepTitle1.localeCompare(stepTitle2)
  }

  private getStepNumber = (stepTitle: string): number | undefined => {
    const match = stepTitle.match(this.stepTitlePattern)
    if (match?.groups) return Number(match.groups["number"])
  }

  private dirName = (dirPath: string) => `${dirPath.substring(dirPath.lastIndexOf("/") + 1)}`
}
