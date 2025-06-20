import { useState, useCallback } from 'react';
import { contentAPI, modulesAPI, phasesAPI } from '../../../services/api';
import { 
  handleApiError, 
  generateSuccessMessage,
  optimisticUpdate,
  optimisticAdd,
  optimisticRemove,
  updateHierarchicalData,
  updateGroupedData
} from '../utils/contentUtils';

/**
 * Custom hook for managing content API operations with multi-view sync
 */
export const useContentAPI = () => {
  // State
  const [content, setContent] = useState([]);
  const [modules, setModules] = useState([]);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch content
  const fetchContent = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");
      console.log("🔄 Fetching content...");
      
      const response = await contentAPI.getAll();
      console.log("✅ Content fetched:", response.data);

      const contentData = Array.isArray(response.data) ? response.data : [];
      
      setContent(prevContent => {
        console.log("🔄 Updating content state from", prevContent.length, "to", contentData.length, "items");
        return [...contentData];
      });
      
      return contentData;
    } catch (err) {
      console.error("❌ Error fetching content:", err);
      const errorMessage = handleApiError(err, 'fetch');
      setError(errorMessage);
      setContent([]);
      return [];
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // Fetch modules
  const fetchModules = useCallback(async () => {
    try {
      const response = await modulesAPI.getAll();
      setModules(response.data || []);
      return response.data || [];
    } catch (err) {
      console.error("Error fetching modules:", err);
      const errorMessage = handleApiError(err, 'fetch modules');
      setError(errorMessage);
      setModules([]);
      return [];
    }
  }, []);

  // Fetch phases
  const fetchPhases = useCallback(async () => {
    try {
      const response = await phasesAPI.getAll();
      setPhases(response.data || []);
      return response.data || [];
    } catch (err) {
      console.error("Error fetching phases:", err);
      const errorMessage = handleApiError(err, 'fetch phases');
      setError(errorMessage);
      setPhases([]);
      return [];
    }
  }, []);

  // Initialize all data
  const initializeData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchModules(),
        fetchPhases(),
        fetchContent()
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchModules, fetchPhases, fetchContent]);

  // Submit content (create or update)
  const submitContent = useCallback(async (
    contentData, 
    isEditing, 
    editingId,
    viewMode,
    hierarchicalData,
    setHierarchicalData,
    groupedContent,
    setGroupedContent,
    contentTypes
  ) => {
    try {
      setSaving(true);
      setError("");

      let responseData;

      if (isEditing) {
        console.log("🔄 Updating content:", editingId);

        // Optimistic update for editing
        setContent(prevContent => optimisticUpdate(prevContent, { _id: editingId, ...contentData }));

        // Update hierarchical data if in hierarchical view
        if (viewMode === "hierarchical" && setHierarchicalData) {
          setHierarchicalData(prevHierarchical => 
            updateHierarchicalData(prevHierarchical, { _id: editingId, ...contentData }, 'update')
          );
        }

        // Update grouped data if in grouped view
        if ((viewMode === "groupedByModule" || viewMode === "groupedByType") && setGroupedContent) {
          setGroupedContent(prevGrouped => 
            updateGroupedData(
              prevGrouped, 
              { _id: editingId, ...contentData }, 
              'update',
              viewMode === "groupedByModule" ? 'module' : 'type',
              modules,
              contentTypes
            )
          );
        }

        const response = await contentAPI.update(editingId, contentData);
        responseData = response.data;
        console.log("✅ Content updated:", responseData);

        // Update with server response data
        setContent(prevContent => optimisticUpdate(prevContent, responseData));

      } else {
        console.log("🔄 Creating new content");
        const response = await contentAPI.create(contentData);
        responseData = response.data;
        console.log("✅ Content created:", responseData);

        // Optimistic add for new content
        setContent(prevContent => optimisticAdd(prevContent, responseData));

        // Add to hierarchical data if applicable
        if (viewMode === "hierarchical" && responseData.moduleId && setHierarchicalData) {
          setHierarchicalData(prevHierarchical =>
            updateHierarchicalData(prevHierarchical, responseData, 'add')
          );
        }

        // Add to grouped data if applicable
        if ((viewMode === "groupedByModule" || viewMode === "groupedByType") && setGroupedContent) {
          setGroupedContent(prevGrouped => 
            updateGroupedData(
              prevGrouped, 
              responseData, 
              'add',
              viewMode === "groupedByModule" ? 'module' : 'type',
              modules,
              contentTypes
            )
          );
        }
      }

      const successMessage = generateSuccessMessage(isEditing ? 'update' : 'create');
      setSuccess(successMessage);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);

      return { success: true, data: responseData };

    } catch (err) {
      console.error("❌ Error saving content:", err);
      const errorMessage = handleApiError(err, 'save');
      setError(errorMessage);

      // Rollback optimistic updates on error by refetching
      await fetchContent(false);

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);

      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  }, [fetchContent, modules]);

  // Delete content
  const deleteContent = useCallback(async (
    contentToDelete,
    viewMode,
    hierarchicalData,
    setHierarchicalData,
    groupedContent,
    setGroupedContent,
    contentTypes
  ) => {
    if (!contentToDelete) return { success: false, error: 'No content to delete' };

    try {
      setSaving(true);
      setError("");

      console.log("🔄 Deleting content:", contentToDelete._id);

      const contentToDeleteId = contentToDelete._id;

      // Optimistic removal - remove from UI immediately
      setContent(prevContent => optimisticRemove(prevContent, contentToDeleteId));

      // Remove from hierarchical data
      if (setHierarchicalData) {
        setHierarchicalData(prevHierarchical =>
          updateHierarchicalData(prevHierarchical, { _id: contentToDeleteId, moduleId: contentToDelete.moduleId }, 'remove')
        );
      }

      // Remove from grouped data
      if (setGroupedContent) {
        setGroupedContent(prevGrouped => 
          updateGroupedData(
            prevGrouped, 
            contentToDelete, 
            'remove',
            viewMode === "groupedByModule" ? 'module' : 'type',
            modules,
            contentTypes
          )
        );
      }

      const response = await contentAPI.delete(contentToDeleteId);
      console.log("✅ Content deleted:", response);

      const successMessage = generateSuccessMessage('delete');
      setSuccess(successMessage);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);

      return { success: true };
    } catch (err) {
      console.error("❌ Error deleting content:", err);
      const errorMessage = handleApiError(err, 'delete');
      setError(errorMessage);

      // Rollback optimistic deletion on error by refetching
      await fetchContent(false);

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);

      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  }, [fetchContent, modules]);

  // Create multiple content items
  const createMultipleContent = useCallback(async (
    contentItems,
    selectedModuleId,
    viewMode,
    hierarchicalData,
    setHierarchicalData,
    groupedContent,
    setGroupedContent,
    contentTypes
  ) => {
    try {
      setSaving(true);
      setError("");

      // Validate moduleId
      if (!selectedModuleId || selectedModuleId === "") {
        throw new Error("Module ID is required for content creation");
      }

      console.log("🔄 Creating multiple content items:", contentItems.length);
      console.log("📍 Using moduleId:", selectedModuleId);

      // Create all content items
      const createPromises = contentItems.map((item) => {
        const contentData = {
          ...item,
          moduleId: selectedModuleId,
        };
        delete contentData._id;
        return contentAPI.create(contentData);
      });

      const responses = await Promise.all(createPromises);
      const createdItems = responses.map(response => response.data);

      console.log("✅ Multiple content items created:", createdItems);

      // Optimistic add for new content items
      setContent(prevContent => [...prevContent, ...createdItems]);

      // Add to hierarchical data if applicable
      if (viewMode === "hierarchical" && selectedModuleId && setHierarchicalData) {
        setHierarchicalData(prevHierarchical =>
          prevHierarchical.map(phase => ({
            ...phase,
            modules: phase.modules.map(module =>
              module._id === selectedModuleId
                ? {
                    ...module,
                    content: [...module.content, ...createdItems],
                    contentCount: module.content.length + createdItems.length
                  }
                : module
            )
          }))
        );
      }

      // Add to grouped data if applicable
      if ((viewMode === "groupedByModule" || viewMode === "groupedByType") && setGroupedContent) {
        createdItems.forEach(item => {
          setGroupedContent(prevGrouped => 
            updateGroupedData(
              prevGrouped, 
              item, 
              'add',
              viewMode === "groupedByModule" ? 'module' : 'type',
              modules,
              contentTypes
            )
          );
        });
      }

      const successMessage = generateSuccessMessage('create', contentItems.length);
      setSuccess(successMessage);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);

      return { success: true, data: createdItems };
    } catch (err) {
      console.error("❌ Error creating multiple content:", err);
      const errorMessage = handleApiError(err, 'create');
      setError(errorMessage);

      // Rollback optimistic updates on error by refetching
      await fetchContent(false);

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);

      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  }, [fetchContent, modules]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  // Show success message
  const showSuccessMessage = useCallback((message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  }, []);

  // Show error message
  const showErrorMessage = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(""), 5000);
  }, []);

  return {
    // State
    content,
    modules,
    phases,
    loading,
    saving,
    error,
    success,

    // Actions
    setContent,
    setModules,
    setPhases,
    fetchContent,
    fetchModules,
    fetchPhases,
    initializeData,
    submitContent,
    deleteContent,
    createMultipleContent,
    clearMessages,
    showSuccessMessage,
    showErrorMessage,
  };
};