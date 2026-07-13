import { useState } from 'react'

const MUSCLES = ['Chest', 'Shoulder', 'Back', 'Leg', 'Arm', 'Abs']

export default function HabitCard({ habit, logEntry, onToggle, onNote }) {
  const [showNote, setShowNote] = useState(false)
  const [noteInput, setNoteInput] = useState(logEntry?.note || '')
  const [showMusclePicker, setShowMusclePicker] = useState(false)
  const [selected, setSelected] = useState([])

  const done = logEntry?.done || false
  const muscles = logEntry?.muscles || []

  const subtitle = habit.isPPL
    ? (done && muscles.length > 0 ? muscles.join(' · ') : 'Pick muscle groups')
    : habit.description

  function handleToggle() {
    if (habit.isPPL) {
      if (done) {
        onToggle(habit.id)
      } else {
        setSelected([])
        setShowMusclePicker(true)
      }
    } else {
      onToggle(habit.id)
    }
  }

  function confirmMuscles() {
    if (selected.length === 0) return
    onToggle(habit.id, { muscles: selected })
    setShowMusclePicker(false)
  }

  function handleNoteSubmit(e) {
    e.preventDefault()
    onNote(habit.id, noteInput)
    setShowNote(false)
  }

  return (
    <>
      {/* Muscle picker overlay */}
      {showMusclePicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          onClick={() => setShowMusclePicker(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl p-5 pb-10"
            style={{ background: 'var(--surface)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-sm font-semibold mb-4 text-center" style={{ color: 'var(--text)' }}>
              Today's workout
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

      <div
        className="rounded-xl border transition-all duration-200"
        style={{
          background: done ? 'rgba(249,115,22,0.07)' : 'var(--surface)',
          borderColor: done ? 'rgba(249,115,22,0.35)' : 'var(--border)',
        }}
      >
        <div className="flex items-center gap-4 px-4 py-4">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {habit.name}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: done && habit.isPPL ? 'var(--accent)' : 'var(--text-3)' }}
            >
              {subtitle}
            </div>
            {done && logEntry?.note && (
              <div className="text-xs mt-1.5 italic truncate" style={{ color: 'var(--text-2)' }}>
                {logEntry.note}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {habit.hasNote && (
              <button
                onClick={() => setShowNote(s => !s)}
                className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md transition-colors"
                style={{ color: showNote ? 'var(--accent)' : 'var(--text-3)' }}
              >
                note
              </button>
            )}
            <button
              onClick={handleToggle}
              className="w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 active:scale-90"
              style={{
                borderColor: done ? 'var(--accent)' : 'var(--border)',
                background: done ? 'var(--accent)' : 'transparent',
                color: done ? 'var(--bg)' : 'var(--text-3)',
              }}
            >
              {done ? '✓' : ''}
            </button>
          </div>
        </div>

        {habit.hasNote && showNote && (
          <form
            onSubmit={handleNoteSubmit}
            className="px-4 pb-4 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="pt-3 flex gap-2">
              <input
                autoFocus
                type="text"
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                placeholder="วันนี้เรียนอะไร..."
                className="flex-1 text-xs px-3 py-2 rounded-lg border transition-colors"
                style={{
                  background: 'var(--surface-raised)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              <button
                type="submit"
                className="text-xs px-3 py-2 rounded-lg font-medium transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent)', color: 'var(--bg)' }}
              >
                save
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
