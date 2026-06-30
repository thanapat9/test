export default function StreakDisplay({ streak, longestStreak, totalDays }) {
  return (
    <div className="flex flex-col items-center gap-1 py-8">
      <div
        className="text-[80px] font-black leading-none tracking-tighter"
        style={{ color: streak > 0 ? '#f97316' : '#333' }}
      >
        {streak}
      </div>
      <div className="text-xs text-[#555] uppercase tracking-[0.2em] font-medium mt-1">
        day streak
      </div>

      <div className="flex gap-1.5 mt-4">
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: i < Math.min(streak, 7) ? '#f97316' : '#1e1e1e' }}
          />
        ))}
      </div>

      <div className="flex gap-10 mt-5 text-center">
        <div>
          <div className="text-xl font-bold text-[#f0ede8]">{longestStreak}</div>
          <div className="text-[10px] text-[#444] uppercase tracking-widest mt-0.5">best</div>
        </div>
        <div className="w-px bg-[#1e1e1e]" />
        <div>
          <div className="text-xl font-bold text-[#f0ede8]">{totalDays}</div>
          <div className="text-[10px] text-[#444] uppercase tracking-widest mt-0.5">total</div>
        </div>
      </div>
    </div>
  )
}
