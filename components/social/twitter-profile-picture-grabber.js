// components/TwitterDPDownloader.js
import { useState } from "react";
import Image from "next/image";
import axios from "axios";

const TwitterDPDownloader = () => {
  const [twitterHandle, setTwitterHandle] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  const handleTwitterHandle = (event) => {
    const handle = event.target.value;
    setTwitterHandle(handle);
  };

  const fetchProfilePicture = async () => {
    try {
      // Remove the "@" symbol from the Twitter handle
      const username = twitterHandle.replace("@", "").trim();
      const response = await axios.get(`/api/twitterDP?username=${username}`);
      const { profilePictureUrl } = response.data;
      setProfilePictureUrl(profilePictureUrl);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfilePictureUrl(null);
    }
  };

  return (
    <>
      <div className="grid lg:grid-flow-col gap-4">
        <div className="flex">
          <div className="form__group field">
            <textarea
              className="form__field form_field_slim form_field_color"
              placeholder=""
              name="twitterHandle"
              id="twitterHandle"
              required
              onChange={handleTwitterHandle}
            />
            <label htmlFor="twitterHandle" className="form__label txt-upper">
              Twitter Handle
            </label>
          </div>
          <button onClick={fetchProfilePicture}>Fetch Profile Picture</button>
        </div>
      </div>
      <div className="grid lg:grid-flow-col gap-4">
        <div className="twitterDPContainer">
          {profilePictureUrl && <Image src={profilePictureUrl} alt="Twitter DP" width={200} height={200} />}
        </div>
      </div>
    </>
  );
};

export default TwitterDPDownloader;
