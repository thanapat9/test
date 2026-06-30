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
    <div className="space-y-4">
      <div className="text-[10px] text-[#444] uppercase tracking-widest">Habits</div>

      {/* Habit list */}
      <div className="rounded-xl border divide-y" style={{ background: '#111', borderColor: '#1e1e1e', '--tw-divide-opacity': 1 }}>
        {habits.map(habit => (
          <div key={habit.id} className="flex items-center justify-between px-4 py-3.5" style={{ borderColor: '#1a1a1a' }}>
            <div>
              <div className="text-sm text-[#f0ede8] font-medium">{habit.name}</div>
              {habit.description && (
                <div className="text-xs text-[#444] mt-0.5">{habit.description}</div>
              )}
            </div>
            {habit.deletable ? (
              <button
                onClick={() => onRemove(habit.id)}
                className="text-xs text-[#3a3a3a] hover:text-red-500 transition-colors px-2 py-1"
              >
                remove
              </button>
            ) : (
              <span className="text-[10px] text-[#2a2a2a] uppercase tracking-wider">default</span>
            )}
          </div>
        ))}
      </div>

      {/* Add habit form */}
      {adding ? (
        <form
          onSubmit={handleAdd}
          className="rounded-xl border p-4 space-y-3"
          style={{ background: '#111', borderColor: '#f9731630' }}
        >
          <div className="text-xs text-[#f97316] uppercase tracking-widest font-medium mb-1">New habit</div>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Habit name"
            className="w-full text-sm px-3 py-2.5 rounded-lg border text-[#f0ede8] placeholder-[#333]"
            style={{ background: '#0f0f0f', borderColor: '#2a2a2a' }}
            onFocus={e => (e.target.style.borderColor = '#f97316')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />
          <input
            type="text"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full text-sm px-3 py-2.5 rounded-lg border text-[#f0ede8] placeholder-[#333]"
            style={{ background: '#0f0f0f', borderColor: '#2a2a2a' }}
            onFocus={e => (e.target.style.borderColor = '#f97316')}
            onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: '#f97316', color: '#0a0a0a' }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setName(''); setDesc('') }}
              className="px-4 py-2.5 rounded-lg text-sm text-[#555] hover:text-[#888] transition-colors"
              style={{ background: '#1a1a1a' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-3 rounded-xl border text-sm text-[#444] hover:text-[#f97316] hover:border-[#f9731630] transition-all"
          style={{ background: 'transparent', borderColor: '#1e1e1e', borderStyle: 'dashed' }}
        >
          + Add habit
        </button>
      )}

      <div className="text-xs text-[#2a2a2a] text-center pt-2">
        Default habits cannot be removed
      </div>
    </div>
  )
}
