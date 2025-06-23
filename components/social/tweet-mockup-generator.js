import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TweetGenerator = () => {
  const [TweetContent, setTweetContent] = useState("This is a sample tweet. @mentions, #hashtags, https://links.com are all automatically converted.")
  const [likesCount, setLikesCount] = useState(0);
  const [repliesCount, setRepliesCount] = useState(0);
  const [retweetsCount, setRetweetsCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [accName, setACCName] = useState("John Doe");
  const [usrName, setUSRName] = useState("@johndoe");
  const [avatar, setAvatar] = useState(null);
  const [avatarStatus, setAvatarStatus] = useState("Click to upload");
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [time, setTime] = useState(null);
  const tweetCardRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUploadClick = () => {
    // Programmatically trigger the file input click event using the ref
    fileInputRef.current.click();
  };

  const formatTweetContent = (content) => {
    // Regular expressions to find mentions, hashtags, and links in the tweet content
    const mentionRegex = /@\w+/g;
    const hashtagRegex = /#\w+/g;
    const linkRegex = /https?:\/\/[^\s]+/g;

    // Replace mentions, hashtags, and links with styled spans
    const formattedContent = content
      .replace(mentionRegex, (match) => {
        return `<span class="tweet-mention">${match}</span>`;
      })
      .replace(hashtagRegex, (match) => {
        return `<span class="tweet-hashtag">${match}</span>`;
      })
      .replace(linkRegex, (match) => {
        return `<span class="tweet-link">${match}</span>`;
      });

    // Return the formatted content as HTML
    return { __html: formattedContent };
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "accName") {
      setACCName(value);
    } else if (name === "usrName") {
      if (value.startsWith("@")) {
        setUSRName(value);
      } else {
        setUSRName(`@${value}`);
      }
    } else if (name === "likesCount") {
      setLikesCount(value);
    } else if (name === "retweetsCount") {
      setRetweetsCount(value);
    } else if (name === "repliesCount") {
      setRepliesCount(value);
    } else if (name === "avatar") {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatar(e.target.result);
          setAvatarStatus("Uploaded");
        };
        reader.readAsDataURL(file);
      } else {
        setAvatar(null);
        setAvatarStatus("Click to upload");
      }
    } else if (name === "TweetContent") {
      // Replace newlines with <br> tags for the preview
      const formattedValue = value.replace(/\n/g, '<br>');
      setTweetContent(formattedValue);

      // Set isInputHovered to true for a few seconds
      setIsInputHovered(true);

      // Schedule setting isInputHovered back to false after 3 seconds (adjust the time as needed)
      setTimeout(() => {
        setIsInputHovered(false);
      }, 3000);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInMilliseconds = Math.abs(now - date);

    // Format time in seconds
    if (diffInMilliseconds < 60000) {
      return `${Math.floor(diffInMilliseconds / 1000)}s`;
    }

    // Format time in minutes
    if (diffInMilliseconds < 3600000) {
      return `${Math.floor(diffInMilliseconds / 60000)}m`;
    }

    // Format time in hours
    if (diffInMilliseconds < 86400000) {
      return `${Math.floor(diffInMilliseconds / 3600000)}h`;
    }

    // Format time as date and month in short codes
    const options = { day: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options).replace(".", "");
  };

  const formatNumber = (count) => {
    if (count < 1000) {
      return count.toString(); // No formatting required for counts below 1000
    } else if (count < 1000000) {
      return (count / 1000).toFixed(0) + "k"; // Format counts in thousands
    } else if (count < 1000000000) {
      return (count / 1000000).toFixed(0) + "M"; // Format counts in millions
    } else if (count < 1000000000000) {
      return (count / 1000000000).toFixed(0) + "B"; // Format counts in billions
    } else {
      return (count / 1000000000000).toFixed(0) + "T"; // Format counts in trillions
    }
  };

  const handleClearImage = () => {
    // Clear the uploaded image
    setAvatar(null);
    setAvatarStatus("Click to upload");
  };

  const handleTimeChange = (date) => {
    setTime(date);
  };

const handleExportImage = async () => {
  const tweetHTML = tweetCardRef.current.outerHTML;

  const response = await fetch("/api/tweet-generator", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: `<div id="tweet-image">${tweetHTML}</div>`,
    }),
  });

  if (!response.ok) {
    return alert("Failed to generate image");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "tweet-preview.png";
  link.click();
};


  return (
    <>
      <div className="tweetPreview_main form__field flex justify-center" >
        <div className="tweetPreview_card" ref={tweetCardRef}>
          <div className="tweetPreview_profile">
            {avatar ? (
              <img src={avatar} alt="Avatar" width={50} height={50} />
            ) : (
              <Image
                src={"/profile.png"}
                alt="Default Avatar"
                width={50}
                height={50}
              />
            )}
          </div>
          <div className="tweetPreview_middle">
            <div className="tweetPreview_header">
              <h2 className="tweetHeader_item acc_name">{accName}</h2>
              <h3 className="tweetHeader_item username">{usrName}</h3>
              <span className="tweetHeader_item time">
                <span className="tweetHeader_item time">
                  {time && formatTime(time)}
                </span>
              </span>
            </div>
            <div
              className="tweetPreview_content"
              dangerouslySetInnerHTML={formatTweetContent(TweetContent)}
            ></div>
            <div className="tweetPreview_footer">
              <div className="tweetPreview_footer_buttons">
                <svg width={20} height={20} viewBox="0 0 24 24">
                  <g>
                    <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                  </g>
                </svg>
                <div className="tweetCounter" style={{ width: "30px" }}>
                  {formatNumber(repliesCount)}
                </div>
              </div>
              <div className="tweetPreview_footer_buttons">
                <svg width={20} height={20} viewBox="0 0 24 24">
                  <g>
                    <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
                  </g>
                </svg>
                <div className="tweetCounter" style={{ width: "30px" }}>
                  {formatNumber(retweetsCount)}
                </div>
              </div>
              <div className="tweetPreview_footer_buttons">
                <svg width={20} height={20} viewBox="0 0 24 24">
                  <g>
                    <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
                  </g>
                </svg>
                <div className="tweetCounter" style={{ width: "30px" }}>
                  {formatNumber(likesCount)}
                </div>
              </div>
              <div className="tweetPreview_footer_buttons">
                <svg width={20} height={20} viewBox="0 0 24 24">
                  <g>
                    <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path>
                    <path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path>
                  </g>
                </svg>
                <div className="tweetCounter">{formatNumber(shareCount)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-flow-col gap-4">
      <div className="form__group field">
          <textarea
            className="form__field form_field_med form_field_color"
            placeholder=" "
            name="TweetContent"
            id="input"
            required
            value={TweetContent}
            onChange={handleInputChange}
          />
          <label htmlFor="input" className="form__label txt-upper">
           Tweet Content
          </label>
        </div>
      </div>
      <div className="grid lg:grid-flow-col gap-4">
        <div className="form__group field">
          <div className={`textarea-wrapper form__field form_field_slim file-upload ${
        isInputHovered ? 'focused' : ''
      }`} onClick={() => handleFileUploadClick()}
            onMouseEnter={() => setIsInputHovered(true)}
            onMouseLeave={() => setIsInputHovered(false)}
          >
            <input
              type="file"
              accept="image/*"
              placeholder=" "
              name="avatar"
              id="input"
              required
              ref={fileInputRef}
              onChange={handleInputChange}
            />

            {/* Render the image preview with rounded borders */}
            {avatar && (
              <div className="avatar-preview">
                <img
                  src={avatar}
                  alt="Avatar Preview"
                  className="avatar-image"
                />
                <button
                  className="clear-button"
                  onClick={handleClearImage}
                  aria-label="Clear Image"
                >
                  <i class="bx bx-x"></i>
                </button>
              </div>
            )}
          </div>
          <label htmlFor="input" className="form__label txt-upper">
            Avatar
            <div className="p-2">
              <i
                style={{ fontSize: "20px" }}
                className="fa-regular fa-folder-open"
              ></i>
              <span style={{ fontSize: "15px", marginLeft: "10px" }}>
                {avatarStatus}
              </span>
            </div>
          </label>
        </div>
      </div>
      <div className="grid lg:grid-flow-col gap-4">
        <div className="form__group field">
          <textarea
            className="form__field form_field_slim form_field_color"
            placeholder=" "
            name="accName"
            id="input"
            required
            value={accName}
            onChange={handleInputChange}
          />
          <label htmlFor="input" className="form__label txt-upper">
            Name
          </label>
        </div>
        <div className="form__group field">
          <div className="textarea-wrapper">
            <textarea
              className="form__field form_field_slim form_field_color "
              placeholder=" "
              name="usrName"
              id="input"
              required
              value={usrName}
              onChange={handleInputChange}
            />
          </div>
          <label htmlFor="input" className="form__label txt-upper">
            Username
          </label>
        </div>
        <div className="form__group field">
          <DatePicker
            className="form__field form_field_slim form_field_color "
            selected={time}
            onChange={handleTimeChange}
            showTimeInput
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            placeholderText="Select Time"
            required
          />
          <label htmlFor="input" className="form__label txt-upper">
            Tweet Published
          </label>
        </div>
      </div>
      <div className="grid lg:grid-flow-col gap-4">
        <div className="form__group field">
          <div className="textarea-wrapper">
            <input
              type="number"
              className="form__field form_field_slim form_field_color "
              placeholder=" "
              name="likesCount"
              id="input"
              required
              value={likesCount}
              onChange={handleInputChange}
            />
          </div>
          <label htmlFor="input" className="form__label txt-upper">
            Likes
          </label>
        </div>
        <div className="form__group field">
          <div className="textarea-wrapper">
            <input
              type="number"
              className="form__field form_field_slim form_field_color "
              placeholder=" "
              name="retweetsCount"
              id="input"
              required
              value={retweetsCount}
              onChange={handleInputChange}
            />
          </div>
          <label htmlFor="input" className="form__label txt-upper">
            Retweets
          </label>
        </div>
        <div className="form__group field">
          <div className="textarea-wrapper">
            <input
              type="number"
              className="form__field form_field_slim form_field_color "
              placeholder=" "
              name="repliesCount"
              id="input"
              required
              value={repliesCount}
              onChange={handleInputChange}
            />
          </div>
          <label htmlFor="input" className="form__label txt-upper">
            Replies
          </label>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          className="tn_button tn_button_primary tn_button_medium"
          onClick={handleExportImage}
        >
          Export Tweet Image
        </button>
      </div>
    </>
  );
};

export default TweetGenerator;
