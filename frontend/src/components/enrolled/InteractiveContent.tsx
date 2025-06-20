import { ContentContainer } from "./ContentContainer";
import { LoadingContent } from "./LoadingContent";

interface ContentItem {
  _id: string;
  name: string;
  description: string;
}

interface InteractiveContentProps {
  items: ContentItem[];
  activeItemId: string;
  contentType: "lab" | "game";
  onOpenInNewTab: (itemId: string) => void;
  onClose: () => void;
  loadingTitle?: string;
}

export const InteractiveContent = ({
  items,
  activeItemId,
  contentType,
  onOpenInNewTab,
  onClose,
  loadingTitle,
}: InteractiveContentProps) => {
  const item = items.find((item) => item._id === activeItemId);

  if (!item) return null;

  const defaultLoadingTitle = 
    contentType === "lab" 
      ? "Lab Environment Loading..." 
      : "Game Loading...";

  return (
    <ContentContainer
      title={item.name}
      contentType={contentType}
      onOpenInNewTab={() => onOpenInNewTab(activeItemId)}
      onClose={onClose}
    >
      <LoadingContent
        title={loadingTitle || defaultLoadingTitle}
        description={item.description}
      />
    </ContentContainer>
  );
};