export const LEVELS = [
  { level: 1,  name: 'Beginner',     xp: 0    },
  { level: 2,  name: 'Apprentice',   xp: 100  },
  { level: 3,  name: 'Practitioner', xp: 300  },
  { level: 4,  name: 'Adept',        xp: 600  },
  { level: 5,  name: 'Expert',       xp: 1000 },
  { level: 6,  name: 'Master',       xp: 1500 },
  { level: 7,  name: 'Sensei',       xp: 2200 },
  { level: 8,  name: 'Sage',         xp: 3000 },
  { level: 9,  name: 'Legend',       xp: 4000 },
  { level: 10, name: 'Kaizen',       xp: 5500 },
]

export function calcXP(logs, habitIds) {
  let total = 0
  for (const dayLog of Object.values(logs)) {
    const done = habitIds.filter(id => dayLog[id]?.done).length
    if (done === 0) continue
    total += done * 10
    if (done === habitIds.length) total += 15
  }
  return total
}

export function getLevel(xp) {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.xp) current = l
    else break
  }
  const nextIdx = LEVELS.findIndex(l => l.level === current.level) + 1
  const next = LEVELS[nextIdx] || null
  const progress = next
    ? ((xp - current.xp) / (next.xp - current.xp)) * 100
    : 100
  const xpToNext = next ? next.xp - xp : 0
  return { ...current, next, progress, xpToNext, totalXP: xp }
}
