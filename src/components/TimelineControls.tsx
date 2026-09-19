import React from 'react';
import { MotionPreset } from '../types.ts';
import { audioEngine } from '../utils/audioSynthesizer.ts';

interface TimelineControlsProps {
  currentTime: number;
  duration?: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activePreset: MotionPreset;
  onSelectPreset: (preset: MotionPreset) => void;
  interactiveMode: boolean;
  onToggleInteractive: () => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentTime,
  duration = 6.0,
  isPlaying,
  onTogglePlay,
  onSeek,
  playbackSpeed,
  onChangeSpeed,
  soundEnabled,
  onToggleSound,
  activePreset,
  onSelectPreset,
  interactiveMode,
  onToggleInteractive,
}) => {
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseFloat(e.target.value));
  };

  const handleRestart = () => {
    onSeek(0);
    if (!isPlaying) onTogglePlay();
    if (soundEnabled) audioEngine.playBroadcastSting();
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-neutral-900/90 border border-neutral-800 backdrop-blur-xl rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      {/* Preset Modes Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Kiểu Chuyển Động:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              id="preset-broadcast-news"
              onClick={() => {
                onSelectPreset('broadcast_news');
                if (soundEnabled) audioEngine.playBroadcastSting();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activePreset === 'broadcast_news'
                  ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span>📺</span>
              <span>Thời Sự VTV</span>
            </button>

            <button
              id="preset-fluid-waves"
              onClick={() => {
                onSelectPreset('fluid_waves');
                if (soundEnabled) audioEngine.playWhoosh();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activePreset === 'fluid_waves'
                  ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span>🌊</span>
              <span>Sóng Thủy Triều</span>
            </button>

            <button
              id="preset-pollution-crisis"
              onClick={() => {
                onSelectPreset('pollution_crisis');
                if (soundEnabled) audioEngine.playWhoosh();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activePreset === 'pollution_crisis'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span>⚠️</span>
              <span>Cảnh Báo Ô Nhiễm</span>
            </button>

            <button
              id="preset-kinetic-impact"
              onClick={() => {
                onSelectPreset('kinetic_impact');
                if (soundEnabled) audioEngine.playBroadcastSting();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activePreset === 'kinetic_impact'
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span>⚡</span>
              <span>Kinetic Typography</span>
            </button>
          </div>
        </div>

        {/* Interactive toggle */}
        <button
          id="btn-toggle-interactive-mode"
          onClick={onToggleInteractive}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border ${
            interactiveMode
              ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
              : 'bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>👆</span>
          <span>Tương Tác Chuột {interactiveMode ? 'BẬT' : 'TẮT'}</span>
        </button>
      </div>

      {/* Timeline Scrubber */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-xs font-mono text-cyan-400 min-w-[36px]">
          {currentTime.toFixed(2)}s
        </span>

        <div className="relative flex-1 flex items-center">
          <input
            id="timeline-scrubber"
            type="range"
            min="0"
            max={duration}
            step="0.05"
            value={currentTime}
            onChange={handleScrubberChange}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          />
        </div>

        <span className="text-xs font-mono text-neutral-500 min-w-[36px]">
          {duration.toFixed(2)}s
        </span>
      </div>

      {/* Playback Controls & Speed Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Play / Restart Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-play-pause"
            onClick={onTogglePlay}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold transition flex items-center justify-center shadow-lg shadow-cyan-500/20"
            title={isPlaying ? 'Tạm dừng (Space)' : 'Phát (Space)'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            id="btn-restart-animation"
            onClick={handleRestart}
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
            title="Xem lại từ đầu"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) {
                audioEngine.playRipple();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
              soundEnabled
                ? 'bg-neutral-800 border-cyan-500/40 text-cyan-300'
                : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-500'
            }`}
            title="Âm thanh hiệu ứng chuyển động"
          >
            {soundEnabled ? (
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
            <span>Âm thanh SFX: {soundEnabled ? 'BẬT' : 'TẮT'}</span>
          </button>
        </div>

        {/* Playback Speed Multipliers */}
        <div className="flex items-center gap-1.5 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800">
          {[0.5, 1.0, 1.5, 2.0].map((s) => (
            <button
              key={s}
              id={`speed-btn-${s}`}
              onClick={() => onChangeSpeed(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                playbackSpeed === s
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
