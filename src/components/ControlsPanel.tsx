import React, { useState } from 'react';
import { AspectRatioType, ColorPalette, MotionConfig } from '../types.ts';
import { COLOR_PALETTES, TEXT_VARIANTS } from '../data/presets.ts';

interface ControlsPanelProps {
  config: MotionConfig;
  onChangeConfig: (updater: (prev: MotionConfig) => MotionConfig) => void;
  onResetOriginal: () => void;
  onOpenOriginalCompare: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  config,
  onChangeConfig,
  onResetOriginal,
  onOpenOriginalCompare,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'wave' | 'colors' | 'export'>('content');
  const [copiedSvg, setCopiedSvg] = useState(false);

  const handleUpdate = <K extends keyof MotionConfig>(key: K, value: MotionConfig[K]) => {
    onChangeConfig((prev) => ({ ...prev, [key]: value }));
  };

  const activePalette = COLOR_PALETTES.find((p) => p.id === config.paletteId) || COLOR_PALETTES[0];

  // SVG Export generator
  const generateSvgCode = () => {
    const isOriginal = config.paletteId === 'original';
    const topCol = isOriginal ? '#0B566F' : activePalette.topText;
    const botCol = '#FFFFFF';
    const waveCol = activePalette.waveBorder;
    const botBg = activePalette.bottomBg;

    return `<!-- Đồ Họa Động Motion Graphics Banner -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="100%" height="100%">
  <defs>
    <style>
      @keyframes fluidWave {
        0% { transform: translateX(0); }
        50% { transform: translateX(-80px); }
        100% { transform: translateX(0); }
      }
      @keyframes floatText {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      .wave-path { animation: fluidWave 5s ease-in-out infinite; }
      .text-top { font-family: 'Montserrat', 'Be Vietnam Pro', sans-serif; font-weight: 900; fill: ${topCol}; }
      .text-bot { font-family: 'Montserrat', 'Be Vietnam Pro', sans-serif; font-weight: 900; fill: ${botCol}; }
    </style>
  </defs>
  
  <!-- Upper Section Background -->
  <rect width="1200" height="600" fill="${activePalette.topBg}" />

  <!-- Lower Section & Fluid Wave -->
  <path class="wave-path" d="M0,320 C300,380 450,260 700,240 C950,220 1100,290 1200,280 L1200,600 L0,600 Z" fill="${botBg}" />
  <path class="wave-path" d="M0,320 C300,380 450,260 700,240 C950,220 1100,290 1200,280" fill="none" stroke="${waveCol}" stroke-width="14" stroke-linecap="round" />

  <!-- Top Text -->
  <g class="text-top" style="animation: floatText 4s ease-in-out infinite;">
    ${config.topText
      .split('\n')
      .map((line, i) => `<text x="140" y="${140 + i * 65}" font-size="56">${line}</text>`)
      .join('\n    ')}
  </g>

  <!-- Bottom Text -->
  <g class="text-bot" style="animation: floatText 4s ease-in-out infinite 0.5s;">
    ${config.bottomText
      .split('\n')
      .map((line, i) => `<text x="580" y="${360 + i * 65}" font-size="58">${line}</text>`)
      .join('\n    ')}
  </g>
</svg>`;
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(generateSvgCode());
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 bg-neutral-950/60">
        <div className="flex items-center gap-1">
          <button
            id="tab-btn-content"
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'content'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>📝</span>
            <span>Nội Dung & Chữ</span>
          </button>

          <button
            id="tab-btn-wave"
            onClick={() => setActiveTab('wave')}
            className={`px-4 py-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'wave'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>🌊</span>
            <span>Hiệu Ứng Sóng & Hạt</span>
          </button>

          <button
            id="tab-btn-colors"
            onClick={() => setActiveTab('colors')}
            className={`px-4 py-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'colors'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>🎨</span>
            <span>Màu Sắc & Tỉ Lệ</span>
          </button>

          <button
            id="tab-btn-export"
            onClick={() => setActiveTab('export')}
            className={`px-4 py-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'export'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>🚀</span>
            <span>Mã Nhúng SVG</span>
          </button>
        </div>

        <div className="flex items-center gap-2 py-2">
          <button
            id="btn-open-original-reference"
            onClick={onOpenOriginalCompare}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition flex items-center gap-1.5"
            title="Xem ảnh gốc đối chiếu"
          >
            <span>🖼️</span>
            <span className="hidden sm:inline">So sánh ảnh gốc</span>
          </button>

          <button
            id="btn-reset-default-config"
            onClick={onResetOriginal}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
            title="Khôi phục nguyên bản đồ họa"
          >
            <span>Khôi phục gốc</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-5">
        {/* TAB 1: CONTENT & TYPOGRAPHY */}
        {activeTab === 'content' && (
          <div className="flex flex-col gap-5">
            {/* Quick Variants for "Quy hoạch quá chậm" & "Ô nhiễm môi trường" */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Kiểu hiển thị chữ:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TEXT_VARIANTS.map((variant) => {
                  const isSelected =
                    config.topText === variant.topText && config.bottomText === variant.bottomText;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => {
                        onChangeConfig((prev) => ({
                          ...prev,
                          topText: variant.topText,
                          bottomText: variant.bottomText,
                          showBadge: false,
                        }));
                      }}
                      className={`p-3 rounded-xl text-left border transition flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/40'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-neutral-200">{variant.label}</span>
                      <div className="text-[11px] font-mono text-cyan-300/80 line-clamp-2 leading-relaxed bg-black/40 p-1.5 rounded">
                        <div>{variant.topText.replace('\n', ' ')}</div>
                        <div>{variant.bottomText.replace('\n', ' ')}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Edit Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Phần trên: QUY HOẠCH QUÁ CHẬM
                  </label>
                  <span className="text-[10px] text-neutral-500">Xuống dòng để ngắt hàng</span>
                </div>
                <textarea
                  id="input-top-text"
                  value={config.topText}
                  onChange={(e) => handleUpdate('topText', e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-900 border border-neutral-700/80 rounded-lg p-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-400 resize-none font-sans"
                  placeholder="QUY HOẠCH&#10;QUÁ CHẬM"
                />
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-neutral-400">Cỡ chữ:</span>
                  <input
                    type="range"
                    min="32"
                    max="76"
                    value={config.fontSizeTop}
                    onChange={(e) => handleUpdate('fontSizeTop', parseInt(e.target.value))}
                    className="flex-1 accent-cyan-400"
                  />
                  <span className="text-xs font-mono text-cyan-400 min-w-[32px]">{config.fontSizeTop}px</span>
                </div>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Phần dưới: Ô NHIỄM MÔI TRƯỜNG
                  </label>
                  <span className="text-[10px] text-neutral-500">Xuống dòng để ngắt hàng</span>
                </div>
                <textarea
                  id="input-bottom-text"
                  value={config.bottomText}
                  onChange={(e) => handleUpdate('bottomText', e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-900 border border-neutral-700/80 rounded-lg p-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-400 resize-none font-sans"
                  placeholder="VÀ Ô NHIỄM&#10;MÔI TRƯỜNG"
                />
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-neutral-400">Cỡ chữ:</span>
                  <input
                    type="range"
                    min="32"
                    max="76"
                    value={config.fontSizeBottom}
                    onChange={(e) => handleUpdate('fontSizeBottom', parseInt(e.target.value))}
                    className="flex-1 accent-cyan-400"
                  />
                  <span className="text-xs font-mono text-cyan-400 min-w-[32px]">{config.fontSizeBottom}px</span>
                </div>
              </div>
            </div>

            {/* Font Family Selection */}
            <div className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300">Phông Chữ Tiêu Đề Đồ Họa:</span>
              <div className="flex items-center gap-1.5">
                {(['Montserrat', 'Be Vietnam Pro', 'Plus Jakarta Sans'] as const).map((font) => (
                  <button
                    key={font}
                    onClick={() => handleUpdate('fontFamily', font)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      config.fontFamily === font
                        ? 'bg-cyan-500 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {font === 'Be Vietnam Pro' ? 'Vietnam Pro' : font}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WAVE PHYSICS & PARTICLES */}
        {activeTab === 'wave' && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Wave Speed & Amplitude */}
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Vật Lý Sóng Nước</h4>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Tốc độ cuộn sóng:</span>
                    <span className="font-mono text-cyan-400">{config.waveSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={config.waveSpeed}
                    onChange={(e) => handleUpdate('waveSpeed', parseFloat(e.target.value))}
                    className="accent-cyan-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Biên độ dao động sóng:</span>
                    <span className="font-mono text-cyan-400">{config.waveAmplitude}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="75"
                    step="2"
                    value={config.waveAmplitude}
                    onChange={(e) => handleUpdate('waveAmplitude', parseInt(e.target.value))}
                    className="accent-cyan-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Tần số ngọn sóng (độ gợn):</span>
                    <span className="font-mono text-cyan-400">{config.waveFrequency.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="2.4"
                    step="0.1"
                    value={config.waveFrequency}
                    onChange={(e) => handleUpdate('waveFrequency', parseFloat(e.target.value))}
                    className="accent-cyan-400"
                  />
                </div>
              </div>

              {/* Elevation & Layering */}
              <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Độ Cao & Lớp Chiều Sâu</h4>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Độ cao dâng của sóng (Mực nước):</span>
                    <span className="font-mono text-cyan-400">{Math.round(config.waveElevation * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.35"
                    max="0.68"
                    step="0.02"
                    value={config.waveElevation}
                    onChange={(e) => handleUpdate('waveElevation', parseFloat(e.target.value))}
                    className="accent-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Số lớp sóng 3D (Parallax):</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3].map((layers) => (
                      <button
                        key={layers}
                        onClick={() => handleUpdate('waveLayers', layers)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                          config.waveLayers === layers
                            ? 'bg-cyan-500 text-neutral-950'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {layers}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                  <span className="text-xs text-neutral-400">Viền gợn bọt sóng sáng:</span>
                  <input
                    type="checkbox"
                    checked={config.showWaveFoam}
                    onChange={(e) => handleUpdate('showWaveFoam', e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Particle Settings */}
            <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Hiệu Ứng Hạt Môi Trường:</span>
                <select
                  value={config.particleType}
                  onChange={(e) => handleUpdate('particleType', e.target.value as MotionConfig['particleType'])}
                  className="bg-neutral-900 border border-neutral-700 text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                >
                  <option value="bubbles_smog">Bọt Khí & Bụi Mịn (Môi Trường)</option>
                  <option value="smog_toxic">Khói Đen Bốc Lên (Ô Nhiễm)</option>
                  <option value="clean_breeze">Hạt Tinh Thể Sạch (Không Khí)</option>
                  <option value="none">Tắt Hạt</option>
                </select>
              </div>

              {config.particleType !== 'none' && (
                <div className="flex items-center gap-3 w-full sm:w-64">
                  <span className="text-xs text-neutral-400">Mật độ:</span>
                  <input
                    type="range"
                    min="15"
                    max="90"
                    value={config.particleDensity}
                    onChange={(e) => handleUpdate('particleDensity', parseInt(e.target.value))}
                    className="flex-1 accent-cyan-400"
                  />
                  <span className="text-xs font-mono text-cyan-400">{config.particleDensity}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: COLORS & PALETTES & ASPECT RATIO */}
        {activeTab === 'colors' && (
          <div className="flex flex-col gap-5">
            {/* Palette Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Bảng Màu Đồ Họa Động:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {COLOR_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    onClick={() => handleUpdate('paletteId', pal.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                      config.paletteId === pal.id
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{pal.name}</div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {pal.bottomBg} • {pal.waveBorder}
                      </div>
                    </div>
                    {/* Visual Color Preview Swatch */}
                    <div className="flex items-center -space-x-1">
                      <div className="w-5 h-5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: pal.topBg }} />
                      <div className="w-5 h-5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: pal.waveBorder }} />
                      <div className="w-5 h-5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: pal.bottomBg }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Presets */}
            <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 flex flex-col gap-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
                Tỉ Lệ Khung Hình Đồ Họa (Aspect Ratio):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { ratio: '2:1' as AspectRatioType, label: '2:1 (Bản Gốc Banner)', icon: '📐' },
                  { ratio: '16:9' as AspectRatioType, label: '16:9 (Video / YouTube)', icon: '📺' },
                  { ratio: '9:16' as AspectRatioType, label: '9:16 (Shorts / Reels)', icon: '📱' },
                  { ratio: '1:1' as AspectRatioType, label: '1:1 (Vuông Instagram)', icon: '⏹️' },
                ].map((item) => (
                  <button
                    key={item.ratio}
                    onClick={() => handleUpdate('aspectRatio', item.ratio)}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      config.aspectRatio === item.ratio
                        ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 font-bold'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXPORT SVG */}
        {activeTab === 'export' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Mã SVG Đồ Họa Động (CSS Keyframe Waves)
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Dễ dàng dán trực tiếp vào website hoặc trình duyệt không cần thư viện ngoài.
                </p>
              </div>

              <button
                id="btn-copy-svg-code"
                onClick={handleCopySvg}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>{copiedSvg ? '✓ Đã Sao Chép!' : 'Sao Chép Mã SVG'}</span>
              </button>
            </div>

            <pre className="w-full bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-56 select-all">
              {generateSvgCode()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
