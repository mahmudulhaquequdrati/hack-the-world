import { EnrolledCourse } from "@/lib/types";
import { InteractiveContent } from "./InteractiveContent";

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
  return (
    <InteractiveContent
      items={course.labs}
      activeItemId={activeLab}
      contentType="lab"
      onOpenInNewTab={onOpenInNewTab}
      onClose={onClose}
    />
  );
};
