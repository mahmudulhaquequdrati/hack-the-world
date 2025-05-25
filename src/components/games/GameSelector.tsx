import { useState } from "react";
import { CipherGame, HashCrackGame, PortScanGame } from "./index";

interface GameSelectorProps {
  gameScore: number;
  onScoreUpdate: (points: number) => void;
}

const GameSelector = ({ gameScore, onScoreUpdate }: GameSelectorProps) => {
  const [activeGame, setActiveGame] = useState("cipher");

  const renderGame = () => {
    switch (activeGame) {
      case "cipher":
        return <CipherGame onScoreUpdate={onScoreUpdate} />;
      case "hash":
        return <HashCrackGame onScoreUpdate={onScoreUpdate} />;
      case "portscan":
        return <PortScanGame onScoreUpdate={onScoreUpdate} />;
      default:
        return <CipherGame onScoreUpdate={onScoreUpdate} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-green-400 text-sm">Hacker Challenges</div>
        <div className="text-green-400 font-mono text-sm">
          Score: {gameScore}
        </div>
      </div>

      <div className="flex space-x-1">
        {["cipher", "hash", "portscan"].map((game) => (
          <button
            key={game}
            onClick={() => setActiveGame(game)}
            className={`px-2 py-1 text-xs rounded border ${
              activeGame === game
                ? "bg-green-400/20 border-green-400 text-green-400"
                : "border-green-400/30 text-green-400/70 hover:text-green-400"
            }`}
          >
            {game.toUpperCase()}
          </button>
        ))}
      </div>

      {renderGame()}
    </div>
  );
};

export default GameSelector;
