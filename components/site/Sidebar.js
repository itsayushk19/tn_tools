import { useState, useEffect } from "react";
import Link from "next/link";
import slugify from "slugify";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Sidebar({ categorizedTools }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [activeTool, setActiveTool] = useState(null);

  const router = useRouter();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleToolHover = (tool) => {
    setActiveTool(tool);
  };

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router.asPath]);

  const getCurrentToolId = () => {
    const pathSegments = currentPath.split("/");
    return pathSegments[pathSegments.length - 1];
  };

  const isCurrentTool = (tool) => {
    return slugify(tool.name) === getCurrentToolId();
  };

  return (
    <div className="sideNav_container">

      {Object.entries(categorizedTools).map(([categoryName, tools]) => (
        <details
          key={`category-${categoryName}`}
          open={tools.some(isCurrentTool)}
        >
          <summary
            className={`list_category_title ${tools.some(isCurrentTool) ? "category_active" : ""
              }`}
          >
            
            {categoryName} Tools
          </summary>
          <div className="list_item_container">
            {tools
              .filter((tool) =>
                tool.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((tool) => (
                <div
                  className={`list_item_title ${isCurrentTool(tool) ? "openNow" : ""
                    }`}
                  key={`tool-${categoryName}-${tool.name}`}
                  onMouseEnter={() => handleToolHover(tool)}
                  onMouseLeave={() => setActiveTool(null)}
                  onClick={() =>
                  (window.location.href = `/tools/${slugify(
                    tool.category
                  )}/${slugify(tool.name)}`)
                  }
                >
                  <Image
                    src={isCurrentTool(tool) ? tool.activeSVG : tool.defaultSVG}
                    width={30}
                    height={30}
                    alt={tool.title}
                  />
                  <Link
                    className={` ${currentPath === `/tools/${slugify(tool.name)}`
                        ? `${Sidebar.active}`
                        : ""
                      }`}
                    href={`/tools/${slugify(tool.category)}/${slugify(
                      tool.name
                    )}`}
                  >
                    {tool.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ? (
                      <span>
                        {tool.name
                          .toLowerCase()
                          .replace(/-/g, " ") // Replace all occurrences of "-" with whitespace
                          .split(searchQuery.toLowerCase())
                          .reduce((prev, current, i) => {
                            if (!i) {
                              return [current];
                            }
                            return prev.concat(
                              <b key={searchQuery + current}>{searchQuery}</b>,
                              current
                            );
                          }, [])}
                      </span>
                    ) : (
                      <span>{tool.ud}</span>
                    )}
                  </Link>
                </div>
              ))}
          </div>
        </details>
      ))}
    </div>
  );
}
