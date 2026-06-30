import { useState } from 'react'

export default function HabitCard({ icon, title, subtitle, done, onToggle, note, onNoteChange, showNote = false }) {
  const [expanded, setExpanded] = useState(false)
  const [localNote, setLocalNote] = useState(note || '')

  function handleToggle() {
    onToggle(localNote)
  }

  function handleNoteSubmit(e) {
    e.preventDefault()
    onNoteChange?.(localNote)
    setExpanded(false)
  }

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        done
          ? 'border-green-500/40 bg-green-950/30'
          : 'border-gray-700/60 bg-gray-900/50'
      }`}
    >
      <div className="flex items-center gap-4 p-5">
        <div
          className={`text-4xl transition-all duration-300 ${done ? '' : 'grayscale opacity-60'}`}
        >
          {icon}
        </div>

        <div className="flex-1 text-left">
          <div className="font-semibold text-lg text-gray-100">{title}</div>
          <div className="text-sm text-gray-400">{subtitle}</div>
          {done && note && (
            <div className="text-xs text-green-400 mt-1 italic">"{note}"</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showNote && done && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-gray-300 text-xl transition-colors"
            >
              ✏️
            </button>
          )}
          <button
            onClick={handleToggle}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all duration-300 active:scale-90 ${
              done
                ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/30'
                : 'border-gray-600 bg-transparent text-gray-600 hover:border-gray-400'
            }`}
          >
            {done ? '✓' : ''}
          </button>
        </div>
      </div>

      {showNote && expanded && (
        <form onSubmit={handleNoteSubmit} className="px-5 pb-4 border-t border-gray-800/50">
          <div className="pt-3 text-sm text-gray-400 mb-2">วันนี้เรียนอะไร?</div>
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={localNote}
              onChange={e => setLocalNote(e.target.value)}
              placeholder="เช่น Chapter 3: dbt models, SQL window functions..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-4 py-2 text-sm transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {showNote && !expanded && !done && (
        <div className="px-5 pb-4">
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            + เพิ่มโน้ตว่าวันนี้เรียนอะไร
          </button>
        </div>
      )}
    </div>
  )
}
