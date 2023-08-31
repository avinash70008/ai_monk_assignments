import React, { useState } from "react";
import "../App.css";

export const TagView = ({ tag, onAddChild, onToggleCollapse, onUpdateName, onUpdateData }) => {
  const [newChildName, setNewChildName] = useState("New Child");
  const [editingName, setEditingName] = useState(false);

  const handleAddChild = () => {
    onAddChild(tag);
  };

  const handleToggleCollapse = () => {
    onToggleCollapse(tag);
  };

  const handleNameChange = (event) => {
    setNewChildName(event.target.value);
  };

  const handleNameEdit = () => {
    setEditingName(true);
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();
    onUpdateName(tag, newChildName);
    setEditingName(false);
  };

  const handleDataChange = (event) => {
    onUpdateData(tag, event.target.value);
  };

  const isCollapsible = tag.children && tag.children.length > 0;
  const isCollapsed = tag.collapsed;

  return (
    <div className={`tag ${tag.name === "root" ? "root-tag" : ""}`}>
      <div className="tag-header">
        {isCollapsible && (
          <button className="collapse-button" onClick={handleToggleCollapse}>
            {isCollapsed ? ">" : "v"}
          </button>
        )}
        {editingName ? (
          <form onSubmit={handleNameSubmit}>
            <input type="text" value={newChildName} onChange={handleNameChange} autoFocus />
          </form>
        ) : (
          <div className="tag-name" onClick={handleNameEdit}>
            {tag.name}
          </div>
        )}
        {!isCollapsed && tag.name !== "root" && ( // Add condition to exclude input for root
          <button className="add-child-button" onClick={handleAddChild}>
            Add Child
          </button>
        )}
      </div>
      {!isCollapsed && (
        <div className="tag-content">
          {tag.data !== undefined && (
            <input
              type="text"
              value={tag.data}
              onChange={handleDataChange}
              placeholder="Enter data..."
            />
          )}
          {tag.children &&
            tag.children.map((child) => (
              <TagView
                key={child.name}
                tag={child}
                onAddChild={onAddChild}
                onToggleCollapse={onToggleCollapse}
                onUpdateName={onUpdateName}
                onUpdateData={onUpdateData}
              />
            ))}
        </div>
      )}
    </div>
  );
}