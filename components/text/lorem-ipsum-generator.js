  import { useState } from "react";
  import { toast } from "react-toastify";

  export default function LoremIpsumGenerator() {
    const [paragraphCount, setParagraphCount] = useState(1);
    const [avgWordsPerSentence, setAvgWordsPerSentence] = useState(10);
    const [avgSentencesPerParagraph, setAvgSentencesPerParagraph] = useState(5);
    const [outputText, setOutputText] = useState("Lorem ipsum dolor sit amet. aute laboris aute exercitation reprehenderit pariatur aute. mollit culpa qui do nisi quis quis consequat. adipisicing ex aliqua amet ex magna voluptate. voluptate aliqua exercitation et ea magna ex do mollit et. id labore deserunt dolor sit non adipisicing elit pariatur sit exercitation.");

    const handleParagraphCountChange = (event) => {
      const value = parseInt(event.target.value);
      setParagraphCount(value);
    };

    const handleAvgWordsPerSentenceChange = (event) => {
      const value = parseInt(event.target.value);
      setAvgWordsPerSentence(value);
    };

    const handleAvgSentencesPerParagraphChange = (event) => {
      const value = parseInt(event.target.value);
      setAvgSentencesPerParagraph(value);
    };

    const handleCopy = (event) => {
      if (!outputText) {
        toast.warn("Output field is empty!", { autoClose: 1000 });
      } else {
        navigator.clipboard.writeText(outputText);
        toast.success(`Your Text Successfully Copied!`, { autoClose: 500 });
      }
    }

    const handleReset = (event) => {
      setOutputText("")
    }

    const generateLoremIpsum = () => {
      let loremIpsum = "Lorem ipsum dolor sit amet";
      const words = [
        "ad",
        "adipisicing",
        "aliqua",
        "aliquip",
        "amet",
        "anim",
        "aute",
        "cillum",
        "commodo",
        "consectetur",
        "consequat",
        "culpa",
        "cupidatat",
        "deserunt",
        "do",
        "dolor",
        "dolore",
        "duis",
        "ea",
        "eiusmod",
        "elit",
        "enim",
        "esse",
        "est",
        "et",
        "eu",
        "ex",
        "excepteur",
        "exercitation",
        "fugiat",
        "id",
        "in",
        "incididunt",
        "ipsum",
        "irure",
        "labore",
        "laboris",
        "laborum",
        "Lorem",
        "magna",
        "minim",
        "mollit",
        "nisi",
        "non",
        "nostrud",
        "nulla",
        "occaecat",
        "officia",
        "pariatur",
        "proident",
        "qui",
        "quis",
        "reprehenderit",
        "sint",
        "sit",
        "sunt",
        "tempor",
        "ullamco",
        "ut",
        "velit",
        "veniam",
        "voluptate",
      ];

      for (let i = 0; i < paragraphCount; i++) {
        const sentences = [];
        for (let j = 0; j < avgSentencesPerParagraph; j++) {
          const wordsCount = Math.floor(
            Math.random() * (avgWordsPerSentence + 1) + avgWordsPerSentence / 2
          );
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
    };

    const handleGenerate = () => {
      const lorem = generateLoremIpsum();
      setOutputText(lorem);
    };

    return (
      <>
        <div className="grid lg:grid-cols-3">
          <div className="">
            <label className="tn_text" htmlFor="paragraphCount">
              Paragraph Count: <strong>{paragraphCount}</strong>
            </label>
            <input
              type="range"
              id="paragraphCount"
              min={1}
              max={60}
              value={paragraphCount}
              onChange={handleParagraphCountChange}
            />
          </div>
          <div>
            <label className="tn_text" htmlFor="avgWordsPerSentence">
              Average Words Per Sentence: <strong>{avgWordsPerSentence}</strong>
            </label>
            <input
              type="range"
              id="avgWordsPerSentence"
              min={1}
              max={20}
              value={avgWordsPerSentence}
              onChange={handleAvgWordsPerSentenceChange}
            />
          </div>
          <div>
            <label className="tn_text" htmlFor="avgSentencesPerParagraph">
              Average Sentences Per Paragraph:{" "}
              <strong>{avgSentencesPerParagraph}</strong>
            </label>
            <input
              type="range"
              id="avgSentencesPerParagraph"
              min={1}
              max={30}
              value={avgSentencesPerParagraph}
              onChange={handleAvgSentencesPerParagraphChange}
            />
          </div>
        </div>
        <div className="grid lg:grid-flow-col">
          <div className="form__group field">
            <textarea
              className="form__field form_field_large"
              placeholder=" "
              name="input"
              id="input"
              value={outputText}
              required
            />
            <label htmlFor="input" className="form__label txt-upper">
              {`text`}
            </label>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-3">
          <button
            className="tn_button tn_button_primary tn_button_medium"
            onClick={handleGenerate}
          >
            Generate
          </button>
          <button
            className="tn_button  tn_button_medium"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="tn_button tn_button_medium"
            onClick={handleCopy}
          >
            Copy
          </button>
          </div>
        </div>
      </>
    );
  }
