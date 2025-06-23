import { useState } from "react";
import { toast } from "react-toastify";

export default function LoremIpsumGenerator() {
  const [paragraphCount, setParagraphCount] = useState(1);
  const [avgWordsPerSentence, setAvgWordsPerSentence] = useState(10);
  const [avgSentencesPerParagraph, setAvgSentencesPerParagraph] = useState(5);
  const [outputText, setOutputText] = useState(
    "Lorem ipsum dolor sit amet. aute laboris aute exercitation reprehenderit pariatur aute. mollit culpa qui do nisi quis quis consequat. adipisicing ex aliqua amet ex magna voluptate. voluptate aliqua exercitation et ea magna ex do mollit et. id labore deserunt dolor sit non adipisicing elit pariatur sit exercitation."
  );

  const handleGenerate = async () => {
    try {
      const res = await fetch("/api/generate-lorem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paragraphCount,
          avgWordsPerSentence,
          avgSentencesPerParagraph,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate text");

      const data = await res.json();
      setOutputText(data.text);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate text");
    }
  };

  const handleCopy = () => {
    if (!outputText) {
      toast.warn("Output field is empty!", { autoClose: 1000 });
    } else {
      navigator.clipboard.writeText(outputText);
      toast.success(`Your Text Successfully Copied!`, { autoClose: 500 });
    }
  };

  const handleReset = () => {
    setOutputText("");
  };

  const handleParagraphCountChange = (e) => {
    setParagraphCount(parseInt(e.target.value));
  };
  const handleAvgWordsPerSentenceChange = (e) => {
    setAvgWordsPerSentence(parseInt(e.target.value));
  };
  const handleAvgSentencesPerParagraphChange = (e) => {
    setAvgSentencesPerParagraph(parseInt(e.target.value));
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
