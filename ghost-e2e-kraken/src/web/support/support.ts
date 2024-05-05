import {IWorldOptions, setDefaultTimeout, setWorldConstructor, World,} from "@cucumber/cucumber";
import {LoginPage} from "../page-objects/login-page";
import {PostPage} from "../page-objects/post-page";
import {TagPage} from "../page-objects/tag-page";

export class KrakenWorld extends World {
    userId: any;
    device: any;
    testScenarioId: any;
    attach: any;
    driver: any;
    deviceClient: any;
    loginPage!: LoginPage;
    postPage!: PostPage;
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
        this.postPage = new PostPage(this.driver);
        this.tagPage = new TagPage(this.driver);
    }
}

setWorldConstructor(KrakenWorld);
setDefaultTimeout(30 * 1000);
