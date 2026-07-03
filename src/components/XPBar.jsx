import { LEVELS } from '../data/levels'

export default function XPBar({ levelInfo }) {
  const { level, name, progress, xpToNext, totalXP, next } = levelInfo
  const isMaxLevel = !next

  return (
    <div
      className="rounded-xl border px-4 py-3"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="text-xs font-black px-2 py-0.5 rounded-md"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            {level}
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {name}
          </span>
        </div>
        <div className="text-xs" style={{ color: 'var(--text-3)' }}>
          {isMaxLevel ? `${totalXP} XP` : `${xpToNext} XP to ${next.name}`}
        </div>
      </div>

      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: 'var(--surface-raised)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, #fdba74, var(--accent))`,
          }}
        />
      </div>

      <div className="flex justify-between mt-1.5">
        <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
          {totalXP} XP total
        </span>
        {!isMaxLevel && (
          <div className="flex gap-1">
            {LEVELS.slice(0, 5).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{ background: i < level - 1 ? 'var(--accent)' : 'var(--border)' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
