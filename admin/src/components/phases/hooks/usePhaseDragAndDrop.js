import { useState } from "react";

const usePhaseDragAndDrop = (phases, setPhases, setHasChanges, setSuccess) => {
  // Drag-and-drop state
  const [draggedPhase, setDraggedPhase] = useState(null);
  const [dragOverPhase, setDragOverPhase] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag-and-drop handlers
  const handleDragStart = (e, phase) => {
    setDraggedPhase(phase);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);

    // Add visual feedback to dragged element
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    setDraggedPhase(null);
    setDragOverPhase(null);
    setIsDragging(false);
    e.target.style.opacity = "1";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, phase) => {
    e.preventDefault();
    if (draggedPhase && draggedPhase.id !== phase.id) {
      setDragOverPhase(phase);
    }
  };

  const handleDragLeave = (e) => {
    // Only clear dragOverPhase if we're really leaving the element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverPhase(null);
    }
  };

  const handleDrop = (e, targetPhase) => {
    e.preventDefault();

    if (!draggedPhase || draggedPhase.id === targetPhase.id) {
      return;
    }

    // Get current phases sorted by order
    const sortedPhases = [...phases].sort((a, b) => a.order - b.order);

    // Find indices
    const draggedIndex = sortedPhases.findIndex(
      (p) => p.id === draggedPhase.id
    );
    const targetIndex = sortedPhases.findIndex((p) => p.id === targetPhase.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder phases array
    const newPhases = [...sortedPhases];
    const [movedPhase] = newPhases.splice(draggedIndex, 1);
    newPhases.splice(targetIndex, 0, movedPhase);

    // Recalculate orders
    const updatedPhases = newPhases.map((phase, index) => ({
      ...phase,
      order: index + 1,
    }));

    // Update local state immediately for instant UI feedback
    setPhases(updatedPhases);
    setHasChanges(true);
    setSuccess("Phase order updated! Click 'Save Order' to persist changes.");

    // Clear drag state
    setDraggedPhase(null);
    setDragOverPhase(null);
    setIsDragging(false);
  };

  return {
    draggedPhase,
    dragOverPhase,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
};

export default usePhaseDragAndDrop;