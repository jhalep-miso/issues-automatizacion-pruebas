import {IWorldOptions, setDefaultTimeout, setWorldConstructor, World,} from "@cucumber/cucumber";
import {LoginPage} from "../page-objects/login-page";
import {MemberPage} from "../page-objects/member-page";
import {PostPage} from "../page-objects/post-page";
import {TagPage} from "../page-objects/tag-page";
import {PageSection} from "../page-objects/page-section";
import {ErrorPage} from "../page-objects/error-page";

export class KrakenWorld extends World {
    userId: any;
    device: any;
    testScenarioId: any;
    attach: any;
    driver: any;
    deviceClient: any;
    loginPage!: LoginPage;
    memberPage!: MemberPage;
    postPage!: PostPage;
    pageSection!: PageSection;
    errorPage!: ErrorPage;
    tagPage!: TagPage;

    constructor(input: IWorldOptions) {
        super(input);
        let params = input.parameters;
        this.userId = params.id;
        this.device = params.device || {};
        this.testScenarioId = params.testScenarioId;
        this.attach = input.attach;
    }

    async init() {
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
