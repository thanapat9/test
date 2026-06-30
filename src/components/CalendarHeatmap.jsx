function getLastNDays(n) {
  const days = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

function getDayLevel(log) {
  if (!log) return 0
  const course = log.course?.done ? 1 : 0
  const workout = log.workout?.done ? 1 : 0
  return course + workout // 0, 1, or 2
}

const LEVEL_COLORS = [
  'bg-gray-800',
  'bg-green-700',
  'bg-green-400',
]

const LEVEL_GLOW = [
  '',
  '',
  'shadow-[0_0_6px_#4ade80]',
]

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function CalendarHeatmap({ logs }) {
  const days = getLastNDays(7 * 14) // 14 weeks
  const today = new Date().toISOString().split('T')[0]

  // Pad to start on Sunday
  const firstDate = new Date(days[0])
  const startPad = firstDate.getDay() // 0=Sun
  const paddedDays = [...Array(startPad).fill(null), ...days]

  // Fill into weeks
  const weeks = []
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7))
  }

  return (
    <div className="rounded-2xl border border-gray-700/60 bg-gray-900/50 p-5">
      <div className="text-sm font-semibold text-gray-400 mb-4 text-left">Activity — last 14 weeks</div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {/* Day labels column */}
        <div className="flex flex-col gap-1.5 mt-0 pr-1">
          {WEEKDAYS.map((d, i) => (
            <div
              key={i}
              className={`text-xs text-gray-600 h-4 flex items-center ${i % 2 === 0 ? 'opacity-0' : ''}`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((dateStr, di) => {
              if (!dateStr) {
                return <div key={di} className="w-4 h-4" />
              }
              const level = getDayLevel(logs[dateStr])
              const isToday = dateStr === today
              const log = logs[dateStr]
              const tooltip = dateStr + (log?.course?.done ? ' | 📚' : '') + (log?.workout?.done ? ` | 💪${log.workout.type || ''}` : '')

              return (
                <div
                  key={di}
                  title={tooltip}
                  className={`w-4 h-4 rounded-sm transition-all duration-200 cursor-default ${LEVEL_COLORS[level]} ${LEVEL_GLOW[level]} ${
                    isToday ? 'ring-1 ring-purple-400 ring-offset-1 ring-offset-gray-900' : ''
                  }`}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs text-gray-600">Less</span>
        {LEVEL_COLORS.map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="text-xs text-gray-600">More</span>
      </div>
    </div>
  )
}
