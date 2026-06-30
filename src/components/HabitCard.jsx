import { useState } from 'react'

export default function HabitCard({ habit, logEntry, todayPPL, onToggle, onNote }) {
  const [showNote, setShowNote] = useState(false)
  const [noteInput, setNoteInput] = useState(logEntry?.note || '')

  const done = logEntry?.done || false
  const subtitle = habit.isPPL
    ? (done ? `${logEntry?.type} day — done` : `${todayPPL} day`)
    : habit.description

  function handleToggle() {
    const extra = habit.isPPL ? { type: todayPPL } : {}
    onToggle(habit.id, extra)
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
        background: done ? '#110e00' : '#111',
        borderColor: done ? '#f9731640' : '#1e1e1e',
      }}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#f0ede8] text-sm">{habit.name}</div>
          <div
            className="text-xs mt-0.5"
            style={{ color: done && habit.isPPL ? '#f97316' : '#555' }}
          >
            {subtitle}
          </div>
          {done && logEntry?.note && (
            <div className="text-xs text-[#666] mt-1.5 italic truncate">
              {logEntry.note}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {habit.hasNote && (
            <button
              onClick={() => setShowNote(s => !s)}
              className="text-[10px] text-[#444] uppercase tracking-wider hover:text-[#888] transition-colors px-2 py-1"
            >
              note
            </button>
          )}
          <button
            onClick={handleToggle}
            className="w-9 h-9 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-all duration-200 active:scale-90"
            style={{
              borderColor: done ? '#f97316' : '#2a2a2a',
              background: done ? '#f97316' : 'transparent',
              color: done ? '#0a0a0a' : '#333',
            }}
          >
            {done ? '✓' : ''}
          </button>
        </div>
      </div>

      {habit.hasNote && showNote && (
        <form
          onSubmit={handleNoteSubmit}
          className="px-5 pb-4 border-t"
          style={{ borderColor: '#1a1a1a' }}
        >
          <div className="pt-3 flex gap-2">
            <input
              autoFocus
              type="text"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="วันนี้เรียนอะไร..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border text-[#f0ede8] placeholder-[#333]"
              style={{ background: '#0f0f0f', borderColor: '#2a2a2a' }}
              onFocus={e => (e.target.style.borderColor = '#f97316')}
              onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            />
            <button
              type="submit"
              className="text-xs px-3 py-2 rounded-lg font-medium transition-colors"
              style={{ background: '#f97316', color: '#0a0a0a' }}
            >
              save
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
