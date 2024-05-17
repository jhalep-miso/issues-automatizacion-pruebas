import {IWorldOptions, setDefaultTimeout, setWorldConstructor, World,} from "@cucumber/cucumber";
import {LoginPage} from "../page-objects/login-page";
import {MemberPage} from "../page-objects/member-page";
import {PostPage} from "../page-objects/post-page";
import {TagPage} from "../page-objects/tag-page";
import {PageSection} from "../page-objects/page-section";
import {ErrorPage} from "../page-objects/error-page";
import { ExtendedBrowser } from "../page-objects/abstract-page";
import { getScenarioName } from "../utils/files";

export class KrakenWorld extends World {
    userId: any;
    device: any;
    testScenarioId: any;
    attach: any;
    driver!: ExtendedBrowser;
    deviceClient: any;
    loginPage!: LoginPage;
    memberPage!: MemberPage;
    postPage!: PostPage;
    pageSection!: PageSection;
    errorPage!: ErrorPage;
    tagPage!: TagPage;
    dictionary: Map<string, string> = new Map();

    constructor(input: IWorldOptions) {
        super(input);
        let params = input.parameters;
        this.userId = params.id;
        this.device = params.device || {};
        this.testScenarioId = params.testScenarioId;
        this.attach = input.attach;
    }

    async init() {
        this.driver.stepsCounter = 0;
        this.driver.scenario = getScenarioName()
        this.loginPage = new LoginPage(this.driver);
        this.memberPage = new MemberPage(this.driver);
        this.postPage = new PostPage(this.driver);
        this.tagPage = new TagPage(this.driver);
        this.pageSection = new PageSection(this.driver);
        this.errorPage = new ErrorPage(this.driver);
    }
}

setWorldConstructor(KrakenWorld);
setDefaultTimeout(30 * 1000);
