import { cleanString } from "src/utils/textUtils";
import puppeteer from "puppeteer";

export class ScrapingService {
  async scrape(url: string): Promise<{ text: string; link: string[] }> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });
    await page.$$eval("noscript, script, link", (elements) =>
      elements.forEach((el) => el.remove()),
    );
    const body = await page.waitForSelector("body");
    const links = await body.$$eval("a", (elements) =>
      elements.map((el) => el.getAttribute("href")),
    );

    const textContent = await body.evaluate((el) => el.textContent);

    await browser.close();
    return {
      text: cleanString(textContent),
      link: arrayWithoutDuplicates(links.filter(isRelativeAndNotRoot)),
    };
  }
}

function arrayWithoutDuplicates(array: string[]): string[] {
  return Array.from(new Set(array));
}

function isRelativeAndNotRoot(href: string): boolean {
  if (!href) {
    return false;
  }
  return (
    !href.startsWith("http") &&
    href !== "/" &&
    !href.startsWith("#") &&
    href !== ""
  );
}
