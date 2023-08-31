import React, { useState } from "react";
import "./App.css";
import "react-json-pretty/themes/monikai.css";
import {TagView} from "./Components/TageView";

const App = () => {
  const [tree, setTree] = useState({
    "name": "Products",
    "children": [
      {
        "name": "Electronics",
        "children": [
          {
            "name": "Mobile Phones",
            "children": [
              {
                "name": "iPhone",
                "data": "iPhone 14X model"
              }
            ]
          },
          {
            "name": "Laptops",
            "children": [
              {
                "name": "Apple MacBook",
                "data": "High-performance laptops"
              }
            ]
          }
        ]
      },
      {
        "name": "Clothing",
        "children": [
          {
            "name": "Men's Clothing",
            "children": [
              {
                "name": "T-shirts",
                "data": "Various styles and sizes"
              }
            ]
          },
          {
            "name": "Women's Clothing",
            "children": [
              {
                "name": "Dresses",
                "data": "Casual and formal dresses"
              }
            ]
          }
        ]
      }
    ]  
  });

  const [exportedJSON, setExportedJSON] = useState(null);

  const handleExport = () => {
    const exportedTree = stripInternalProperties(tree);
    const formattedJSON = JSON.stringify(exportedTree, null, 4);
    setExportedJSON(formattedJSON);
  };
  const stripInternalProperties = (tag) => {
    const { name, children, data } = tag;
    const strippedTag = { name };

    if (data !== undefined) {
      strippedTag.data = data;
    }

    if (children !== undefined && children.length > 0) {
      strippedTag.children = children.map(stripInternalProperties);
    }

    return strippedTag;
  };

  const handleAddChild = (parentTag) => {
    const newChild = { name: "New Child", data: "Data" };

    const traverseAndAddChild = (currentTag) => {
      if (currentTag.name === parentTag.name) {
        if (!currentTag.children) {
          currentTag.children = [];
        }
        currentTag.children.push(newChild);
      } else if (currentTag.children) {
        currentTag.children = currentTag.children.map(traverseAndAddChild);
      }
      return currentTag;
    };

    setTree(traverseAndAddChild({ ...tree }));
  };

  const handleToggleCollapse = (tagToToggle) => {
    const traverseAndToggleCollapse = (currentTag) => {
      if (currentTag === tagToToggle) {
        return { ...currentTag, collapsed: !currentTag.collapsed };
      }

      if (currentTag.children) {
        return {
          ...currentTag,
          children: currentTag.children.map(traverseAndToggleCollapse),
        };
      }

      return currentTag;
    };

    setTree(traverseAndToggleCollapse(tree));
  };

  const handleUpdateName = (tagToUpdate, newName) => {
    const traverseAndUpdateName = (currentTag) => {
      if (currentTag === tagToUpdate) {
        return { ...currentTag, name: newName };
      }

      if (currentTag.children) {
        return {
          ...currentTag,
          children: currentTag.children.map(traverseAndUpdateName),
        };
      }

      return currentTag;
    };

    setTree(traverseAndUpdateName(tree));
  };

  const handleUpdateData = (tagToUpdate, newData) => {
    const traverseAndUpdateData = (currentTag) => {
      if (currentTag === tagToUpdate) {
        return { ...currentTag, data: newData };
      }

      if (currentTag.children) {
        return {
          ...currentTag,
          children: currentTag.children.map(traverseAndUpdateData),
        };
      }

      return currentTag;
    };

    setTree(traverseAndUpdateData(tree));
  };

  const copyToClipboard = () => {
    const textarea = document.createElement("textarea");
    textarea.value = exportedJSON;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Data copied to clipboard!");
  };

  return (
    <div className="App">
      <div >
      <TagView 
      className="container"
      tag={tree}
      onAddChild={handleAddChild}
      onToggleCollapse={handleToggleCollapse}
      onUpdateName={handleUpdateName}
      onUpdateData={handleUpdateData}
      />
      </div>
      <button className="export-button" onClick={handleExport}>
        Export
      </button>
        {JSON.parse(exportedJSON)?.children.length>0  && <button className="copy-button" onClick={copyToClipboard}>
            Copy
        </button>}
      <div className="exported-json">
        <h3>Products Data</h3>
        <pre>{exportedJSON}</pre>
      </div>
      <br />
      <br />
    </div>
  );
};

export default App;
