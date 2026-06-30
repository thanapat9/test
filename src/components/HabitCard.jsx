import { useState } from 'react'

export default function HabitCard({ habit, logEntry, todayPPL, onToggle, onNote }) {
  const [showNote, setShowNote] = useState(false)
  const [noteInput, setNoteInput] = useState(logEntry?.note || '')

  const done = logEntry?.done || false
  const subtitle = habit.isPPL
    ? (done ? `${logEntry?.type} · completed` : `${todayPPL} day`)
    : habit.description

  function handleToggle() {
    onToggle(habit.id, habit.isPPL ? { type: todayPPL } : {})
  }

  function handleNoteSubmit(e) {
    e.preventDefault()
    onNote(habit.id, noteInput)
    setShowNote(false)
  }

  return (
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
  )
}
