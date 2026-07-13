import { useState, useEffect } from 'react'
import { calcXP, getLevel } from '../data/levels'

const LOGS_KEY = 'kaizen_logs_v2'
const HABITS_KEY = 'kaizen_habits_v2'
export const DEFAULT_HABITS = [
  { id: 'course', name: 'Data Engineer Course', description: '1 chapter minimum', hasNote: true, isPPL: false, deletable: false },
  { id: 'workout', name: 'Workout', description: 'Pick muscle groups', hasNote: false, isPPL: true, deletable: false },
]

export const BADGES = [
  { id: 's3',   label: 'First Flame',    desc: '3-day streak',   type: 'streak', threshold: 3 },
  { id: 's7',   label: 'Week Solid',     desc: '7-day streak',   type: 'streak', threshold: 7 },
  { id: 's14',  label: 'Two Weeks',      desc: '14-day streak',  type: 'streak', threshold: 14 },
  { id: 's30',  label: 'Month In',       desc: '30-day streak',  type: 'streak', threshold: 30 },
  { id: 's100', label: 'Kaizen Master',  desc: '100-day streak', type: 'streak', threshold: 100 },
  { id: 't10',  label: 'Ten Days',       desc: '10 days total',  type: 'total',  threshold: 10 },
  { id: 't25',  label: 'Twenty Five',    desc: '25 days total',  type: 'total',  threshold: 25 },
  { id: 't50',  label: 'Half Century',   desc: '50 days total',  type: 'total',  threshold: 50 },
  { id: 't100', label: 'Century',        desc: '100 days total', type: 'total',  threshold: 100 },
]

function todayStr() {
  return new Date().toISOString().split('T')[0]
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
  const habitIds = habits.map(h => h.id)

  const streak = calcStreak(logs, habitIds)
  const longestStreak = calcLongest(logs, habitIds)
  const totalDays = Object.keys(logs).filter(d =>
    habitIds.some(id => logs[d]?.[id]?.done)
  ).length

  const unlockedBadges = new Set(
    BADGES
      .filter(b => b.type === 'streak' ? longestStreak >= b.threshold : totalDays >= b.threshold)
      .map(b => b.id)
  )

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

  function toggleHabitForDate(id, dateStr, extra = {}) {
    setLogs(prev => {
      const current = prev[dateStr]?.[id]
      return {
        ...prev,
        [dateStr]: {
          ...prev[dateStr],
          [id]: current?.done
            ? { done: false }
            : { done: true, completedAt: new Date().toISOString(), retroactive: true, ...extra },
        },
      }
    })
  }

  const xp = calcXP(logs, habitIds)

  return {
    habits, logs, today, todayLog,
    streak, longestStreak, totalDays, unlockedBadges,
    xp, levelInfo: getLevel(xp),
    toggleHabit, setNote, addHabit, removeHabit, toggleHabitForDate,
  }
}
