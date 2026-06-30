const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekDates() {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

function formatWeekRange(dates) {
  const start = new Date(dates[0] + 'T00:00:00')
  const end = new Date(dates[6] + 'T00:00:00')
  const opts = { day: 'numeric', month: 'short' }
  return `${start.toLocaleDateString('en', opts)} – ${end.toLocaleDateString('en', opts)}`
}

export default function WeeklySummary({ habits, logs }) {
  const weekDates = getWeekDates()
  const today = new Date().toISOString().split('T')[0]

  const weekNotes = weekDates
    .filter(d => logs[d]?.course?.note)
    .map(d => ({ date: d, note: logs[d].course.note }))

  const workoutDays = weekDates
    .filter(d => logs[d]?.workout?.done)
    .map(d => ({ date: d, type: logs[d].workout.type }))

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] text-[#444] uppercase tracking-widest">This week</div>
        <div className="text-xs text-[#555]">{formatWeekRange(weekDates)}</div>
      </div>

      {/* Per-habit grid */}
      <div className="rounded-xl border" style={{ background: '#111', borderColor: '#1e1e1e' }}>
        {/* Day header */}
        <div className="grid grid-cols-[1fr_repeat(7,28px)] gap-1 px-4 pt-3 pb-2 border-b" style={{ borderColor: '#1a1a1a' }}>
          <div />
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-[10px] text-[#444] uppercase">{d}</div>
          ))}
        </div>

        {habits.map(habit => {
          const done = weekDates.filter(d => logs[d]?.[habit.id]?.done).length
          return (
            <div
              key={habit.id}
              className="grid grid-cols-[1fr_repeat(7,28px)] gap-1 items-center px-4 py-3 border-b last:border-0"
              style={{ borderColor: '#1a1a1a' }}
            >
              <div>
                <div className="text-xs text-[#f0ede8] font-medium truncate pr-2">{habit.name}</div>
                <div className="text-[10px] text-[#444] mt-0.5">{done}/7</div>
              </div>
              {weekDates.map(dateStr => {
                const isDone = logs[dateStr]?.[habit.id]?.done
                const isToday = dateStr === today
                const isFuture = dateStr > today
                return (
                  <div
                    key={dateStr}
                    className="w-6 h-6 rounded-md mx-auto flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: isDone ? '#f97316' : isFuture ? 'transparent' : '#1a1a1a',
                      color: isDone ? '#0a0a0a' : '#444',
                      outline: isToday ? '1px solid #f9731640' : 'none',
                      outlineOffset: '1px',
                    }}
                  >
                    {isDone ? '✓' : ''}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Workout breakdown */}
      {workoutDays.length > 0 && (
        <div className="rounded-xl border p-4" style={{ background: '#111', borderColor: '#1e1e1e' }}>
          <div className="text-[10px] text-[#444] uppercase tracking-widest mb-3">Workout this week</div>
          <div className="flex gap-2 flex-wrap">
            {workoutDays.map(({ date, type }) => (
              <div
                key={date}
                className="text-xs px-2.5 py-1 rounded-md font-medium"
                style={{
                  background: type === 'Push' ? '#3b0a0a' : type === 'Pull' ? '#0a1a3b' : '#1a0a3b',
                  color: type === 'Push' ? '#f97316' : type === 'Pull' ? '#60a5fa' : '#a78bfa',
                }}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course notes */}
      {weekNotes.length > 0 && (
        <div className="rounded-xl border p-4" style={{ background: '#111', borderColor: '#1e1e1e' }}>
          <div className="text-[10px] text-[#444] uppercase tracking-widest mb-3">Notes this week</div>
          <div className="space-y-2.5">
            {weekNotes.map(({ date, note }) => (
              <div key={date}>
                <div className="text-[10px] text-[#444] mb-0.5">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                <div className="text-xs text-[#888] italic">"{note}"</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {workoutDays.length === 0 && weekNotes.length === 0 && (
        <div className="text-center text-xs text-[#333] py-6">
          No activity this week yet
        </div>
      )}
    </div>
  )
}
