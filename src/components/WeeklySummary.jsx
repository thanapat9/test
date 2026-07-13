import { useState } from 'react'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MUSCLES = ['Chest', 'Shoulder', 'Back', 'Leg', 'Arm', 'Abs']

function getWeekDates(offset = 0) {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1) + offset * 7)
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

export default function WeeklySummary({ habits, logs, onToggleDate }) {
  const today = new Date().toISOString().split('T')[0]
  const [weekOffset, setWeekOffset] = useState(0)
  const [musclePicker, setMusclePicker] = useState(null) // { habitId, dateStr }
  const [selected, setSelected] = useState([])

  const weekDates = getWeekDates(weekOffset)
  const isCurrentWeek = weekOffset === 0

  const pastDates = weekDates.filter(d => d <= today)
  const possible = habits.length * pastDates.length
  const done = pastDates.reduce((sum, d) =>
    sum + habits.filter(h => logs[d]?.[h.id]?.done).length, 0)
  const pct = possible > 0 ? Math.round((done / possible) * 100) : 0

  const workoutDays = weekDates.filter(d => logs[d]?.workout?.done)
  const weekNotes = weekDates.filter(d => logs[d]?.course?.note)

  function handleCellTap(habit, dateStr) {
    if (!onToggleDate || dateStr > today) return
    if (habit.isPPL && !logs[dateStr]?.[habit.id]?.done) {
      setSelected([])
      setMusclePicker({ habitId: habit.id, dateStr })
    } else {
      onToggleDate(habit.id, dateStr)
    }
  }

  function confirmMuscles() {
    if (!musclePicker || selected.length === 0) return
    onToggleDate(musclePicker.habitId, musclePicker.dateStr, { muscles: selected })
    setMusclePicker(null)
  }

  return (
    <div className="space-y-4">
      {/* Muscle picker overlay */}
      {musclePicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          onClick={() => setMusclePicker(null)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl p-5 pb-10"
            style={{ background: 'var(--surface)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-[10px] uppercase tracking-widest mb-1 text-center" style={{ color: 'var(--text-3)' }}>
              {new Date(musclePicker.dateStr + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'short' })}
            </div>
            <div className="text-sm font-semibold mb-4 text-center" style={{ color: 'var(--text)' }}>
              Which muscles?
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {MUSCLES.map(m => {
                const on = selected.includes(m)
                return (
                  <button
                    key={m}
                    onClick={() => setSelected(s => on ? s.filter(x => x !== m) : [...s, m])}
                    className="py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
                    style={{
                      background: on ? 'var(--accent)' : 'var(--surface-raised)',
                      color: on ? 'white' : 'var(--text)',
                    }}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
            <button
              onClick={confirmMuscles}
              disabled={selected.length === 0}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{
                background: selected.length > 0 ? 'var(--accent)' : 'var(--surface-raised)',
                color: selected.length > 0 ? 'white' : 'var(--text-3)',
              }}
            >
              Done {selected.length > 0 ? `· ${selected.length} selected` : ''}
            </button>
          </div>
        </div>
      )}

      {/* Weekly score */}
      <div
        className="rounded-xl border p-5"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Week navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset(o => o - 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all active:scale-90"
            style={{ background: 'var(--surface-raised)', color: 'var(--text-2)' }}
          >
            ‹
          </button>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
            {isCurrentWeek ? 'This week' : formatRange(weekDates)}
          </div>
          <button
            onClick={() => setWeekOffset(o => o + 1)}
            disabled={isCurrentWeek}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all active:scale-90"
            style={{
              background: 'var(--surface-raised)',
              color: isCurrentWeek ? 'var(--border)' : 'var(--text-2)',
              cursor: isCurrentWeek ? 'default' : 'pointer',
            }}
          >
            ›
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-black" style={{ color: pct === 100 ? 'var(--accent)' : 'var(--text)' }}>
              {pct}<span className="text-xl font-semibold" style={{ color: 'var(--text-2)' }}>%</span>
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
              {done} of {possible} completed
            </div>
          </div>

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
            style={{ borderTop: idx > 0 ? '1px solid var(--border)' : 'none' }}
          >
            <div className="text-xs font-medium truncate pr-2" style={{ color: 'var(--text)' }}>
              {habit.name.split(' ')[0]}
            </div>
            {weekDates.map(dateStr => {
              const isDone = logs[dateStr]?.[habit.id]?.done
              const isToday = dateStr === today
              const isFuture = dateStr > today
              const isPast = dateStr < today
              const isRetro = logs[dateStr]?.[habit.id]?.retroactive
              return (
                <div
                  key={dateStr}
                  onClick={() => handleCellTap(habit, dateStr)}
                  className="w-6 h-6 rounded-md mx-auto flex items-center justify-center text-[10px] font-bold transition-all active:scale-90"
                  style={{
                    background: isDone ? 'var(--accent)' : isFuture ? 'transparent' : 'var(--surface-raised)',
                    color: isDone ? 'var(--bg)' : 'var(--text-3)',
                    outline: isToday ? '1px solid var(--accent)' : 'none',
                    outlineOffset: '1px',
                    opacity: isFuture ? 0.3 : 1,
                    cursor: isFuture ? 'default' : 'pointer',
                  }}
                >
                  {isDone ? (isRetro && isPast ? '·' : '✓') : ''}
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
          <div className="space-y-2">
            {workoutDays.map(d => {
              const muscles = logs[d]?.workout?.muscles || []
              const label = new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', day: 'numeric' })
              return (
                <div key={d} className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] w-10 shrink-0" style={{ color: 'var(--text-3)' }}>{label}</span>
                  {muscles.map(m => (
                    <div
                      key={m}
                      className="text-xs px-2 py-0.5 rounded-md font-medium"
                      style={{
                        background: 'var(--accent-dim)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(249,115,22,0.2)',
                      }}
                    >
                      {m}
                    </div>
                  ))}
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
