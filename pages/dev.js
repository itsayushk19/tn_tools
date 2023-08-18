// pages/localhost-version-control.js
import { useRouter } from "next/router";
import React, { useState } from "react";
import style from "../styles/Dev.module.scss";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

const Dev = () => {
  const [newVersion, setNewVersion] = useState("");
  const [releaseLabel, setReleaseLabel] = useState("");
  const [additions, setAdditions] = useState([]);
  const [errorFixes, setErrorFixes] = useState([]);
  const [upgrades, setUpgrades] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost"
  ) {
    router.push("/");
    return null;
  }

  const handleVersionUpdate = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Assuming you have an API endpoint for version updates
      const response = await fetch("/api/dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newVersion,
          releaseLabel,
          additions,
          errorFixes,
          upgrades,
        }),
      });

      if (response.ok) {
        toast.success(`Version Successfuly Updated`, { autoClose: 500 });
        setNewVersion("");
        setReleaseLabel("");
        setAdditions([]);
        setErrorFixes([]);
        setUpgrades([]);
      } else {
        toast.error("Version update failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating version:", error);
      toast.error("An error occurred while updating the version.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdditionChange = (index, value) => {
    const newAdditions = [...additions];
    newAdditions[index] = value;
    setAdditions(newAdditions);
  };

  const handleAdditionAdd = () => {
    setAdditions([...additions, ""]);
  };

  const handleErrorFixChange = (index, value) => {
    const newErrorFixes = [...errorFixes];
    newErrorFixes[index] = value;
    setErrorFixes(newErrorFixes);
  };

  const handleErrorFixAdd = () => {
    setErrorFixes([...errorFixes, ""]);
  };

  // Upgrades
  const handleUpgradeChange = (index, value) => {
    const newUpgrades = [...upgrades];
    newUpgrades[index] = value;
    setUpgrades(newUpgrades);
  };

  const handleUpgradeAdd = () => {
    setUpgrades([...upgrades, ""]);
  };

  return (
    <>
      <div className={style.container}>
        <div className={`${style.inner} pane`}>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="form__group field">
              <textarea
                className="form__field form_field_slim"
                placeholder=""
                value={newVersion} // Bind the value to the state variable
                onChange={(e) => setNewVersion(e.target.value)} // Update the state variable
                required
              />
              <label htmlor="input" className="form__label txt-upper">
                Release Version
              </label>
            </div>
            <div className="form__group field">
              <textarea
                className="form__field form_field_slim"
                placeholder=""
                value={releaseLabel} // Bind the value to the state variable
                onChange={(e) => setReleaseLabel(e.target.value)} // Update the state variable
                required
              />
              <label htmlor="input" className="form__label txt-upper">
                Release Label
              </label>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="form__group field">
              <h3>Additions</h3>
              {additions.map((addition, index) => (
                <div key={index} className="form__group field">
                  <textarea
                    className="form__field form_field_slim"
                    placeholder=""
                    value={addition}
                    onChange={(e) =>
                      handleAdditionChange(index, e.target.value)
                    }
                    required
                  />
                  <label htmlFor="input" className="form__label txt-upper">
                    Addition {index + 1}
                  </label>
                </div>
              ))}
              <button
                className="tn_button tn_button_default"
                type="button"
                onClick={handleAdditionAdd}
              >
                Add Addition
              </button>
            </div>
            <div className="form__group field">
              <h3>Error Fixes</h3>
              {errorFixes.map((errorFix, index) => (
                <div key={index} className="form__group field">
                  <textarea
                    className="form__field form_field_slim"
                    placeholder=""
                    value={errorFix}
                    onChange={(e) =>
                      handleErrorFixChange(index, e.target.value)
                    }
                    required
                  />
                  <label htmlFor="input" className="form__label txt-upper">
                    Error Fix {index + 1}
                  </label>
                </div>
              ))}
              <button
                className="tn_button tn_button_default"
                type="button"
                onClick={handleErrorFixAdd}
              >
                Add Error Fix
              </button>
            </div>
            <div className="form__group field">
              <h3>Upgrades</h3>
              {upgrades.map((upgrade, index) => (
                <div key={index} className="form__group field">
                  <textarea
                    className="form__field form_field_slim"
                    placeholder=""
                    value={upgrade}
                    onChange={(e) => handleUpgradeChange(index, e.target.value)}
                    required
                  />
                  <label htmlFor="input" className="form__label txt-upper">
                    Upgrade {index + 1}
                  </label>
                </div>
              ))}
              <button
                className="tn_button tn_button_default"
                type="button"
                onClick={handleUpgradeAdd}
              >
                Add Upgrade
              </button>
            </div>
          </div>
        </div>
        <button
          className="tn_button tn_button_long tn_button_primary my-5"
          onClick={handleVersionUpdate}
        >
          {isLoading ? (
            <BeatLoader color={"#fff"} size={10} margin={2} />
          ) : (
            "Push"
          )}
        </button>
      </div>
    </>
  );
};

export default Dev;
