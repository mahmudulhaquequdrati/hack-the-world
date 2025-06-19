import { useState, useCallback, useMemo } from 'react';
import { contentAPI } from '../../../services/api';
import { filterSections, debounce } from '../utils/contentUtils';

/**
 * Custom hook for managing content section autocomplete functionality
 */
export const useContentSections = () => {
  // Section state
  const [availableSections, setAvailableSections] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [sectionError, setSectionError] = useState("");

  // Fetch sections by module ID
  const fetchSectionsByModule = useCallback(async (moduleId) => {
    if (!moduleId) {
      setAvailableSections([]);
      return [];
    }

    try {
      setSectionLoading(true);
      setSectionError("");
      
      const response = await contentAPI.getSectionsByModule(moduleId);
      const sections = response.data || [];
      
      setAvailableSections(sections);
      return sections;
    } catch (err) {
      console.error("Error fetching sections:", err);
      setSectionError("Failed to fetch sections");
      setAvailableSections([]);
      return [];
    } finally {
      setSectionLoading(false);
    }
  }, []);

  // Debounced fetch sections to avoid too many API calls
  const debouncedFetchSections = useMemo(
    () => debounce(fetchSectionsByModule, 300),
    [fetchSectionsByModule]
  );

  // Handle section input focus
  const handleSectionInputFocus = useCallback((moduleId) => {
    if (moduleId) {
      setShowSectionDropdown(true);
      fetchSectionsByModule(moduleId);
    }
  }, [fetchSectionsByModule]);

  // Handle section input blur with delay to allow selection
  const handleSectionInputBlur = useCallback(() => {
    setTimeout(() => {
      setShowSectionDropdown(false);
    }, 200);
  }, []);

  // Handle section selection
  const handleSectionSelect = useCallback((section, onSelect) => {
    if (onSelect) {
      onSelect(section);
    }
    setShowSectionDropdown(false);
  }, []);

  // Filter sections based on input value
  const getFilteredSections = useCallback((inputValue) => {
    return filterSections(availableSections, inputValue);
  }, [availableSections]);

  // Clear section data
  const clearSections = useCallback(() => {
    setAvailableSections([]);
    setShowSectionDropdown(false);
    setSectionError("");
  }, []);

  // Check if section exists in available sections
  const isSectionAvailable = useCallback((section) => {
    return availableSections.includes(section);
  }, [availableSections]);

  // Get section suggestions for new content
  const getSectionSuggestions = useCallback((contentType, moduleId) => {
    // This could be enhanced to provide intelligent suggestions based on content type
    const typeSuggestions = {
      video: ['Introduction', 'Theory', 'Examples', 'Practice'],
      lab: ['Setup', 'Instructions', 'Exercise', 'Solution'],
      game: ['Tutorial', 'Level 1', 'Level 2', 'Challenge'],
      document: ['Overview', 'Reference', 'Guide', 'Documentation']
    };

    const suggestions = typeSuggestions[contentType] || ['General'];
    
    // Combine with existing sections for the module
    return [...new Set([...availableSections, ...suggestions])];
  }, [availableSections]);

  // Validate section input
  const validateSectionInput = useCallback((section, allowNew = true) => {
    if (!section || !section.trim()) {
      return { isValid: true, warning: null }; // Section is optional
    }

    const trimmedSection = section.trim();
    
    if (trimmedSection.length < 2) {
      return { 
        isValid: false, 
        error: "Section name must be at least 2 characters long" 
      };
    }

    if (trimmedSection.length > 50) {
      return { 
        isValid: false, 
        error: "Section name must be less than 50 characters" 
      };
    }

    // Check if section exists
    if (!isSectionAvailable(trimmedSection) && !allowNew) {
      return { 
        isValid: false, 
        error: "Section not found. Please select from available sections." 
      };
    }

    // Warning for new sections
    if (!isSectionAvailable(trimmedSection) && allowNew) {
      return { 
        isValid: true, 
        warning: "This will create a new section for the module" 
      };
    }

    return { isValid: true };
  }, [isSectionAvailable]);

  // Auto-refresh sections when module changes
  const refreshSectionsForModule = useCallback((moduleId) => {
    if (moduleId) {
      debouncedFetchSections(moduleId);
    } else {
      clearSections();
    }
  }, [debouncedFetchSections, clearSections]);

  // Get unique sections across all modules (for global filtering)
  const getAllSections = useCallback(async () => {
    try {
      setSectionLoading(true);
      setSectionError("");
      
      // This would need a specific API endpoint to get all sections
      // For now, we'll return the current available sections
      return availableSections;
    } catch (err) {
      console.error("Error fetching all sections:", err);
      setSectionError("Failed to fetch sections");
      return [];
    } finally {
      setSectionLoading(false);
    }
  }, [availableSections]);

  return {
    // State
    availableSections,
    sectionLoading,
    showSectionDropdown,
    sectionError,

    // Actions
    setAvailableSections,
    setShowSectionDropdown,
    fetchSectionsByModule,
    debouncedFetchSections,
    handleSectionInputFocus,
    handleSectionInputBlur,
    handleSectionSelect,
    clearSections,
    refreshSectionsForModule,
    getAllSections,

    // Utility functions
    getFilteredSections,
    isSectionAvailable,
    getSectionSuggestions,
    validateSectionInput,
  };
};