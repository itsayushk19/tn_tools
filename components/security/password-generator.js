import CustomDropdown from "components/elemental/dropDownSelection.js";
import CustomCheckbox from "../elemental/checkBox";
import { useState, useEffect, useRef } from "react";

export default function PasswordGenerator() {
  const firstTextareaRef = useRef(null);
  const [filteredBars, setFilteredBars] = useState(0);
  const [PasswordLength, setPasswordLength] = useState(5);
  const [strengthScore, setStrengthScore] = useState(0);
  const [StrengthCode, setStrengthCode] = useState("");
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

  // 🔁 API: Generate a password
  const generatePasswordAPI = async () => {
    const res = await fetch("/api/generate-password  ", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ length: PasswordLength, options: Options }),
    });
    const data = await res.json();
    return data.password;
  };

  // 🔁 API: Calculate password strength
  const scorePasswordAPI = async () => {
    const res = await fetch("/api/password-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ length: PasswordLength, options: Options }),
    });
    const data = await res.json();
    return data;
  };

  // 🌀 Animate password shuffling via API
  useEffect(() => {
    if (isAnimating) {
      let animationTimer;
      const animationDuration = 1000;
      const intervalTime = 50;

      const animatePasswordShuffling = async () => {
        const passwords = [];
        const count = 7 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) {
          const pwd = await generatePasswordAPI();
          passwords.push(pwd);
        }
        setShuffledPasswords(passwords);
      };

      const stopAnimation = () => {
        clearInterval(animationTimer);
        setIsAnimating(false);
        setPassword(shuffledPasswords[shuffledPasswords.length - 1]);
        setFilteredBars(0);
      };

      animatePasswordShuffling();
      animationTimer = setInterval(animatePasswordShuffling, intervalTime);
      setTimeout(stopAnimation, animationDuration);

      return () => clearInterval(animationTimer);
    }
  }, [isAnimating]);

  const handlePasswordLength = (val) => {
    setPasswordLength(val);
  };

  const handleCheckboxChange = (key) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleGeneratePassword = async () => {
    setIsAnimating(true);
    const score = await scorePasswordAPI();
    setStrengthScore(score.score);
    setStrengthCode(score.strength);
    setColor(score.color);
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
        <div className="pane">
        <div className="form__group h-full field">
          <textarea
            className="form__field h-full w-full form_field_color highlightText"
            placeholder=" "
            name="firstColor"
            id="firstColor"
            required
            value={Password}
          />
        </div>
        </div>
      </div>
      <div className="flex items-center flex-row gap-10">
        <button
          className=" tn_button tn_button_primary tn_button_round tn_button_medium"
          onClick={handleGeneratePassword}
        >
          Generate Password
        </button>

        <button className="tn_button tn_button_primary tn_button_round tn_button_medium">
          Copy
        </button>
      </div>
    </>
  );
}
