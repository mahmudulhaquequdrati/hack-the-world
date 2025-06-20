import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for managing content filters
 */
export const useContentFilters = () => {
  // Filter state
  const [filters, setFilters] = useState({
    type: "",
    moduleId: "",
    phaseId: "",
    difficulty: "",
    section: "",
  });

  // Handle filter changes
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      type: "",
      moduleId: "",
      phaseId: "",
      difficulty: "",
      section: "",
    });
  }, []);

  // Set multiple filters at once
  const setMultipleFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Filter content based on current filters
  const filterContent = useCallback((content) => {
    return content.filter((item) => {
      // Type filter
      if (filters.type && item.type !== filters.type) return false;
      
      // Module filter
      if (filters.moduleId && item.moduleId !== filters.moduleId) return false;
      
      // Phase filter (requires module data to check)
      if (filters.phaseId) {
        // This would need to be implemented with module data
        // For now, we'll skip this filter in the basic implementation
      }
      
      // Difficulty filter
      if (filters.difficulty && item.difficulty !== filters.difficulty) return false;
      
      // Section filter (partial match)
      if (filters.section && !item.section?.toLowerCase().includes(filters.section.toLowerCase())) return false;
      
      return true;
    });
  }, [filters]);

  // Get filtered content with memoization
  const getFilteredContent = useCallback((content) => {
    return useMemo(() => filterContent(content), [content, filters]);
  }, [filterContent]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== "");
  }, [filters]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== "").length;
  }, [filters]);

  // Get active filters object (only non-empty values)
  const activeFilters = useMemo(() => {
    return Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value !== "")
    );
  }, [filters]);

  // Get filter summary text
  const getFilterSummary = useCallback((contentTypes = [], modules = []) => {
    const activeParts = [];
    
    if (filters.type) {
      const contentType = contentTypes.find(ct => ct.value === filters.type);
      activeParts.push(`Type: ${contentType?.label || filters.type}`);
    }
    
    if (filters.moduleId) {
      const module = modules.find(m => m.id === filters.moduleId);
      activeParts.push(`Module: ${module?.title || filters.moduleId}`);
    }
    
    if (filters.difficulty) {
      activeParts.push(`Difficulty: ${filters.difficulty}`);
    }
    
    if (filters.section) {
      activeParts.push(`Section: ${filters.section}`);
    }
    
    return activeParts.length > 0 ? activeParts.join(" • ") : "No filters applied";
  }, [filters]);

  // Advanced filtering with search text
  const filterContentWithSearch = useCallback((content, searchText = "") => {
    let filtered = filterContent(content);
    
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.section?.toLowerCase().includes(search) ||
        item.tags?.some(tag => tag.toLowerCase().includes(search)) ||
        item.author?.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }, [filterContent]);

  // Filter suggestions based on content
  const getFilterSuggestions = useCallback((content) => {
    const suggestions = {
      types: [...new Set(content.map(item => item.type).filter(Boolean))],
      difficulties: [...new Set(content.map(item => item.difficulty).filter(Boolean))],
      sections: [...new Set(content.map(item => item.section).filter(Boolean))],
      modules: [...new Set(content.map(item => item.moduleId).filter(Boolean))],
    };
    
    return suggestions;
  }, []);

  // Quick filter presets
  const applyQuickFilter = useCallback((preset) => {
    switch (preset) {
      case 'videos':
        setFilters(prev => ({ ...prev, type: "video" }));
        break;
      case 'labs':
        setFilters(prev => ({ ...prev, type: "lab" }));
        break;
      case 'games':
        setFilters(prev => ({ ...prev, type: "game" }));
        break;
      case 'documents':
        setFilters(prev => ({ ...prev, type: "document" }));
        break;
      case 'beginner':
        setFilters(prev => ({ ...prev, difficulty: "beginner" }));
        break;
      case 'advanced':
        setFilters(prev => ({ ...prev, difficulty: "advanced" }));
        break;
      default:
        resetFilters();
    }
  }, [resetFilters]);

  return {
    // State
    filters,
    
    // Actions
    handleFilterChange,
    resetFilters,
    setMultipleFilters,
    applyQuickFilter,
    
    // Filter functions
    filterContent,
    getFilteredContent,
    filterContentWithSearch,
    
    // Computed values
    hasActiveFilters,
    activeFilterCount,
    activeFilters,
    getFilterSummary,
    getFilterSuggestions,
  };
};