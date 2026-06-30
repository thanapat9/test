function getLastNDays(n) {
  const today = new Date()
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (n - 1 - i))
    return d.toISOString().split('T')[0]
  })
}

const LEVEL_BG = ['#111', '#7c2d12', '#f97316']

export default function CalendarHeatmap({ logs, habitIds }) {
  const days = getLastNDays(7 * 14)
  const today = new Date().toISOString().split('T')[0]

  const firstDate = new Date(days[0])
  const startPad = firstDate.getDay()
  const padded = [...Array(startPad).fill(null), ...days]
  const weeks = []
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))

  function getLevel(dateStr) {
    if (!dateStr || !logs[dateStr]) return 0
    const done = habitIds.filter(id => logs[dateStr]?.[id]?.done).length
    if (done === 0) return 0
    if (done < habitIds.length) return 1
    return 2
  }

  return (
    <div className="rounded-xl border p-4" style={{ background: '#111', borderColor: '#1e1e1e' }}>
      <div className="text-[10px] text-[#444] uppercase tracking-widest mb-3">14-week activity</div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((dateStr, di) =>
              !dateStr ? (
                <div key={di} className="w-3.5 h-3.5" />
              ) : (
                <div
                  key={di}
                  title={dateStr}
                  className="w-3.5 h-3.5 rounded-sm transition-all"
                  style={{
                    background: LEVEL_BG[getLevel(dateStr)],
                    outline: dateStr === today ? '1px solid #f97316' : 'none',
                    outlineOffset: '1px',
                  }}
                />
              )
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-[10px] text-[#333]">less</span>
        {LEVEL_BG.map((bg, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ background: bg }} />
        ))}
        <span className="text-[10px] text-[#333]">more</span>
      </div>
    </div>
  )
}
