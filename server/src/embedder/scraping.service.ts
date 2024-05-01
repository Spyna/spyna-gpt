import parse from "node-html-parser";
import { cleanString } from "src/utils/textUtils";

export class ScrapingService {
  async scrape(url: string): Promise<{ text: string; link: string[] }> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch website");
    }
    const html = await response.text();
    const dom = parse(html);
    dom
      .querySelectorAll("noscript, script, style, link")
      .forEach((element) => element.remove());

    const links = dom.querySelectorAll("a");
    return {
      text: cleanString(dom.textContent),
      link: arrayWithoutDuplicates(
        Array.from(links as any as HTMLAnchorElement[])
          .filter(isRelativeAndNotRoot)
          .map((link) => link.getAttribute("href")),
      ),
    };
  }
}

function arrayWithoutDuplicates(array: string[]): string[] {
  return Array.from(new Set(array));
}

function isRelativeAndNotRoot(link: HTMLAnchorElement): boolean {
  const href = link.getAttribute("href");
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
