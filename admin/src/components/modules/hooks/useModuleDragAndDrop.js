import { useState } from "react";

const useModuleDragAndDrop = (modulesWithPhases, setModulesWithPhases, setHasModuleChanges, setSuccess) => {
  const [draggedModule, setDraggedModule] = useState(null);
  const [dragOverModule, setDragOverModule] = useState(null);
  const [isDraggingModule, setIsDraggingModule] = useState(false);

  const handleModuleDragStart = (e, module) => {
    setDraggedModule(module);
    setIsDraggingModule(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);

    // Add visual feedback to dragged element
    e.target.style.opacity = "0.5";
  };

  const handleModuleDragEnd = (e) => {
    setDraggedModule(null);
    setDragOverModule(null);
    setIsDraggingModule(false);
    e.target.style.opacity = "1";
  };

  const handleModuleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleModuleDragEnter = (e, module) => {
    e.preventDefault();
    if (
      draggedModule &&
      draggedModule._id !== module._id &&
      draggedModule.phaseId === module.phaseId
    ) {
      setDragOverModule(module);
    }
  };

  const handleModuleDragLeave = (e) => {
    // Only clear dragOverModule if we're really leaving the element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverModule(null);
    }
  };

  const handleModuleDrop = (e, targetModule) => {
    e.preventDefault();

    if (
      !draggedModule ||
      draggedModule._id === targetModule._id ||
      draggedModule.phaseId !== targetModule.phaseId
    ) {
      return;
    }

    // Get modules in the same phase sorted by order
    const phaseModules =
      modulesWithPhases.find((phase) => phase._id === draggedModule.phaseId)
        ?.modules || [];

    const sortedModules = [...phaseModules].sort((a, b) => a.order - b.order);

    // Find indices
    const draggedIndex = sortedModules.findIndex(
      (m) => m._id === draggedModule._id
    );
    const targetIndex = sortedModules.findIndex(
      (m) => m._id === targetModule._id
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder modules array
    const newModules = [...sortedModules];
    const [movedModule] = newModules.splice(draggedIndex, 1);
    newModules.splice(targetIndex, 0, movedModule);

    // Recalculate orders for this phase only
    const updatedModules = newModules.map((module, index) => ({
      ...module,
      order: index + 1,
    }));

    // Update modulesWithPhases state immediately for instant UI feedback
    const updatedModulesWithPhases = modulesWithPhases.map((phase) => {
      if (phase._id === draggedModule.phaseId) {
        return {
          ...phase,
          modules: updatedModules,
        };
      }
      return phase;
    });

    setModulesWithPhases(updatedModulesWithPhases);
    setHasModuleChanges(true);
    setSuccess(
      "Module order updated! Click 'Save Module Order' to persist changes."
    );

    // Clear drag state
    setDraggedModule(null);
    setDragOverModule(null);
  };

  return {
    draggedModule,
    dragOverModule,
    isDraggingModule,
    handleModuleDragStart,
    handleModuleDragEnd,
    handleModuleDragOver,
    handleModuleDragEnter,
    handleModuleDragLeave,
    handleModuleDrop,
  };
};

export default useModuleDragAndDrop;