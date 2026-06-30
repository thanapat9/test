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

function formatRange(dates) {
  const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('en', { day: 'numeric', month: 'short' })
  return `${fmt(dates[0])} – ${fmt(dates[6])}`
}

export default function WeeklySummary({ habits, logs }) {
  const weekDates = getWeekDates()
  const today = new Date().toISOString().split('T')[0]

  const pastDates = weekDates.filter(d => d <= today)
  const possible = habits.length * pastDates.length
  const done = pastDates.reduce((sum, d) =>
    sum + habits.filter(h => logs[d]?.[h.id]?.done).length, 0)
  const pct = possible > 0 ? Math.round((done / possible) * 100) : 0

  const workoutDays = weekDates.filter(d => logs[d]?.workout?.done)
  const weekNotes = weekDates.filter(d => logs[d]?.course?.note)

  return (
    <div className="space-y-4">
      {/* Weekly score */}
      <div
        className="rounded-xl border p-5 flex items-center justify-between"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-3)' }}>
            {formatRange(weekDates)}
          </div>
          <div className="text-4xl font-black" style={{ color: pct === 100 ? 'var(--accent)' : 'var(--text)' }}>
            {pct}<span className="text-xl font-semibold" style={{ color: 'var(--text-2)' }}>%</span>
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
            {done} of {possible} completed
          </div>
        </div>

        {/* Per-habit mini scores */}
        <div className="space-y-2 text-right">
          {habits.map(h => {
            const cnt = pastDates.filter(d => logs[d]?.[h.id]?.done).length
            const total = pastDates.length
            return (
              <div key={h.id}>
                <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>{h.name.split(' ')[0]}</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {cnt}<span style={{ color: 'var(--text-3)' }}>/{total}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Per-habit grid */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div
          className="grid grid-cols-[1fr_repeat(7,28px)] gap-1 px-4 py-2.5 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div />
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-[10px] uppercase" style={{ color: 'var(--text-3)' }}>{d}</div>
          ))}
        </div>

        {habits.map((habit, idx) => (
          <div
            key={habit.id}
            className="grid grid-cols-[1fr_repeat(7,28px)] gap-1 items-center px-4 py-3"
            style={{
              borderTop: idx > 0 ? `1px solid var(--border)` : 'none',
            }}
          >
            <div className="text-xs font-medium truncate pr-2" style={{ color: 'var(--text)' }}>
              {habit.name.split(' ')[0]}
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
                    background: isDone ? 'var(--accent)' : isFuture ? 'transparent' : 'var(--surface-raised)',
                    color: isDone ? 'var(--bg)' : 'var(--text-3)',
                    outline: isToday ? '1px solid var(--accent)' : 'none',
                    outlineOffset: '1px',
                    opacity: isFuture ? 0.3 : 1,
                  }}
                >
                  {isDone ? '✓' : ''}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Workout breakdown */}
      {workoutDays.length > 0 && (
        <div
          className="rounded-xl border p-4"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
            Workout this week
          </div>
          <div className="flex gap-2 flex-wrap">
            {workoutDays.map(d => {
              const type = logs[d]?.workout?.type
              return (
                <div
                  key={d}
                  className="text-xs px-2.5 py-1 rounded-md font-medium"
                  style={{
                    background: 'var(--accent-dim)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(139,92,246,0.2)',
                  }}
                >
                  {type}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Course notes */}
      {weekNotes.length > 0 && (
        <div
          className="rounded-xl border p-4"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
            Notes this week
          </div>
          <div className="space-y-3">
            {weekNotes.map(d => (
              <div key={d}>
                <div className="text-[10px] mb-0.5" style={{ color: 'var(--text-3)' }}>
                  {new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                <div className="text-xs italic" style={{ color: 'var(--text-2)' }}>
                  "{logs[d].course.note}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {done === 0 && (
        <div className="text-center text-xs py-6" style={{ color: 'var(--text-3)' }}>
          No activity this week yet
        </div>
      )}
    </div>
  )
}
