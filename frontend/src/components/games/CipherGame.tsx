import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface CipherGameProps {
  onScoreUpdate: (points: number) => void;
}

const CipherGame = ({ onScoreUpdate }: CipherGameProps) => {
  const [cipher, setCipher] = useState("");
  const [answer, setAnswer] = useState("");
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setCipher("KHOOR ZRUOG");
  }, []);

  const checkAnswer = () => {
    if (answer.toLowerCase() === "hello world") {
      setSolved(true);
      onScoreUpdate(100);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-green-400 font-bold text-sm">CIPHER CHALLENGE</div>
      <div className="bg-black/80 p-3 rounded border border-green-400/30">
        <div className="text-green-300 font-mono text-sm mb-2">
          Decode this Caesar cipher (shift 3):
        </div>
        <div className="text-green-400 font-mono text-lg">{cipher}</div>
      </div>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter decoded message..."
        className="w-full bg-black border border-green-400/30 text-green-400 p-2 text-sm rounded"
        disabled={solved}
      />
      <Button
        size="sm"
        onClick={checkAnswer}
        disabled={solved}
        className="w-full bg-green-400 text-black hover:bg-green-300"
      >
        {solved ? "✓ SOLVED!" : "DECODE"}
      </Button>
    </div>
  );
};

export default CipherGame;
