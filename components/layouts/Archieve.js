import Header from "components/site/Header";
import Image from "next/image";
import slugify from "slugify";
import Banner from "public/vercel.svg";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Script from "next/script";

export default function ArchieveLayout({
  children,
  categorizedTools,
  category,
  categoryObject,
  toolLabels
}) {
  const [hoveredTool, setHoveredTool] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const dotRef = useRef(null);
  const tools = categorizedTools[category];
  const toolsPerPage = 6;
  const startIndex = (currentPage - 1) * toolsPerPage;
  const endIndex = startIndex + toolsPerPage;
  const displayedTools = tools.slice(startIndex, endIndex);

  const totalPages = Math.ceil(tools.length / toolsPerPage);

  const handlePageClick = (index) => {
    setActiveIndex(index);
    setCurrentPage(index);
  };

  useEffect(() => {
    const activeButton = document.querySelector(".pagination button.active");
    const { left, width } = activeButton.getBoundingClientRect();
    const dot = dotRef.current;
    dot.style.left = `${left}px`;
    dot.style.width = `${width}px`;
  }, [activeIndex]);

  return (
    <>
      <Header categorizedTools={categorizedTools} toolLabels={toolLabels} />
      <main className="archieve_container">
        <div className="archieve_hero hero_1">
          <div className="hero_inner">
            <div className="hero_left">
              <div className="hero_title">
                <h1>
                  Online <strong>{category}</strong> Tools
                </h1>
              </div>
              <div className="hero_description">
                {categoryObject.category[0].short}
              </div>
              <div className="hero_cta">
                <Link
                  href={`/tools/${slugify(category).toLowerCase()}/#toolbox`}
                >
                  <button className="tn_button tn_button_primary tn_button_medium">
                    Discover {category} Tools {">"}
                  </button>
                </Link>
              </div>
            </div>
            <div className="hero_right">
              <Image
                src={`/icons/tools/category/hero/${category}.svg`}
                width={500}
                height={500}
                alt={category}
              />
            </div>
          </div>
        </div>
        <div className="archieve_banner banner_1">
          <Script
            id="adsense-script"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8723963383146816"
            strategy="afterInteractive"
            crossorigin="anonymous"
          />
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-8723963383146816"
            data-ad-slot="9405526505"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <Script
            id="adsense-script-push"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
            }}
          />
        </div>
        <div id="toolbox" className="archieve_collection">
          <div className="collection_titlebar">
            <h2>{category} ToolBox</h2>
            <div className="pagination">
              <div className="pagination_buttons">
                {currentPage > 1 && (
                  <button onClick={() => handlePageClick(currentPage - 1)}>
                    Previous
                  </button>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => {
                    const isCurrentPage = pageNumber === currentPage;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                        className={`${isCurrentPage ? "active" : ""}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}

                {currentPage < totalPages && (
                  <button onClick={() => handlePageClick(currentPage + 1)}>
                    Next
                  </button>
                )}
              </div>

              <div className="pagination-dot" ref={dotRef}></div>
            </div>
          </div>
          <div className="collection_container">
            {displayedTools.map((tool) => (
              <Link
                href={`/tools/${tool.category}/${tool.name}`}
                className="collection_tool"
                key={tool.name}
                onMouseEnter={() => setHoveredTool(tool)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <div className="tool_icon">
                  <Image
                    src={
                      hoveredTool === tool ? tool.activeSVG : tool.defaultSVG
                    }
                    width={40}
                    height={40}
                    alt={`${tool.title} icon
                                                                                                            
                                                                                                            `}
                  />
                </div>
                <div className="tool_name">
                  <h3>{tool.title}</h3>
                </div>
                <div className="tool_description">
                  <p>{tool.description}</p>
                </div>
                <div className="tool_cta">
                  <strong>Check Now {'>'}</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="archieve_banner banner_2"></div>
        <div className="archieve_hero hero_2">
          <div className="hero_inner">
            <div className="hero_left">
              <Image
                src={`/icons/tools/category/${category}.svg`}
                width={300}
                height={300}
                alt={category}
              />
            </div>
            <div className="hero_right">
              <div className="hero_title">
                <h1>Best {category} Tools On Web</h1>
              </div>
              <div className="hero_description">
                {categoryObject.category[0].long}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
