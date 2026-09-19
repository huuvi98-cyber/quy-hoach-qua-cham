import React from 'react';

interface OriginalComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalComparisonModal: React.FC<OriginalComparisonModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <span className="text-base">🖼️</span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Bản Gốc Tĩnh & Bản Đồ Họa Động
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex flex-col items-center">
            <span className="text-xs font-semibold text-neutral-400 mb-2">Ảnh Tĩnh Gốc do người dùng cung cấp:</span>
            {/* Embedded original reference graphic */}
            <div className="w-full max-w-xl aspect-[2/1] relative overflow-hidden rounded-lg shadow-md border border-neutral-700/50 bg-[#012E3B]">
              <svg viewBox="0 0 1200 600" className="w-full h-full">
                {/* White Top Background */}
                <rect width="1200" height="600" fill="#FFFFFF" />
                {/* Dark teal bottom wave */}
                <path
                  d="M0,330 C200,340 380,310 600,230 C800,160 980,210 1200,220 L1200,600 L0,600 Z"
                  fill="#012E3B"
                />
                {/* Light Cyan Wave Border */}
                <path
                  d="M0,330 C200,340 380,310 600,230 C800,160 980,210 1200,220"
                  fill="none"
                  stroke="#80DEEA"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Top Text */}
                <text
                  x="140"
                  y="180"
                  fontFamily="Montserrat, sans-serif"
                  fontWeight="900"
                  fontSize="78"
                  fill="#0B566F"
                >
                  QUY HOẠCH
                </text>
                <text
                  x="140"
                  y="265"
                  fontFamily="Montserrat, sans-serif"
                  fontWeight="900"
                  fontSize="78"
                  fill="#0B566F"
                >
                  QUÁ CHẬM
                </text>
                {/* Bottom Text */}
                <text
                  x="580"
                  y="360"
                  fontFamily="Montserrat, sans-serif"
                  fontWeight="900"
                  fontSize="70"
                  fill="#FFFFFF"
                >
                  VÀ Ô NHIỄM
                </text>
                <text
                  x="580"
                  y="460"
                  fontFamily="Montserrat, sans-serif"
                  fontWeight="900"
                  fontSize="70"
                  fill="#FFFFFF"
                >
                  MÔI TRƯỜNG
                </text>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
            <div className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800">
              <h4 className="font-bold text-cyan-400 mb-1">✨ Các cải tiến chuyển động:</h4>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>Sóng nước cuộn 3 lớp mượt mà tốc độ 60 FPS.</li>
                <li>Hạt bọt khí nổi lên và vỡ khi chạm mặt nước.</li>
                <li>Khói bụi ô nhiễm mô phỏng tình trạng môi trường.</li>
                <li>Chữ động (Kinetic Typography) xuất hiện nhịp điệu.</li>
              </ul>
            </div>
            <div className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800">
              <h4 className="font-bold text-cyan-400 mb-1">🎛️ Tính năng chuyên nghiệp:</h4>
              <ul className="list-disc list-inside space-y-1 text-neutral-400">
                <li>Tương tác bằng con trỏ chuột đẩy sóng nước.</li>
                <li>Ghi và xuất video WebM chất lượng cao vòng lặp 6s.</li>
                <li>Đầy đủ tỷ lệ 2:1, 16:9, 9:16 (Shorts/TikTok), 1:1.</li>
                <li>Âm thanh hiệu ứng thời sự được tổng hợp trực tiếp.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
