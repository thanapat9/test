import { useState, useEffect } from 'react'

const LOGS_KEY = 'kaizen_logs_v2'
const HABITS_KEY = 'kaizen_habits_v2'
const PPL_CYCLE = ['Push', 'Pull', 'Leg']

export const DEFAULT_HABITS = [
  { id: 'course', name: 'Data Engineer Course', description: '1 chapter minimum', hasNote: true, isPPL: false, deletable: false },
  { id: 'workout', name: 'Workout', description: 'Push · Pull · Leg', hasNote: false, isPPL: true, deletable: false },
]

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function getNextPPL(logs) {
  const done = Object.entries(logs)
    .filter(([, v]) => v['workout']?.done && v['workout']?.type)
    .sort(([a], [b]) => a.localeCompare(b))
  if (done.length === 0) return PPL_CYCLE[0]
  const lastType = done[done.length - 1][1]['workout'].type
  return PPL_CYCLE[(PPL_CYCLE.indexOf(lastType) + 1) % PPL_CYCLE.length]
}

function calcStreak(logs, habitIds) {
  const today = todayStr()
  let streak = 0
  const d = new Date()

  while (true) {
    const dateStr = d.toISOString().split('T')[0]
    const hasAny = habitIds.some(id => logs[dateStr]?.[id]?.done)

    if (dateStr === today) {
      if (hasAny) streak++
      d.setDate(d.getDate() - 1)
      continue
    }
    if (!hasAny) break
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

function calcLongest(logs, habitIds) {
  const dates = Object.keys(logs).sort()
  let longest = 0, current = 0, prev = null
  for (const dateStr of dates) {
    const hasAny = habitIds.some(id => logs[dateStr]?.[id]?.done)
    if (!hasAny) { current = 0; prev = null; continue }
    if (!prev) { current = 1 }
    else {
      const diff = (new Date(dateStr) - new Date(prev)) / 86400000
      current = diff === 1 ? current + 1 : 1
    }
    longest = Math.max(longest, current)
    prev = dateStr
  }
  return longest
}

export function useHabits() {
  const [habits, setHabits] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HABITS_KEY)) || DEFAULT_HABITS }
    catch { return DEFAULT_HABITS }
  })

  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LOGS_KEY)) || {} }
    catch { return {} }
  })

  useEffect(() => { localStorage.setItem(HABITS_KEY, JSON.stringify(habits)) }, [habits])
  useEffect(() => { localStorage.setItem(LOGS_KEY, JSON.stringify(logs)) }, [logs])

  const today = todayStr()
  const todayLog = logs[today] || {}
  const todayPPL = getNextPPL(logs)
  const habitIds = habits.map(h => h.id)

  function toggleHabit(id, extra = {}) {
    setLogs(prev => {
      const current = prev[today]?.[id]
      return {
        ...prev,
        [today]: {
          ...prev[today],
          [id]: current?.done
            ? { done: false }
            : { done: true, completedAt: new Date().toISOString(), ...extra },
        },
      }
    })
  }

  function setNote(id, note) {
    setLogs(prev => ({
      ...prev,
      [today]: { ...prev[today], [id]: { ...prev[today]?.[id], note } },
    }))
  }

  function addHabit(name, description = '') {
    const id = 'h_' + Date.now()
    setHabits(prev => [...prev, { id, name, description, hasNote: false, isPPL: false, deletable: true }])
  }

  function removeHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  const totalDays = Object.keys(logs).filter(d =>
    habitIds.some(id => logs[d]?.[id]?.done)
  ).length

  return {
    habits,
    logs,
    today,
    todayLog,
    todayPPL,
    streak: calcStreak(logs, habitIds),
    longestStreak: calcLongest(logs, habitIds),
    totalDays,
    toggleHabit,
    setNote,
    addHabit,
    removeHabit,
  }
}
