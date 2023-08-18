import React, { useState } from "react";
import { DraggableBox } from "./DraggableBox";

export const ComponentManager = ({ componentTypes }) => {
  const [filteredComponents, setFilteredComponents] = useState(componentTypes);

  const renderComponentCard = (component, index) => {
    return (
      <>
        <DraggableBox key={index} index={index} component={component} />
        {/* <DraggableBox key={index} index={index} component={component} />
        <DraggableBox key={index} index={index} component={component} /> */}
      </>
    );
  };

  const renderList = (header, items) => {
    // if (isEmpty(items)) return null;
    return (
      <>
        <span className="m-1 widget-header">{header}</span>
        {items.map((component, i) => renderComponentCard(component, i))}
      </>
    );
  };
  const segregateSections = () => {
    const commonSection = {
      title: "commonly used",
      items: [],
    };

    const commonItems = ["Button", "Card"];

    filteredComponents.forEach((f) => {
      if (commonItems.includes(f.name)) commonSection.items.push(f);
    });
    return <>{renderList(commonSection.title, commonSection.items)}</>;
  };
  return (
    <div className="components-container mx-3">
      <div className="input-icon">
        <input
          type="text"
          className="form-control mt-3 mb-2 "
          placeholder={"Search"}
          //   value={searchQuery}
          //   onChange={(e) => handleSearchQueryChange(e)}
          data-cy="widget-search-box"
        />
      </div>
      <div className="widgets-list col-sm-12 col-lg-12 row">
        {segregateSections()}
      </div>
    </div>
  );
};
