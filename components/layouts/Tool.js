import Head from "next/head";
import Header from "/components/site/Header";
import Sidebar from "../site/Sidebar";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import BugPopup from "../site/BugPopup";
import { NextSeo, BreadcrumbJsonLd } from "next-seo";

export default function ToolLayout({ children, toolData, categorizedTools }) {
  console.log(categorizedTools)
  const ToolEmbedd = dynamic(
    () => import(`/database/tools/${toolData.category}.js`),
    {
      loading: () => <p>Loading...</p>,
    }
  );

  const [popupVisible, setPopupVisible] = useState(false);

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

  const openPopup = () => {
    setPopupVisible(true);
  };

  const title = `${toolData.title} Online | Free WebTool By TechNeg`;

  const SEO = {
    title: `${toolData.title} Online | Free WebTool By TechNeg`,
    description: `${toolData.description}`,
    openGraph: {
      title: `${toolData.title} Online | Free WebTool By TechNeg`,
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
      item: `https://webtools.techneg.co.in/tool/${toolData.category}`
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
              <h1 id="toolTitle">{toolData.title}</h1>
              <button className="tn_button bug_button" onClick={openPopup}>
                Submit Bug
              </button>
            </div>
            <div className="bg-blue-100 text-white-600 text-left text-justify p-4 text-xs rounded-lg w-4/5 h-auto rounded border border-blue-300">
              Thank you for using our tools! Please note that our web tools are
              still under development, and you may encounter bugs and errors.
              Your feedback is invaluable in helping us fix any issues. If you
              experience any bugs or errors, please report them using the
              &quot;Report&ldquo; button. Your help is greatly appreciated!
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
      <BugPopup popupVisible={popupVisible} />
      <ToastContainer />
    </>
  );
}
