import { useState } from "react";

/**
 * Custom hook for content drag-and-drop functionality within sections
 * Follows the same pattern as usePhaseDragAndDrop and useModuleDragAndDrop
 */
const useContentDragAndDrop = (setHasChanges, setSuccess) => {
  // Drag-and-drop state
  const [draggedContent, setDraggedContent] = useState(null);
  const [dragOverContent, setDragOverContent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sectionChanges, setSectionChanges] = useState({}); // Track changes per section

  // Drag-and-drop handlers
  const handleDragStart = (e, content) => {
    setDraggedContent(content);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);

    // Enhanced visual feedback for dragged element
    e.target.style.opacity = "0.5";
    e.target.style.transform = "scale(0.95)";
    e.target.style.transition = "all 0.2s ease";
    e.target.style.boxShadow = "0 10px 25px rgba(34, 197, 94, 0.3)";
    e.target.style.zIndex = "1000";
  };

  const handleDragEnd = (e) => {
    setDraggedContent(null);
    setDragOverContent(null);
    setIsDragging(false);
    
    // Reset enhanced visual feedback
    e.target.style.opacity = "1";
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "";
    e.target.style.zIndex = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, content) => {
    e.preventDefault();
    if (
      draggedContent &&
      draggedContent._id !== content._id &&
      draggedContent.moduleId === content.moduleId &&
      draggedContent.section === content.section
    ) {
      setDragOverContent(content);
    }
  };

  const handleDragLeave = (e) => {
    // Only clear dragOverContent if we're really leaving the element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverContent(null);
    }
  };

  const handleDrop = (e, targetContent, sectionContentItems, updateSectionContent) => {
    e.preventDefault();

    if (
      !draggedContent ||
      draggedContent._id === targetContent._id ||
      draggedContent.moduleId !== targetContent.moduleId ||
      draggedContent.section !== targetContent.section
    ) {
      return;
    }

    // Get current content sorted by order (fallback to creation date if no order)
    const sortedContent = [...sectionContentItems].sort((a, b) => {
      if (a.order && b.order) {
        return a.order - b.order;
      } else if (a.order && !b.order) {
        return -1;
      } else if (!a.order && b.order) {
        return 1;
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    // Find indices
    const draggedIndex = sortedContent.findIndex(
      (c) => c._id === draggedContent._id
    );
    const targetIndex = sortedContent.findIndex((c) => c._id === targetContent._id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder content array
    const newContent = [...sortedContent];
    const [movedContent] = newContent.splice(draggedIndex, 1);
    newContent.splice(targetIndex, 0, movedContent);

    // Recalculate orders
    const updatedContent = newContent.map((content, index) => ({
      ...content,
      order: index + 1,
    }));

    // Update local state immediately for instant UI feedback
    updateSectionContent(updatedContent);

    // Track changes for this section
    const sectionKey = `${draggedContent.moduleId}-${draggedContent.section}`;
    setSectionChanges(prev => ({
      ...prev,
      [sectionKey]: {
        moduleId: draggedContent.moduleId,
        section: draggedContent.section,
        contentOrders: updatedContent.map(content => ({
          contentId: content._id,
          order: content.order
        }))
      }
    }));

    setHasChanges(true);
    setSuccess("Content order updated! Click 'Save Order' to persist changes.");

    // Clear drag state
    setDraggedContent(null);
    setDragOverContent(null);
    setIsDragging(false);
  };

  // Get changes for a specific section
  const getSectionChanges = (moduleId, section) => {
    const sectionKey = `${moduleId}-${section}`;
    return sectionChanges[sectionKey];
  };

  // Clear changes for a specific section
  const clearSectionChanges = (moduleId, section) => {
    const sectionKey = `${moduleId}-${section}`;
    setSectionChanges(prev => {
      const newChanges = { ...prev };
      delete newChanges[sectionKey];
      
      // Update hasChanges state based on remaining changes
      const remainingChanges = Object.keys(newChanges);
      if (remainingChanges.length === 0) {
        setHasChanges(false);
      }
      
      return newChanges;
    });
  };

  // Clear all changes
  const clearAllChanges = () => {
    setSectionChanges({});
    setHasChanges(false);
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = Object.keys(sectionChanges).length > 0;

  return {
    draggedContent,
    dragOverContent,
    isDragging,
    sectionChanges,
    hasUnsavedChanges,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    getSectionChanges,
    clearSectionChanges,
    clearAllChanges,
  };
};

export default useContentDragAndDrop;