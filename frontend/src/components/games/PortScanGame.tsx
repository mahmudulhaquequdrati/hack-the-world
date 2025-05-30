import { PORT_SCAN_PORTS } from "@/lib";
import { useState } from "react";

interface PortScanGameProps {
  onScoreUpdate: (points: number) => void;
}

const PortScanGame = ({ onScoreUpdate }: PortScanGameProps) => {
  const [ports] = useState([...PORT_SCAN_PORTS]);
  const [scannedPorts, setScannedPorts] = useState<number[]>([]);
  const [scanning, setScanning] = useState(false);

  const scanPort = (port: number) => {
    if (scannedPorts.includes(port)) return;

    setScanning(true);
    setTimeout(() => {
      setScannedPorts((prev) => [...prev, port]);
      onScoreUpdate(25);
      setScanning(false);
    }, 1000);
  };

  return (
    <div className="space-y-3">
      <div className="text-blue-400 font-bold text-sm">PORT SCANNER</div>
      <div className="bg-black/80 p-3 rounded border border-blue-400/30">
        <div className="text-blue-300 font-mono text-sm mb-2">
          Scan target: 192.168.1.100
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ports.map((port) => (
            <button
              key={port}
              onClick={() => scanPort(port)}
              disabled={scanning || scannedPorts.includes(port)}
              className={`p-2 text-xs rounded border ${
                scannedPorts.includes(port)
                  ? "bg-green-400/20 border-green-400 text-green-400"
                  : "border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
              }`}
            >
              {scannedPorts.includes(port) ? `${port} OPEN` : `Port ${port}`}
            </button>
          ))}
        </div>
      </div>
      <div className="text-blue-300 text-xs">
        Found: {scannedPorts.length}/{ports.length} open ports
      </div>
    </div>
  );
};

export default PortScanGame;
