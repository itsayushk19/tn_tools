import ArchieveLayout from "components/layouts/Archieve";
import {getCategory, getAllToolsCategorized, getVersion } from "/utils/tools";

import Header from "components/site/Header";
import Footer from "../../components/site/Footer";
import Image from "next/image";
import Head from "next/head"
import ToolsSVG from "public/icons/tools/tools.svg";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function AllCategories({
  children,
  categoryObject,
  categorizedTools,
  version
}) {
  const [hoveredTool, setHoveredTool] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const dotRef = useRef(null);
  const toolsPerPage = 6;
  const startIndex = (currentPage - 1) * toolsPerPage;
  const endIndex = startIndex + toolsPerPage;
  const displayedTools = categoryObject.slice(startIndex, endIndex);

  const totalPages = Math.ceil(categoryObject.length / toolsPerPage);

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
    <Head>
      <title>Free WebTools By TechNeg | Coding, Hashing & Encryption, Converters & More!</title>
      <meta name="description" content="Discover a collection of free web tools that can simplify your development workflow. From code minifiers and validators to image compressors and color pickers, our website offers a variety of handy tools to enhance your web development experience." />
    </Head>
      <Header categorizedTools={categorizedTools} version={version}  />
      <main className="archieve_container">
        <div className="archieve_hero hero_1">
          <div className="hero_inner">
            <div className="hero_left">
              <div className="hero_title">
                <h1>Best Tools Right In Your Browser!</h1>
              </div>
              <div className="hero_description">
                {`Our website offers a wide range of online tools that cater 
              to various needs. From hash generators to coding tools, we have everything that you need to make 
              your online experience easier and more efficient. With our collection of color pickers, 
              data encrypters, calculators, and more, you can achieve your desired results with ease.`}
              </div>
              <div className="hero_cta">
                <Link href={`/tools/#toolbox`}>
                  <button className="tn_button tn_button_primary tn_button_medium">
                    Discover Tools &gt;
                  </button>
                </Link>
              </div>
            </div>
            <div className="hero_right">
              <Image alt={'tn_tools'} src={ToolsSVG} style={{ width: "50%", height: "auto" }} />
            </div>
          </div>
        </div>
        <div className="archieve_banner banner_1"></div>
        <div id="toolbox" className="archieve_collection">
          <div className="collection_titlebar">
            <h2>ToolBox</h2>
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
            {categoryObject.map((category) => (
              <Link
                href={`/tools/${category.category}`}
                className="collection_tool"
                key={category.category}
                onMouseEnter={() => setHoveredTool(category)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <div className="tool_icon">
               <Image
               src={category.svgIconPath} 
               width={50}
               height={50}
               alt={category.category}
               />
                </div>
                <div className="tool_name">
                  <h3>{category.category}</h3>
                </div>
                <div className="tool_description">
                  <p>{category.description.short}</p>
                </div>
                <div className="tool_cta">
                  <strong>Check Now &gt;</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="archieve_banner banner_2"></div>
        <div className="archieve_hero hero_2">
          <div className="hero_inner">
            <div className="hero_left">
              <Image src={ToolsSVG} style={{ width: "50%", height: "auto" }} alt={'tn_tools'} />
            </div>
            <div className="hero_right">
              <div className="hero_title">
                <h1>Best Free Collection Of Online Tools</h1>
              </div>
              <div className="hero_description">
                {` Our website is your one-stop-shop for all your online needs. 
              We offer a plethora of online tools that are designed to make your experience on the internet more 
              efficient and productive. Our collection includes various generators, converters, coding tools, and 
              more that cater to different needs. Need to generate a hash code for your password? No problem! 
              Our hash generator tool is here to help. Looking to encrypt your sensitive data? We've got you 
              covered with our data encrypter tool. Want to pick the perfect color for your website? Check out 
              our color picker tool. In addition to these tools, we also offer calculators, code minifiers and 
              formatters, online photo editors, internet speed meters, SEO checkers, and many more. Our tools 
              are user-friendly, easy to use, and designed to help you achieve your desired results with minimal 
              effort. Whether you're a developer, designer, or simply an internet user, our website has something 
              for everyone. We're constantly updating our collection with new and innovative tools, so be sure to 
              check back often to see what's new. So why wait? Start exploring our website today and discover the 
              power of our online tools!`}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer version={version}/>
    </>
  );
}

export async function getStaticProps() {
  const version = getVersion()
  const category = 'categoryShowAll';
  const categoryObject = await getCategory(category);
  const categorizedTools = await getAllToolsCategorized();

  return {
    props: {
      categoryObject,
      categorizedTools,
      version
    },
  };
}
