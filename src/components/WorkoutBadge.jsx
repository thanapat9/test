const WORKOUT_CONFIG = {
  Push: {
    color: 'from-red-600 to-orange-500',
    glow: 'shadow-red-500/40',
    icon: '💪',
    muscles: 'Chest · Shoulders · Triceps',
  },
  Pull: {
    color: 'from-blue-600 to-cyan-500',
    glow: 'shadow-blue-500/40',
    icon: '🏋️',
    muscles: 'Back · Biceps · Rear Delts',
  },
  Leg: {
    color: 'from-purple-600 to-pink-500',
    glow: 'shadow-purple-500/40',
    icon: '🦵',
    muscles: 'Quads · Hamstrings · Calves',
  },
}

export default function WorkoutBadge({ type, done }) {
  const cfg = WORKOUT_CONFIG[type] || WORKOUT_CONFIG.Push

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${cfg.color} shadow-lg ${cfg.glow} ${
        done ? 'opacity-60' : ''
      }`}
    >
      <span className="text-lg">{cfg.icon}</span>
      <div className="text-left">
        <div className="font-bold text-white text-sm">{type} Day</div>
        <div className="text-white/70 text-xs">{cfg.muscles}</div>
      </div>
      {done && <span className="text-white/80 text-sm">✓</span>}
    </div>
  )
}
