import type { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer'

type ClientConfig = {
    userAgent?: string
}

export class Client {
  public browser!: Browser
  public page!: Page
  public configured: boolean = false

  constructor() {}

  async init() {
    this.browser = await puppeteer.launch({
      waitForInitialPage: true,
      acceptInsecureCerts: true,
      // userDataDir: join(process.cwd(), 'cache'),
      headless: false,
    })
    this.page = (await this.browser.pages())[0]
  }

  async config (options?: ClientConfig) {
    if (this.page === undefined) throw new Error('Page in undefined')
        
    await this.page.setUserAgent(options?.userAgent ?? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.3')
    await this.page.setViewport({
      width: 1920,
      height: 1080
    })

    this.configured = true
  }
}