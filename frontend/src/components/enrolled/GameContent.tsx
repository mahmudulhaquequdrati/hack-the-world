import { EnrolledCourse } from "@/lib/types";
import { InteractiveContent } from "./InteractiveContent";

interface GameContentProps {
  course: EnrolledCourse;
  activeGame: string;
  onOpenInNewTab: (gameId: string) => void;
  onClose: () => void;
}

export const GameContent = ({
  course,
  activeGame,
  onOpenInNewTab,
  onClose,
}: GameContentProps) => {
  return (
    <InteractiveContent
      items={course.games}
      activeItemId={activeGame}
      contentType="game"
      onOpenInNewTab={onOpenInNewTab}
      onClose={onClose}
    />
  );
};
