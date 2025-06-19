import { useMemo, useState } from "react";
import { 
  formatModuleData, 
  processContentSections
} from "../utils/moduleDetailUtils";
import { 
  validateAllModuleDetailData,
  sanitizeModuleData,
  sanitizePhaseData,
  sanitizeContentData
} from "../utils/moduleDetailValidation";

/**
 * Custom hook for ModuleDetailView state management
 * Handles data processing, validation, and derived state
 */
const useModuleDetailState = (rawData) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [viewMode, setViewMode] = useState('sections'); // 'sections' | 'list'

  /**
   * Sanitized and validated data
   */
  const sanitizedData = useMemo(() => {
    if (!rawData) return null;

    return {
      module: sanitizeModuleData(rawData.module),
      phase: sanitizePhaseData(rawData.phase),
      content: sanitizeContentData(rawData.content || []),
      contentBySections: rawData.contentBySections || {},
      statistics: rawData.statistics || {
        totalContent: 0,
        totalDuration: 0,
      }
    };
  }, [rawData]);

  /**
   * Validation results
   */
  const validation = useMemo(() => {
    if (!sanitizedData) {
      return {
        isValid: false,
        errors: ["No data available"],
        warnings: []
      };
    }

    return validateAllModuleDetailData(sanitizedData);
  }, [sanitizedData]);

  /**
   * Formatted module data with computed properties
   */
  const formattedModule = useMemo(() => {
    if (!sanitizedData?.module) return null;
    
    return formatModuleData(sanitizedData.module, sanitizedData.phase);
  }, [sanitizedData]);

  /**
   * Processed content sections with metadata
   */
  const processedSections = useMemo(() => {
    if (!sanitizedData) return {};

    return processContentSections(
      sanitizedData.contentBySections,
      sanitizedData.content
    );
  }, [sanitizedData]);

  /**
   * Section names array for navigation
   */
  const sectionNames = useMemo(() => {
    return Object.keys(processedSections).sort();
  }, [processedSections]);

  /**
   * Currently selected section data
   */
  const currentSection = useMemo(() => {
    if (!selectedSection || !processedSections[selectedSection]) {
      return null;
    }
    return processedSections[selectedSection];
  }, [selectedSection, processedSections]);

  /**
   * Content statistics with additional computed metrics
   */
  const enhancedStatistics = useMemo(() => {
    if (!sanitizedData?.statistics) return null;

    const stats = sanitizedData.statistics;
    
    return {
      ...stats,
      // Add percentage breakdowns
      contentTypePercentages: stats.totalContent > 0 ? {
        video: Math.round((stats.videoCount / stats.totalContent) * 100),
        lab: Math.round((stats.labCount / stats.totalContent) * 100),
        game: Math.round((stats.gameCount / stats.totalContent) * 100),
        document: Math.round((stats.documentCount / stats.totalContent) * 100),
      } : {},
      // Add section statistics
      sectionStats: Object.entries(processedSections).map(([name, section]) => ({
        name,
        count: section.count,
        duration: section.totalDuration,
        percentage: stats.totalContent > 0 
          ? Math.round((section.count / stats.totalContent) * 100)
          : 0,
      })),
    };
  }, [sanitizedData?.statistics, processedSections]);

  /**
   * Content display options
   */
  const displayOptions = useMemo(() => {
    const hasMultipleSections = sectionNames.length > 1;
    const hasContent = sanitizedData?.content?.length > 0;

    return {
      showSectionTabs: hasMultipleSections,
      showListView: hasContent,
      defaultViewMode: hasMultipleSections ? 'sections' : 'list',
      canToggleView: hasContent && hasMultipleSections,
    };
  }, [sectionNames.length, sanitizedData?.content?.length]);

  /**
   * Module status indicators
   */
  const moduleStatus = useMemo(() => {
    if (!formattedModule) return null;

    return {
      isActive: formattedModule.isActive !== false,
      hasPhase: Boolean(sanitizedData?.phase),
      hasContent: (sanitizedData?.content?.length || 0) > 0,
      isComplete: Boolean(
        formattedModule.title &&
        formattedModule.description &&
        (sanitizedData?.content?.length || 0) > 0
      ),
      completionPercentage: (() => {
        let score = 0;
        if (formattedModule.title) score += 25;
        if (formattedModule.description) score += 25;
        if (formattedModule.difficulty) score += 15;
        if (formattedModule.estimatedHours) score += 10;
        if ((sanitizedData?.content?.length || 0) > 0) score += 25;
        return score;
      })(),
    };
  }, [formattedModule, sanitizedData]);

  /**
   * Action handlers
   */
  const actions = {
    setSelectedSection: (sectionName) => {
      setSelectedSection(sectionName);
    },
    
    setViewMode: (mode) => {
      setViewMode(mode);
    },
    
    selectFirstSection: () => {
      if (sectionNames.length > 0) {
        setSelectedSection(sectionNames[0]);
      }
    },
    
    selectNextSection: () => {
      if (!selectedSection || sectionNames.length === 0) return;
      
      const currentIndex = sectionNames.indexOf(selectedSection);
      const nextIndex = (currentIndex + 1) % sectionNames.length;
      setSelectedSection(sectionNames[nextIndex]);
    },
    
    selectPreviousSection: () => {
      if (!selectedSection || sectionNames.length === 0) return;
      
      const currentIndex = sectionNames.indexOf(selectedSection);
      const previousIndex = currentIndex === 0 
        ? sectionNames.length - 1 
        : currentIndex - 1;
      setSelectedSection(sectionNames[previousIndex]);
    },
    
    clearSelection: () => {
      setSelectedSection(null);
    },
  };

  return {
    // Data
    module: formattedModule,
    phase: sanitizedData?.phase || null,
    content: sanitizedData?.content || [],
    contentBySections: sanitizedData?.contentBySections || {},
    statistics: enhancedStatistics,
    
    // Processed data
    processedSections,
    sectionNames,
    currentSection,
    
    // UI state
    selectedSection,
    viewMode,
    displayOptions,
    moduleStatus,
    
    // Validation
    validation,
    isValid: validation.isValid,
    
    // Actions
    actions,
  };
};

export default useModuleDetailState;