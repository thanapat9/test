import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import StreakDisplay from './components/StreakDisplay'
import HabitCard from './components/HabitCard'
import CalendarHeatmap from './components/CalendarHeatmap'
import WeeklySummary from './components/WeeklySummary'
import HabitManager from './components/HabitManager'
import MilestoneBadges from './components/MilestoneBadges'

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'habits', label: 'Habits' },
]

function getTodayLabel() {
  return new Date().toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function App() {
  const {
    habits, logs, today, todayLog, todayPPL,
    streak, longestStreak, totalDays, unlockedBadges,
    toggleHabit, setNote, addHabit, removeHabit,
  } = useHabits()

  const [tab, setTab] = useState('today')
  const habitIds = habits.map(h => h.id)
  const allDone = habits.length > 0 && habits.every(h => todayLog[h.id]?.done)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <div className="max-w-md mx-auto px-4 pb-14">

        {/* Header */}
        <div className="pt-10 pb-5 flex items-end justify-between">
          <div>
            <div className="text-xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
              Kaizen
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
              {getTodayLabel()}
            </div>
          </div>
          {streak > 0 && (
            <div className="text-right">
              <div className="text-2xl font-black" style={{ color: 'var(--accent)' }}>{streak}</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>streak</div>
            </div>
          )}
        </div>

        {/* All done banner */}
        {allDone && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm font-medium text-center"
            style={{
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.25)',
              color: 'var(--accent)',
            }}
          >
            All done for today
          </div>
        )}

        {/* Tabs */}
        <div
          className="flex gap-0.5 rounded-xl p-1 mb-5"
          style={{ background: 'var(--surface)' }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                background: tab === t.id ? 'var(--surface-raised)' : 'transparent',
                color: tab === t.id ? 'var(--text)' : 'var(--text-3)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TODAY */}
        {tab === 'today' && (
          <div className="space-y-3">
            <div
              className="rounded-xl border"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <StreakDisplay streak={streak} longestStreak={longestStreak} totalDays={totalDays} />
            </div>

            <div className="space-y-2">
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  logEntry={todayLog[habit.id]}
                  todayPPL={todayPPL}
                  onToggle={toggleHabit}
                  onNote={setNote}
                />
              ))}
            </div>

            {/* 7-day strip */}
            <div
              className="rounded-xl border p-4"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
                Last 7 days
              </div>
              <div className="flex justify-between">
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date()
                  d.setDate(d.getDate() - (6 - i))
                  const dateStr = d.toISOString().split('T')[0]
                  const dayLog = logs[dateStr] || {}
                  const doneCount = habitIds.filter(id => dayLog[id]?.done).length
                  const isToday = dateStr === today
                  const full = doneCount === habitIds.length && doneCount > 0
                  const partial = doneCount > 0 && !full

                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                        {d.toLocaleDateString('en', { weekday: 'narrow' })}
                      </div>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                        style={{
                          background: full ? 'var(--accent)' : partial ? 'var(--accent-dim)' : 'var(--surface-raised)',
                          color: full ? 'var(--bg)' : partial ? 'var(--accent)' : 'var(--text-3)',
                          outline: isToday ? '1px solid var(--accent)' : 'none',
                          outlineOffset: '2px',
                        }}
                      >
                        {full ? '✓' : partial ? doneCount : ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* WEEK */}
        {tab === 'week' && (
          <WeeklySummary habits={habits} logs={logs} />
        )}

        {/* HABITS */}
        {tab === 'habits' && (
          <div className="space-y-6">
            <MilestoneBadges unlockedBadges={unlockedBadges} />
            <HabitManager habits={habits} onAdd={addHabit} onRemove={removeHabit} />
            <CalendarHeatmap logs={logs} habitIds={habitIds} />
          </div>
        )}

      </div>
    </div>
  )
}
