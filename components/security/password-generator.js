import CustomDropdown from "components/elemental/dropDownSelection.js";
import CustomCheckbox from "../elemental/checkBox";
import { randomBytes } from "crypto";
import { useState, useEffect, useRef } from "react";

export default function PasswordGenerator() {
  const firstTextareaRef = useRef(null);
  const [PasswordLength, setPasswordLength] = useState();
  const [strengthScore, setStrengthScore] = useState(0);
  const [StrengthCode, setStrengthCode] = useState("")
  const [Color, setColor] = useState("");
  const [Password, setPassword] = useState("");
  const [shuffledPasswords, setShuffledPasswords] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [Options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });

  useEffect(() => {
    if (isAnimating) {
      let animationTimer;
      const animationDuration = 1000; // 1 seconds
      const intervalTime = 50; // 0.1 seconds

      const animatePasswordShuffling = () => {
        const newShuffledPasswords = [];
        for (let i = 0; i < 7 + Math.floor(Math.random() * 4); i++) {
          newShuffledPasswords.push(generateRandomPassword());
        }
        setShuffledPasswords(newShuffledPasswords);
      };

      const stopAnimation = () => {
        clearInterval(animationTimer);
        setIsAnimating(false);
        setPassword(shuffledPasswords[shuffledPasswords.length - 1]);
      };

      animatePasswordShuffling();
      animationTimer = setInterval(animatePasswordShuffling, intervalTime);
      setTimeout(stopAnimation, animationDuration);

      return () => clearInterval(animationTimer);
    }
  }, [isAnimating]);

  const handlePasswordLength = (PasswordLength) => {
    setPasswordLength(PasswordLength);
  };

  const handleCheckboxChange = (Option) => {
    setOptions({
      ...Options,
      [Option]: !Options[Option],
    });
  };
  const generateRandomPassword = () => {
    const strength = PasswordLength || 8;
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let validChars = "";
    let generatedPassword = "";

    if (Options.lowercase) validChars += lowercaseChars;
    if (Options.uppercase) validChars += uppercaseChars;
    if (Options.numbers) validChars += numberChars;
    if (Options.symbols) validChars += symbolChars;

    const validCharsLength = validChars.length;

    for (let i = 0; i < strength; i++) {
      const randomIndex = randomBytes(1)[0] % validCharsLength;
      generatedPassword += validChars[randomIndex];
    }

    setPassword(generatedPassword);
  };

  const handleGeneratePassword = () => {
    setIsAnimating(true);
    passwordScore();
  };

  const countCheckedItems = (options) => {
    let count = 0;
    for (const option of Object.values(options)) {
      if (option === true) {
        count++;
      }
    }
    return count;
  };

  const getColorFromStrengthScore = (score) => {
    const colorRanges = [
      { score: 0, strength: "V. Weak", color: "red" },
      { score: 20, strength: "Weak", color: "tangerine" },
      { score: 40, strength: "Weak", color: "orange" },
      { score: 60, strength: "Normal", color: "yellow" },
      { score: 70, strength: "Strong", color: "light green" },
      { score: 80, strength: "Strong", color: "green" },
      { score: 100, strength: "V. Strong", color: "very green" },
    ];

    let strength = "very weak";
    let color = "red"; // Default color

    for (const range of colorRanges) {
      if (score <= range.score) {
        strength = range.strength;
        color = range.color;
        break;
      }
    }

    return { strength, color };
  };

  const passwordScore = () => {
    const lengthReplacements = {
      256: 129,
      512: 130,
      1024: 131,
      2048: 132,
    };
    const replacedLength = lengthReplacements[PasswordLength] || PasswordLength;
    const lengthScore = 70 / 132;
    const finalLengthScore = replacedLength * lengthScore;

    const optionScore = 30 / 4;
    const checkedItemCount = countCheckedItems(Options);
    const finalOptionScore = checkedItemCount * optionScore;

    const PasswordScore = finalLengthScore + finalOptionScore;
    const {color, strength} = getColorFromStrengthScore(PasswordScore);

    setColor(color);
    setStrengthScore(PasswordScore);
    setStrengthCode(strength);
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-5">
        <CustomDropdown
          options={[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
            71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87,
            88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
            104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
            117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 256,
            512, 1024, 2048,
          ]}
          onSelect={handlePasswordLength}
          size="slim"
          label="Password Strenght"
          selectedOption={PasswordLength}
        />
        <div className="form__group field">
          <textarea
            className="form__field form_field_slim"
            placeholder=" "
            name="input"
            id="input"
            required
            readOnly
          />
          <label htmlFor="input" className="form__label focused txt-upper">
            {`Password Strength`}
          </label>
          <p className="strengthCode">{StrengthCode}</p>
          <div className="form__colorBar">
            <div
              className={`bar red`}
              style={strengthScore >= 0 ? { filter: "none" } : {}}
            />
            <div
              className={`bar tangerine`}
              style={strengthScore >= 20 ? { filter: "none" } : {}}
            />
            <div
              className={`bar orange`}
              style={strengthScore >= 40 ? { filter: "none" } : {}}
            />
            <div
              className={`bar yellow`}
              style={strengthScore >= 60 ? { filter: "none" } : {}}
            />
            <div
              className={`bar lgreen`}
              style={strengthScore >= 70 ? { filter: "none" } : {}}
            />
            <div
              className={`bar mgreen`}
              style={strengthScore >= 80 ? { filter: "none" } : {}}
            />
            <div
              className={`bar green`}
              style={strengthScore >= 100 ? { filter: "none" } : {}}
            />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="pane">
          <CustomCheckbox
            options={["lowercase", "uppercase", "numbers", "symbols"]}
            orientation={"vertical"}
            checkedOptions={Options}
            onCheckboxChange={handleCheckboxChange} // Pass the update function to CustomCheckbox
          />
        </div>
      </div>
      <div className="flex items-center flex-row gap-10">
        <button
          className=" tn_button tn_button_primary tn_button_round tn_button_medium"
          onClick={handleGeneratePassword}
        >
          Generate Password
        </button>
        <div className="form__group field">
          <input
            className="form__field form_field_slim form_field_color highlightText"
            placeholder=" "
            name="firstColor"
            id="firstColor"
            required
            value={Password}
            readOnly
          />
        </div>
        <button className="tn_button tn_button_primary tn_button_round tn_button_medium">
          Copy
        </button>
      </div>
    </>
  );
}
