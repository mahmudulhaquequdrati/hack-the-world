import { EnrolledCourse } from "@/lib/types";
import { ContentContainer } from "./ContentContainer";
import { LoadingContent } from "./LoadingContent";

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
  const game = course.games.find((game) => game.id === activeGame);

  if (!game) return null;

  return (
    <ContentContainer
      title={game.name}
      contentType="game"
      onOpenInNewTab={() => onOpenInNewTab(activeGame)}
      onClose={onClose}
    >
      <LoadingContent title="Game Loading..." description={game.description} />
    </ContentContainer>
  );
};
