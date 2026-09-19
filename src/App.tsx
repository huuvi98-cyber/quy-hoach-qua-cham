import { useState, useEffect, useCallback } from 'react';
import { MotionConfig } from './types.ts';
import { DEFAULT_CONFIG } from './data/presets.ts';
import { MotionCanvas } from './components/MotionCanvas.tsx';
import { audioEngine } from './utils/audioSynthesizer.ts';

export default function App() {
  const [config, setConfig] = useState<MotionConfig>(DEFAULT_CONFIG);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [interactiveMode] = useState<boolean>(true);

  // Sync sound engine mute state
  useEffect(() => {
    audioEngine.setMuted(!config.soundEnabled);
  }, [config.soundEnabled]);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleToggleSound = () => {
    setConfig((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Global keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'r' || e.key === 'R') {
        setCurrentTime(0);
        if (config.soundEnabled) audioEngine.playBroadcastSting();
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleSound();
      }
    },
    [config.soundEnabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none m-0 p-0">
      <MotionCanvas
        config={config}
        isPlaying={isPlaying}
        playbackSpeed={1.0}
        currentTime={currentTime}
        onTimeUpdate={setCurrentTime}
        interactiveMode={interactiveMode}
      />
    </div>
  );
}
