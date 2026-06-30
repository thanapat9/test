import { useState } from 'react'

export default function HabitManager({ habits, onAdd, onRemove }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [adding, setAdding] = useState(false)

  function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), desc.trim())
    setName('')
    setDesc('')
    setAdding(false)
  }

  return (
    <div className="space-y-3">
      <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
        Habits
      </div>

      <div
        className="rounded-xl border divide-y overflow-hidden"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {habits.map(habit => (
          <div
            key={habit.id}
            className="flex items-center justify-between px-4 py-3.5"
            style={{ borderColor: 'var(--border)' }}
          >
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{habit.name}</div>
              {habit.description && (
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{habit.description}</div>
              )}
            </div>
            {habit.deletable ? (
              <button
                onClick={() => onRemove(habit.id)}
                className="text-xs px-2.5 py-1 rounded-md transition-colors hover:text-red-400"
                style={{ color: 'var(--text-3)', background: 'var(--surface-raised)' }}
              >
                remove
              </button>
            ) : (
              <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
                default
              </span>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <form
          onSubmit={handleAdd}
          className="rounded-xl border p-4 space-y-3"
          style={{ background: 'var(--surface)', borderColor: 'rgba(139,92,246,0.3)' }}
        >
          <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            New habit
          </div>
          {['Habit name', 'Description (optional)'].map((ph, i) => (
            <input
              key={ph}
              autoFocus={i === 0}
              type="text"
              value={i === 0 ? name : desc}
              onChange={e => i === 0 ? setName(e.target.value) : setDesc(e.target.value)}
              placeholder={ph}
              className="w-full text-sm px-3 py-2.5 rounded-lg border transition-colors"
              style={{
                background: 'var(--surface-raised)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          ))}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setName(''); setDesc('') }}
              className="px-4 py-2.5 rounded-lg text-sm transition-colors"
              style={{ background: 'var(--surface-raised)', color: 'var(--text-2)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-3 rounded-xl border text-sm transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
          style={{
            background: 'transparent',
            borderColor: 'var(--border)',
            borderStyle: 'dashed',
            color: 'var(--text-3)',
          }}
        >
          + Add habit
        </button>
      )}

      <div className="text-[11px] text-center" style={{ color: 'var(--text-3)' }}>
        Default habits cannot be removed
      </div>
    </div>
  )
}
