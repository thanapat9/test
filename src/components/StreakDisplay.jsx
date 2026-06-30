export default function StreakDisplay({ streak, longestStreak, totalDays }) {
  return (
    <div className="flex flex-col items-center gap-1 py-8">
      <div
        className="text-[80px] font-black leading-none tracking-tighter transition-all duration-500"
        style={{ color: streak > 0 ? 'var(--accent)' : 'var(--text-3)' }}
      >
        {streak}
      </div>
      <div className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--text-3)' }}>
        day streak
      </div>

      <div className="flex gap-1.5 mt-4">
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i < Math.min(streak, 7) ? 'var(--accent)' : 'var(--border)',
              boxShadow: i < Math.min(streak, 7) ? '0 0 6px var(--accent)' : 'none',
            }}
          />
        ))}
      </div>

      <div className="flex gap-10 mt-6 text-center">
        <div>
          <div className="text-xl font-bold" style={{ color: 'var(--text)' }}>{longestStreak}</div>
          <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-3)' }}>best</div>
        </div>
        <div className="w-px" style={{ background: 'var(--border)' }} />
        <div>
          <div className="text-xl font-bold" style={{ color: 'var(--text)' }}>{totalDays}</div>
          <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-3)' }}>total</div>
        </div>
      </div>
    </div>
  )
}
