// utils/generateLorem.js

export function generateLoremIpsum(paragraphCount, avgWordsPerSentence, avgSentencesPerParagraph) {
  const words = [
    "ad", "adipisicing", "aliqua", "aliquip", "amet", "anim", "aute", "cillum", "commodo", "consectetur",
    "consequat", "culpa", "cupidatat", "deserunt", "do", "dolor", "dolore", "duis", "ea", "eiusmod", "elit",
    "enim", "esse", "est", "et", "eu", "ex", "excepteur", "exercitation", "fugiat", "id", "in", "incididunt",
    "ipsum", "irure", "labore", "laboris", "laborum", "Lorem", "magna", "minim", "mollit", "nisi", "non",
    "nostrud", "nulla", "occaecat", "officia", "pariatur", "proident", "qui", "quis", "reprehenderit", "sint",
    "sit", "sunt", "tempor", "ullamco", "ut", "velit", "veniam", "voluptate"
  ];

  let loremIpsum = "Lorem ipsum dolor sit amet";

  for (let i = 0; i < paragraphCount; i++) {
    const sentences = [];
    for (let j = 0; j < avgSentencesPerParagraph; j++) {
      const wordsCount = Math.floor(Math.random() * (avgWordsPerSentence + 1) + avgWordsPerSentence / 2);
      const sentence = [];
      for (let k = 0; k < wordsCount; k++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        sentence.push(words[randomIndex]);
      }
      sentences.push(sentence.join(" "));
    }
    loremIpsum += ". " + sentences.join(". ") + ".";
  }

  return loremIpsum.trim();
}
