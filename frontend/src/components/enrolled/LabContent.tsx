import { EnrolledCourse } from "@/lib/types";
import { ContentContainer } from "./ContentContainer";
import { LoadingContent } from "./LoadingContent";

interface LabContentProps {
  course: EnrolledCourse;
  activeLab: string;
  onOpenInNewTab: (labId: string) => void;
  onClose: () => void;
}

export const LabContent = ({
  course,
  activeLab,
  onOpenInNewTab,
  onClose,
}: LabContentProps) => {
  const lab = course.labs.find((lab) => lab.id === activeLab);

  if (!lab) return null;

  return (
    <ContentContainer
      title={lab.name}
      contentType="lab"
      onOpenInNewTab={() => onOpenInNewTab(activeLab)}
      onClose={onClose}
    >
      <LoadingContent
        title="Lab Environment Loading..."
        description={lab.description}
      />
    </ContentContainer>
  );
};
