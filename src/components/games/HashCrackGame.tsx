import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HashCrackGameProps {
  onScoreUpdate: (points: number) => void;
}

const HashCrackGame = ({ onScoreUpdate }: HashCrackGameProps) => {
  const [hash] = useState("5d41402abc4b2a76b9719d911017c592");
  const [guess, setGuess] = useState("");
  const [cracked, setCracked] = useState(false);

  const checkHash = () => {
    if (guess.toLowerCase() === "hello") {
      setCracked(true);
      onScoreUpdate(150);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-red-400 font-bold text-sm">HASH CRACKER</div>
      <div className="bg-black/80 p-3 rounded border border-red-400/30">
        <div className="text-red-300 font-mono text-sm mb-2">
          Crack this MD5 hash:
        </div>
        <div className="text-red-400 font-mono text-xs break-all">{hash}</div>
      </div>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter original text..."
        className="w-full bg-black border border-red-400/30 text-red-400 p-2 text-sm rounded"
        disabled={cracked}
      />
      <Button
        size="sm"
        onClick={checkHash}
        disabled={cracked}
        className="w-full bg-red-400 text-black hover:bg-red-300"
      >
        {cracked ? "✓ CRACKED!" : "CRACK HASH"}
      </Button>
    </div>
  );
};

export default HashCrackGame;
