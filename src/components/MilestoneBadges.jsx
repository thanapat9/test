import { BADGES } from '../hooks/useHabits'

export default function MilestoneBadges({ unlockedBadges }) {
  const unlocked = unlockedBadges.size
  const total = BADGES.length

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
          Milestones
        </div>
        <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
          {unlocked}/{total}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {BADGES.map(badge => {
          const earned = unlockedBadges.has(badge.id)
          return (
            <div
              key={badge.id}
              className="rounded-xl border p-3 flex flex-col items-center text-center transition-all duration-200"
              style={{
                background: earned ? 'rgba(139,92,246,0.1)' : 'var(--surface)',
                borderColor: earned ? 'rgba(139,92,246,0.35)' : 'var(--border)',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black mb-2"
                style={{
                  background: earned ? 'var(--accent)' : 'var(--surface-raised)',
                  color: earned ? 'var(--bg)' : 'var(--text-3)',
                }}
              >
                {badge.threshold >= 100 ? '∞' : badge.threshold}
              </div>
              <div
                className="text-[11px] font-semibold leading-tight"
                style={{ color: earned ? 'var(--text)' : 'var(--text-3)' }}
              >
                {badge.label}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
                {badge.desc}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
