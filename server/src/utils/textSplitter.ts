const SEPARATORS = ["\n\n", "\n", " ", ""];

const DEFAULT_CHUNCK_SIZE = 1000;

export async function splitText(
  text: string,
  chunkSize = DEFAULT_CHUNCK_SIZE,
  separators = SEPARATORS,
): Promise<string[]> {
  const finalChunks = [];

  // Get appropriate separator to use
  let separator = separators[separators.length - 1];
  let newSeparators;
  for (let i = 0; i < separators.length; i += 1) {
    const s = separators[i];
    if (s === "") {
      separator = s;
      break;
    }
    if (text.includes(s)) {
      separator = s;
      newSeparators = separators.slice(i + 1);
      break;
    }
  }

  // Now that we have the separator, split the text
  const splits = splitOnSeparator(text, separator);

  // Now go merging things, recursively splitting longer texts.
  let goodSplits = [];
  const _separator = separator;
  for (const s of splits) {
    if (s.length < chunkSize) {
      goodSplits.push(s);
    } else {
      if (goodSplits.length) {
        const mergedText = await mergeSplits(goodSplits, _separator);
        finalChunks.push(...mergedText);
        goodSplits = [];
      }
      if (!newSeparators) {
        finalChunks.push(s);
      } else {
        const otherInfo = await splitText(s, newSeparators);
        finalChunks.push(...otherInfo);
      }
    }
  }
  if (goodSplits.length) {
    const mergedText = await mergeSplits(goodSplits, _separator);
    finalChunks.push(...mergedText);
  }
  return finalChunks;
}

function splitOnSeparator(text, separator) {
  let splits;
  if (separator) {
    splits = text.split(separator);
  } else {
    splits = text.split("");
  }
  return splits.filter((s: string) => s !== "");
}

async function mergeSplits(splits: string[], separator: string) {
  const docs = [];
  const currentDoc = [];
  let total = 0;
  for (const d of splits) {
    const _len = d.length;
    if (
      total + _len + currentDoc.length * separator.length >
      DEFAULT_CHUNCK_SIZE
    ) {
      if (total > DEFAULT_CHUNCK_SIZE) {
        console.warn(
          `Created a chunk of size ${total}, +
which is longer than the specified ${DEFAULT_CHUNCK_SIZE}`,
        );
      }
      if (currentDoc.length > 0) {
        const doc = joinDocs(currentDoc, separator);
        if (doc !== null) {
          docs.push(doc);
        }
        // Keep on popping if:
        // - we have a larger chunk than in the chunk overlap
        // - or if we still have any chunks and the length is long
        while (
          total > 200 ||
          (total + _len + currentDoc.length * separator.length >
            DEFAULT_CHUNCK_SIZE &&
            total > 0)
        ) {
          total -= currentDoc[0].length;
          currentDoc.shift();
        }
      }
    }
    currentDoc.push(d);
    total += _len;
  }
  const doc = joinDocs(currentDoc, separator);
  if (doc !== null) {
    docs.push(doc);
  }
  return docs;
}

function joinDocs(docs: string[], separator: string) {
  const text = docs.join(separator).trim();
  return text === "" ? null : text;
}
