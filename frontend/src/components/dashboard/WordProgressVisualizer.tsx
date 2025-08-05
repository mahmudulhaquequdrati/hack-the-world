import React from 'react';

interface WordProgressVisualizerProps {
  word: string;
  progress: number; // 0-100
  className?: string;
  revealedColor?: string;
  hiddenColor?: string;
  hiddenChar?: string;
}

export const WordProgressVisualizer = ({
  word,
  progress,
  className = '',
  revealedColor = 'text-green-400',
  hiddenColor = 'text-gray-600',
  hiddenChar = '█'
}: WordProgressVisualizerProps) => {
  const totalChars = word.length;
  const revealedChars = Math.floor((progress / 100) * totalChars);

  return (
    <div className={`font-mono text-center ${className}`}>
      <div className="flex justify-center items-center space-x-1">
        {word.split('').map((char, index) => {
          const isRevealed = index < revealedChars;
          return (
            <span
              key={index}
              className={`transition-all duration-500 font-bold text-2xl ${
                isRevealed ? revealedColor : hiddenColor
              }`}
            >
              {isRevealed ? char : hiddenChar}
            </span>
          );
        })}
      </div>
      <div className="mt-2 text-sm font-mono opacity-60">
        {Math.round(progress)}% • {revealedChars}/{totalChars} revealed
      </div>
    </div>
  );
};

interface ProgressWordDisplayProps {
  modules: any[];
  title?: string;
  className?: string;
}

export const ProgressWordDisplay = ({ 
  modules, 
  title = "PROGRESS",
  className = "" 
}: ProgressWordDisplayProps) => {
  // Calculate overall progress
  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.completed).length;
  const overallProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  return (
    <div className={`bg-black/50 border border-green-400/30 rounded-xl p-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-green-400 font-mono text-lg mb-6 uppercase tracking-wider">
          {title}_STATUS
        </h3>
        
        <WordProgressVisualizer
          word="HACKER"
          progress={overallProgress}
          className="mb-6"
          revealedColor="text-green-400"
          hiddenColor="text-gray-700"
        />

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-900/50 border border-green-400/20 rounded-lg p-3">
            <div className="text-green-400 font-mono text-sm">COMPLETED</div>
            <div className="text-green-300 font-mono text-xl font-bold">
              {completedModules}
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-yellow-400/20 rounded-lg p-3">
            <div className="text-yellow-400 font-mono text-sm">IN_PROGRESS</div>
            <div className="text-yellow-300 font-mono text-xl font-bold">
              {modules.filter(m => (m.progress || 0) > 0 && !m.completed).length}
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-cyan-400/20 rounded-lg p-3">
            <div className="text-cyan-400 font-mono text-sm">TOTAL</div>
            <div className="text-cyan-300 font-mono text-xl font-bold">
              {totalModules}
            </div>
          </div>
        </div>

        {/* Progress Words for different categories */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Beginner Progress */}
            <div className="bg-gray-900/30 border border-green-400/20 rounded-lg p-4">
              <WordProgressVisualizer
                word="SCRIPT"
                progress={calculateCategoryProgress(modules, 'Beginner')}
                className="mb-2"
                revealedColor="text-green-400"
                hiddenColor="text-gray-700"
              />
              <div className="text-green-400/60 font-mono text-xs uppercase">
                Beginner Level
              </div>
            </div>

            {/* Intermediate Progress */}
            <div className="bg-gray-900/30 border border-yellow-400/20 rounded-lg p-4">
              <WordProgressVisualizer
                word="EXPLOIT"
                progress={calculateCategoryProgress(modules, 'Intermediate')}
                className="mb-2"
                revealedColor="text-yellow-400"
                hiddenColor="text-gray-700"
              />
              <div className="text-yellow-400/60 font-mono text-xs uppercase">
                Intermediate Level
              </div>
            </div>

            {/* Advanced Progress */}
            <div className="bg-gray-900/30 border border-red-400/20 rounded-lg p-4">
              <WordProgressVisualizer
                word="PWNED"
                progress={calculateCategoryProgress(modules, 'Advanced')}
                className="mb-2"
                revealedColor="text-red-400"
                hiddenColor="text-gray-700"
              />
              <div className="text-red-400/60 font-mono text-xs uppercase">
                Advanced Level
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate progress for a specific category
function calculateCategoryProgress(modules: any[], difficulty: string): number {
  const categoryModules = modules.filter(m => m.difficulty === difficulty);
  if (categoryModules.length === 0) return 0;
  
  const completedInCategory = categoryModules.filter(m => m.completed).length;
  return (completedInCategory / categoryModules.length) * 100;
}