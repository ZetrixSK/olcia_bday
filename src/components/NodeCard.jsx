export default function NodeCard({ node, status, onClick, index, dateString }) {
  const isClickable = status === 'available' || status === 'completed' || status === 'passkey-locked';
  const isLocked = status === 'locked' || status === 'passkey-locked' || status === 'date-locked';

  // Decorative icons for each part
  const partIcons = ['🎁', '✨', '🌸', '💫', '🎀', '🌙', '💝', '⭐'];
  const partIcon = partIcons[index % partIcons.length];

  const getInnerStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-linear-to-br from-[#2d252d] to-[#1f2d1f] text-[#b5d4b5]';
      case 'available':
        return 'bg-linear-to-br from-[#2d1f2d] to-[#3d2a3d] text-[#f5e6e8]';
      default:
        return 'bg-linear-to-br from-[#1a1118] to-[#2d1f2d] text-[#6b5a6b] opacity-70';
    }
  };

  return (
    <div className={`card-wrapper ${status === 'available' ? 'card-glow' : ''} ${status === 'completed' ? 'card-completed' : ''} ${isLocked ? 'card-locked' : ''}`}>
      <button
        onClick={onClick}
        disabled={!isClickable && status !== 'passkey-locked'}
        className={`
          relative w-full h-full p-6 md:p-8 rounded-2xl transition-all duration-300
          ${getInnerStyles()}
          ${isClickable ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-not-allowed'}
          group overflow-hidden
        `}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Shimmer overlay for available */}
        {status === 'available' && (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
            transition-opacity duration-500 pointer-events-none
            bg-linear-to-t from-[#ff6b9d]/20 via-transparent to-[#ffd93d]/10"
          />
        )}

        {/* Completed sparkle effect */}
        {status === 'completed' && (
          <div className="absolute top-3 right-3 text-lg">✨</div>
        )}

        <div className="flex flex-col items-center gap-4 relative z-10">
          {/* Icon */}
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center 
            ${status === 'completed' ? 'bg-[#1f2d1f]' : status === 'available' ? 'bg-[#3d2a3d]' : 'bg-[#2d1f2d]'}
            border-2 border-[#ffffff15]
            transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            {status === 'completed' ? (
              <span className="text-3xl md:text-4xl">✓</span>
            ) : isLocked ? (
              <svg className="w-8 h-8 md:w-10 md:h-10 text-[#4a3a4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            ) : (
              <span className="text-3xl md:text-4xl">{partIcon}</span>
            )}
          </div>

          {/* Label */}
          <span className={`text-base md:text-lg font-semibold tracking-wide
            transition-colors duration-300`}
          >
            {node.label}
          </span>

          {/* Date lock indicator */}
          {status === 'date-locked' && dateString && (
            <span className="text-sm text-[#d4a5b5]/80 flex items-center gap-2">
              <span>🗓️</span> {dateString}
            </span>
          )}

          {/* Passkey lock indicator */}
          {status === 'passkey-locked' && (
            <span className="text-sm text-[#d4a5b5]/80 flex items-center gap-2">
              <span>🔑</span> Needs key
            </span>
          )}

          {/* Locked indicator */}
          {status === 'locked' && (
            <span className="text-sm text-[#6b5a6b]">
              Locked
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
