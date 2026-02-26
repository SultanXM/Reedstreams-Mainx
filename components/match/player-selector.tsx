"use client";

import { PlayerType } from "@/hooks/usePlayerPreference";

interface PlayerSelectorProps {
  compact?: boolean;
  selected?: PlayerType;
  onSelect?: (player: PlayerType) => void;
}

const playerOptions: { value: PlayerType; label: string }[] = [
  { value: "hls", label: "HLS.js" },
  { value: "videojs", label: "Video.js" },
  { value: "shaka", label: "Shaka" },
];

export default function PlayerSelector({ 
  compact = false, 
  selected = "hls", 
  onSelect 
}: PlayerSelectorProps) {
  const handleClick = (value: PlayerType) => {
    onSelect?.(value);
  };

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {playerOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleClick(option.value)}
            style={{
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 0,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: selected === option.value ? '#222' : 'transparent',
              color: selected === option.value ? '#fff' : '#666',
            }}
            onMouseEnter={(e) => {
              if (selected !== option.value) {
                e.currentTarget.style.background = '#1a1a1a';
                e.currentTarget.style.color = '#999';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== option.value) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#666';
              }
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ background: '#111', borderRadius: 0, padding: 12 }}>
      <div style={{ fontSize: 10, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Select Player</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {playerOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleClick(option.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              fontSize: 13,
              borderRadius: 0,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: selected === option.value ? '#222' : 'transparent',
              color: selected === option.value ? '#fff' : '#888',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              if (selected !== option.value) {
                e.currentTarget.style.background = '#1a1a1a';
                e.currentTarget.style.color = '#aaa';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== option.value) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#888';
              }
            }}
          >
            <span>{option.label}</span>
            {selected === option.value && (
              <span style={{ fontSize: 9, color: '#444' }}>Active</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
