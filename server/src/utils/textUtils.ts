const SEPARATORS = ["\n\n", "\n", ".", "!", "?", ";", ":"];

const DEFAULT_CHUNCK_SIZE = 2000;

export async function splitText(
  text: string,
  chunkSize = DEFAULT_CHUNCK_SIZE,
  separators = SEPARATORS,
): Promise<string[]> {
  const splits: string[] = [];
  let remainingText = text;

  while (remainingText.length > 0) {
    let chunk = remainingText.slice(0, chunkSize);

    if (chunk.length === chunkSize) {
      // Find the last occurrence of a separator within the chunk
      let lastSeparatorIndex = -1;
      for (const separator of separators) {
        const separatorIndex = chunk.lastIndexOf(separator);
        if (separatorIndex > lastSeparatorIndex) {
          lastSeparatorIndex = separatorIndex;
        }
      }

      if (lastSeparatorIndex !== -1) {
        // Split at the last separator
        chunk = chunk.slice(0, lastSeparatorIndex + 1);
      }
    }

    splits.push(chunk);
    remainingText = remainingText.slice(chunk.length);
  }

  return splits;
}

export function cleanString(text: string) {
  text = text.replace(/\\/g, "");
  text = text.replace(/#/g, " ");
  text = text.replace(/\. \./g, ".");
  text = text.replace(/\s\s+/g, " ");
  text = text.replace(/(\r\n|\n|\r)/gm, " ");

  return text.trim();
}
