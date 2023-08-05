import Head from "next/head";
import Header from "/components/site/Header";
import Sidebar from "../site/Sidebar";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import BugPopup from "../site/BugPopup";
import { NextSeo, BreadcrumbJsonLd } from "next-seo";
import Image from "next/image";

export default function ToolLayout({ children, toolData, categorizedTools }) {
  
  const ToolEmbedd = dynamic(
    () => import(`/database/tools/${toolData.category}.js`),
    {
      loading: () => <p>Loading...</p>,
    }
  );

  const [popupVisible, setPopupVisible] = useState(false);

  const openPopup = () => {
    setPopupVisible(true);
  };

  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.keyCode === 27) {
        setPopupVisible();
      }
    };
    document.addEventListener("keydown", handleEscClose);
    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, []);


  const title = `${toolData.title} Online | Free WebTool By TechNeg`;

  const SEO = {
    title: `${toolData.title} Online | WebTool By TechNeg`,
    description: `${toolData.description}`,
    openGraph: {
      title: `${toolData.title} Online | WebTool By TechNeg`,
      description: `${toolData.description}`,
      type: "website",
      site_name: "Free WebTools By TechNeg",
      // Add your breadcrumb data here
      article: {
        publishedTime: `${toolData.date}`,
        section: `${toolData.category}`,
        tags: `${toolData.category}`,
      },
    },
    // Add other SEO configurations here
  };

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://webtools.techneg.co.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: toolData.category,
      item: `https://webtools.techneg.co.in/tool/${toolData.category}`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: toolData.title,
      item: `https://webtools.techneg.co.in/${toolData.category}/${toolData.id}`,
    },
  ];

  return (
    <>
      <NextSeo {...SEO} />
      <BreadcrumbJsonLd itemListElements={breadcrumbItems} />
      <Head>
        <title>{title}</title>
        <meta name="description" content={toolData.description} />
        <meta name="keywords" content={toolData.category} />
      </Head>
      <Header categorizedTools={categorizedTools} />
      <div className="main__container">
        <aside className="sideNav">
          <Sidebar categorizedTools={categorizedTools} />
        </aside>
        <main className="pageBody">
          <div className="tool__embed">
            <div className="pageMeta">
              <Image src={toolData.activeSVG} width={50} height={50} />
              <h1 id="toolTitle">{toolData.id.replace(/-/g, ' ').toUpperCase()}</h1>
              <button
                className="tn_button tn_button_small bug_button"
                onClick={openPopup}
              >
                Submit Bug
              </button>
            </div>
            <div className="tool__container">
              <ToolEmbedd id={toolData.id} />
            </div>
            <div
              className="pageContent"
              dangerouslySetInnerHTML={{ __html: toolData.content }}
            ></div>
          </div>
        </main>
      </div>
      <BugPopup popupVisible={popupVisible} setPopupVisible={setPopupVisible} />
      <ToastContainer />
    </>
  );
}
