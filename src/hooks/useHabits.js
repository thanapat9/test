import { useState, useEffect } from 'react'

const STORAGE_KEY = 'kaizen_habits'

const WORKOUT_CYCLE = ['Push', 'Pull', 'Leg']

function getWorkoutForDate(dateStr, logs) {
  // Find what workout to do based on past completed workouts
  const completedWorkouts = Object.entries(logs)
    .filter(([, v]) => v.workout?.done)
    .sort(([a], [b]) => a.localeCompare(b))

  if (completedWorkouts.length === 0) return WORKOUT_CYCLE[0]

  const lastDone = completedWorkouts[completedWorkouts.length - 1]
  const lastType = lastDone[1].workout?.type
  const lastIndex = WORKOUT_CYCLE.indexOf(lastType)
  return WORKOUT_CYCLE[(lastIndex + 1) % WORKOUT_CYCLE.length]
}

function getStreak(logs) {
  const today = new Date()
  let streak = 0
  let current = new Date(today)

  while (true) {
    const dateStr = current.toISOString().split('T')[0]
    const log = logs[dateStr]

    // Today: count even if not done yet (don't break streak for today)
    if (dateStr === today.toISOString().split('T')[0]) {
      const isComplete = log?.course?.done || log?.workout?.done
      if (isComplete) streak++
      current.setDate(current.getDate() - 1)
      continue
    }

    if (!log || (!log.course?.done && !log.workout?.done)) break
    streak++
    current.setDate(current.getDate() - 1)
  }

  return streak
}

function getLongestStreak(logs) {
  const dates = Object.keys(logs).sort()
  if (dates.length === 0) return 0

  let longest = 0
  let current = 0
  let prev = null

  for (const dateStr of dates) {
    const log = logs[dateStr]
    const hasActivity = log?.course?.done || log?.workout?.done
    if (!hasActivity) {
      current = 0
      prev = null
      continue
    }

    if (prev === null) {
      current = 1
    } else {
      const prevDate = new Date(prev)
      const currDate = new Date(dateStr)
      const diff = (currDate - prevDate) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        current++
      } else {
        current = 1
      }
    }
    longest = Math.max(longest, current)
    prev = dateStr
  }

  return longest
}

export function useHabits() {
  const [logs, setLogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  }, [logs])

  const today = new Date().toISOString().split('T')[0]
  const todayLog = logs[today] || {}
  const todayWorkout = getWorkoutForDate(today, logs)

  function toggleCourse(note = '') {
    setLogs(prev => {
      const current = prev[today]?.course
      return {
        ...prev,
        [today]: {
          ...prev[today],
          course: current?.done
            ? { done: false, note: '' }
            : { done: true, note, completedAt: new Date().toISOString() },
        },
      }
    })
  }

  function toggleWorkout(type = todayWorkout) {
    setLogs(prev => {
      const current = prev[today]?.workout
      return {
        ...prev,
        [today]: {
          ...prev[today],
          workout: current?.done
            ? { done: false }
            : { done: true, type, completedAt: new Date().toISOString() },
        },
      }
    })
  }

  function updateCourseNote(note) {
    setLogs(prev => ({
      ...prev,
      [today]: {
        ...prev[today],
        course: { ...prev[today]?.course, note },
      },
    }))
  }

  return {
    logs,
    today,
    todayLog,
    todayWorkout,
    streak: getStreak(logs),
    longestStreak: getLongestStreak(logs),
    totalDays: Object.keys(logs).filter(
      d => logs[d]?.course?.done || logs[d]?.workout?.done
    ).length,
    toggleCourse,
    toggleWorkout,
    updateCourseNote,
  }
}
