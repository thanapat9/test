export default function StreakDisplay({ streak, longestStreak, totalDays }) {
  const flames = Math.min(streak, 7)

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className="relative">
        <div
          className="text-8xl select-none"
          style={{
            filter: streak > 0
              ? `drop-shadow(0 0 ${Math.min(streak * 4, 32)}px #ff6b00) drop-shadow(0 0 ${Math.min(streak * 2, 16)}px #ffb800)`
              : 'grayscale(1) brightness(0.4)',
            transition: 'filter 0.5s ease',
          }}
        >
          🔥
        </div>
        {streak > 0 && (
          <div className="absolute -top-1 -right-3 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            {streak > 99 ? '99+' : streak}
          </div>
        )}
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold text-orange-400">
          {streak} <span className="text-2xl text-orange-300">day{streak !== 1 ? 's' : ''}</span>
        </div>
        <div className="text-sm text-gray-400 mt-1">current streak</div>
      </div>

      <div className="flex gap-1 mt-2">
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < flames ? 'bg-orange-400 scale-110' : 'bg-gray-700'
            }`}
            style={{
              boxShadow: i < flames ? '0 0 6px #f97316' : 'none',
            }}
          />
        ))}
      </div>

      <div className="flex gap-6 mt-3 text-center">
        <div>
          <div className="text-xl font-semibold text-purple-400">{longestStreak}</div>
          <div className="text-xs text-gray-500">longest streak</div>
        </div>
        <div className="w-px bg-gray-700" />
        <div>
          <div className="text-xl font-semibold text-blue-400">{totalDays}</div>
          <div className="text-xs text-gray-500">total days</div>
        </div>
      </div>
    </div>
  )
}
