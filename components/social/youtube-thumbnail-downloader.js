import { useState } from "react";
import Image from "next/image";

const YouTubeThumbnailDownloader = () => {
  const [Thumbnail, setThumbnail] = useState("/placeholder-image.jpg");
  const [ChannelName, setChannelName] = useState("Channel Name Here");
  const [ChannelLogo, setChannelLogo] = useState("");
  const [VideoID, setVideoID] = useState("Video ID Here");
  const [VideoTitle, setVideoTitle] = useState("Video Title Here");
  const [VideoDescription, setVideoDescription] = useState(
    "Video Description Here"
  );
  const [ThumbnailResolutions, setThumbnailResolutions] = useState([]);
  const [isThumbnailHovered, setIsThumbnailHovered] = useState(false);

  const handleDownloadThumbnail = (url) => {
            // Open the thumbnail URL in a new tab
            window.open(url, "_blank");
          };

  const formatDescription = (description) => {
    // Helper function to convert plain URLs to clickable links and preserve newline breaks
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const descriptionWithLinks = description.replace(
      urlRegex,
      (url) =>
        `<a style="color: #cf5a56; font-weight: bold;" href="${url}" target="_blank">${url}</a>`
    );
    return descriptionWithLinks.replace(/\n/g, "<br>");
  };

  const handleYouTubeLinkChange = (event) => {
    const link = event.target.value;
    // Extract video ID from the YouTube link
    const videoID = link.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
    if (videoID) {
      setVideoID(videoID[1]);
      fetchYouTubeVideoData(videoID[1]);
    }
  };

  const fetchYouTubeVideoData = async (videoID) => {
    try {
      const apiKey = "AIzaSyAmi80iNCN4TgofyMtfIn0WbQeQiyGxzW0"; // Replace with your YouTube Data API key
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.items.length > 0) {
        const videoInfo = data.items[0].snippet;
        setThumbnail(videoInfo.thumbnails.high.url);
        setChannelName(videoInfo.channelTitle);
        setChannelLogo(videoInfo.channelThumbnails?.high.url || ""); // If available
        setVideoTitle(videoInfo.title);
        setVideoDescription(videoInfo.description);
        setThumbnailResolutions([
          {
            url:
              videoInfo.thumbnails.maxres?.url ||
              videoInfo.thumbnails.standard.url,
            resolution: "Full HD (1080p)",
          },
          {
            url: videoInfo.thumbnails.high.url,
            resolution: "HD (720p)",
          },
          {
            url: videoInfo.thumbnails.standard.url,
            resolution: "SD (480p)",
          },
          {
            url: videoInfo.thumbnails.medium.url,
            resolution: "Medium Quality (320p)",
          },
          {
            url: videoInfo.thumbnails.default.url,
            resolution: "Mini (120p)",
          },
        ]);
      } else {
        // Reset the state to the initial values if video data not found
        setThumbnail("/placeholder-image.jpg");
        setChannelName("Channel Name Here");
        setChannelLogo("");
        setVideoTitle("Video Title Here");
        setVideoDescription("Video Description Here");
      }
    } catch (error) {
      console.error("Error fetching YouTube video data:", error);
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
              name="YTLink"
              id="YTLink"
              required
              onChange={handleYouTubeLinkChange}
            />
            <label htmlFor="YTLink" className="form__label txt-upper">
              YouTube Video Link
            </label>
          </div>
        </div>
      </div>
      <div className="YTMain">
        <div
          style={{ margin: "1em 0em", overflowY: "scroll" }}
          className="PreviewMain pane"
        >
          <h3 className="text-center">Thumbnails</h3>
          <div className="pane">
            <span style={{ fontSize: "13px" }}>
              Click on any thumbnail to download
            </span>
          </div>
          {ThumbnailResolutions.map((thumbnail, index) => (
            <div
              style={{ margin: "1em 0em" }}
              className="YTPreview"
              key={index}
              onClick={() => handleDownloadThumbnail(thumbnail.url, thumbnail.resolution)}
            >
              <div className="thumbnail-container ">
                <img
                  style={{ width: "100%" }}
                  src={thumbnail.url}
                  alt={`Thumbnail ${index}`}
                />
                <div
                  style={{ background: "#CF5A56", color: "white" }}
                  className="thumbnail-overlay"
                >
                  <span>{thumbnail.resolution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="YTMeta pane">
          <div className="YTMetaHeader">
            {ChannelLogo && <Image src={ChannelLogo} width={50} height={50} />}
            <h3>{ChannelName}</h3>
          </div>
          <div className="YTMetaBody">
            <div className="VideoMeta">
              <h3>{VideoTitle}</h3>
              <div
                className={`videoDescription pane`}
                dangerouslySetInnerHTML={{
                  __html: formatDescription(VideoDescription),
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .thumbnail-overlay {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          padding: 1em;
        }
        .YTMetaFooter {
          padding: 1em;
        }
        .VideoMeta h3 {
          font-size: 17px;
        }
        .VideoMeta div {
          font-size: 13px;
          background-color: #f8f9fb;
          margin: 1em 0em;
        }
        .VideoMeta {
          padding-bottom: 1em;
        }
        .VideoMeta h3,
        span {
          margin: 0;
          padding: 0;
        }
        .YTMetaBody {
          padding: 1em;
        }
        .YTPreview {
          background: #f8f9fb;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .thumbnail-container img {
          transition: all 0.1s ease-in-out;
        }
        .thumbnail-container:hover img {
          filter: brightness(30%);
        }
        .YTPreview:hover {
          background: #eff0f2;
        }
        .ytVideoPreview {
          width: 100%;
          height: 50vh;
        }
        .YTMetaHeader h3 {
          margin-left: 2em;
        }
        .YTMetaHeader {
          width: 100%;
          border-bottom: 1px solid #e2e2e2;
          display: flex;
        }
        .YTMain {
          display: inline-flex;
          height: 100vh;
        }
        .YTMeta {
          width: 70%;
          margin-left: 1em;
        }
        .PreviewMain {
          width: 30%;
          height: 100vh;
        }
      `}</style>
    </>
  );
};

export default YouTubeThumbnailDownloader;
