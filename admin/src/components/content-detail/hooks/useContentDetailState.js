import { useMemo, useState } from "react";
import { 
  formatContentData, 
  formatModuleData,
  formatPhaseData,
  processContentResources
} from "../utils/contentDetailUtils";
import { 
  validateAllContentDetailData,
  sanitizeContentData,
  sanitizeModuleData,
  sanitizePhaseData
} from "../utils/contentDetailValidation";

/**
 * Custom hook for ContentDetailView state management
 * Handles data processing, validation, and derived state
 */
const useContentDetailState = (rawData) => {
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'instructions' | 'resources'

  /**
   * Sanitized and validated data
   */
  const sanitizedData = useMemo(() => {
    if (!rawData) return null;

    return {
      content: sanitizeContentData(rawData.content),
      module: sanitizeModuleData(rawData.module),
      phase: sanitizePhaseData(rawData.phase),
      relatedContent: rawData.relatedContent || [],
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

    return validateAllContentDetailData(sanitizedData);
  }, [sanitizedData]);

  /**
   * Formatted content data with computed properties
   */
  const formattedContent = useMemo(() => {
    if (!sanitizedData?.content) return null;
    
    return formatContentData(sanitizedData.content);
  }, [sanitizedData?.content]);

  /**
   * Formatted module data
   */
  const formattedModule = useMemo(() => {
    if (!sanitizedData?.module) return null;
    
    return formatModuleData(sanitizedData.module);
  }, [sanitizedData?.module]);

  /**
   * Formatted phase data
   */
  const formattedPhase = useMemo(() => {
    if (!sanitizedData?.phase) return null;
    
    return formatPhaseData(sanitizedData.phase);
  }, [sanitizedData?.phase]);

  /**
   * Processed resources and instructions
   */
  const processedResources = useMemo(() => {
    if (!formattedContent) return null;

    return processContentResources(formattedContent);
  }, [formattedContent]);

  /**
   * Content status indicators
   */
  const contentStatus = useMemo(() => {
    if (!formattedContent) return null;

    return {
      isActive: formattedContent.isActive !== false,
      hasModule: Boolean(formattedModule),
      hasPhase: Boolean(formattedPhase),
      hasInstructions: Boolean(formattedContent.instructions),
      hasResources: Boolean(formattedContent.resources?.length > 0),
      hasMetadata: Boolean(formattedContent.metadata),
      hasUrl: Boolean(formattedContent.url),
      isComplete: Boolean(
        formattedContent.title &&
        formattedContent.description &&
        formattedContent.type &&
        formattedContent.url
      ),
      completionPercentage: (() => {
        let score = 0;
        if (formattedContent.title) score += 20;
        if (formattedContent.description) score += 20;
        if (formattedContent.type) score += 15;
        if (formattedContent.url) score += 15;
        if (formattedContent.instructions) score += 15;
        if (formattedContent.resources?.length > 0) score += 10;
        if (formattedContent.metadata) score += 5;
        return score;
      })(),
    };
  }, [formattedContent, formattedModule, formattedPhase]);

  /**
   * Display sections configuration
   */
  const displaySections = useMemo(() => {
    if (!contentStatus) return [];

    const sections = [
      {
        id: 'overview',
        name: 'Overview',
        available: true,
        icon: 'InformationCircleIcon',
      }
    ];

    if (contentStatus.hasInstructions) {
      sections.push({
        id: 'instructions',
        name: 'Instructions',
        available: true,
        icon: 'BookOpenIcon',
      });
    }

    if (contentStatus.hasResources) {
      sections.push({
        id: 'resources',
        name: 'Resources',
        available: true,
        icon: 'LinkIcon',
      });
    }

    return sections;
  }, [contentStatus]);

  /**
   * Content metadata breakdown for display
   */
  const metadataBreakdown = useMemo(() => {
    if (!formattedContent?.metadata) return null;

    const metadata = formattedContent.metadata;
    
    return {
      difficulty: metadata.difficulty ? 
        metadata.difficulty.charAt(0).toUpperCase() + metadata.difficulty.slice(1) 
        : null,
      estimatedTime: metadata.estimatedTime || null,
      tags: metadata.tags || [],
      prerequisites: metadata.prerequisites || [],
      tools: metadata.tools || [],
      objectives: metadata.objectives || [],
      hasAnyMetadata: Boolean(
        metadata.difficulty ||
        metadata.estimatedTime ||
        (metadata.tags && metadata.tags.length > 0) ||
        (metadata.prerequisites && metadata.prerequisites.length > 0) ||
        (metadata.tools && metadata.tools.length > 0) ||
        (metadata.objectives && metadata.objectives.length > 0)
      ),
    };
  }, [formattedContent?.metadata]);

  /**
   * Action handlers
   */
  const actions = {
    setActiveSection: (sectionId) => {
      const validSection = displaySections.find(s => s.id === sectionId && s.available);
      if (validSection) {
        setActiveSection(sectionId);
      }
    },
    
    selectFirstSection: () => {
      const firstSection = displaySections.find(s => s.available);
      if (firstSection) {
        setActiveSection(firstSection.id);
      }
    },
    
    selectNextSection: () => {
      const currentIndex = displaySections.findIndex(s => s.id === activeSection);
      const availableSections = displaySections.filter(s => s.available);
      
      if (currentIndex >= 0 && availableSections.length > 1) {
        const currentAvailableIndex = availableSections.findIndex(s => s.id === activeSection);
        const nextIndex = (currentAvailableIndex + 1) % availableSections.length;
        setActiveSection(availableSections[nextIndex].id);
      }
    },
    
    selectPreviousSection: () => {
      const currentIndex = displaySections.findIndex(s => s.id === activeSection);
      const availableSections = displaySections.filter(s => s.available);
      
      if (currentIndex >= 0 && availableSections.length > 1) {
        const currentAvailableIndex = availableSections.findIndex(s => s.id === activeSection);
        const previousIndex = currentAvailableIndex === 0 
          ? availableSections.length - 1 
          : currentAvailableIndex - 1;
        setActiveSection(availableSections[previousIndex].id);
      }
    },
  };

  return {
    // Data
    content: formattedContent,
    module: formattedModule,
    phase: formattedPhase,
    relatedContent: sanitizedData?.relatedContent || [],
    
    // Processed data
    processedResources,
    metadataBreakdown,
    displaySections,
    
    // UI state
    activeSection,
    contentStatus,
    
    // Validation
    validation,
    isValid: validation.isValid,
    
    // Actions
    actions,
  };
};

export default useContentDetailState;