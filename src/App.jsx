import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import StreakDisplay from './components/StreakDisplay'
import HabitCard from './components/HabitCard'
import CalendarHeatmap from './components/CalendarHeatmap'
import WeeklySummary from './components/WeeklySummary'
import HabitManager from './components/HabitManager'

function getTodayLabel() {
  return new Date().toLocaleDateString('en', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'habits', label: 'Habits' },
]

export default function App() {
  const {
    habits, logs, today, todayLog, todayPPL,
    streak, longestStreak, totalDays,
    toggleHabit, setNote, addHabit, removeHabit,
  } = useHabits()

  const [tab, setTab] = useState('today')
  const habitIds = habits.map(h => h.id)
  const allDone = habits.every(h => todayLog[h.id]?.done)

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f0ede8' }}>
      <div className="max-w-md mx-auto px-4 pb-12">

        {/* Header */}
        <div className="pt-10 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tight" style={{ color: '#f0ede8' }}>
              Kaizen
            </h1>
            <div className="text-xs mt-0.5" style={{ color: '#444' }}>
              {getTodayLabel()}
            </div>
          </div>
          {streak > 0 && (
            <div className="text-right">
              <div className="text-2xl font-black" style={{ color: '#f97316' }}>{streak}</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: '#444' }}>streak</div>
            </div>
          )}
        </div>

        {/* All done banner */}
        {allDone && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm font-medium text-center"
            style={{ background: '#110e00', border: '1px solid #f9731630', color: '#f97316' }}
          >
            All done for today
          </div>
        )}

        {/* Tab nav */}
        <div
          className="flex gap-0.5 rounded-lg p-0.5 mb-6"
          style={{ background: '#111' }}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2 rounded-md text-sm font-medium transition-all duration-150"
              style={{
                background: tab === t.id ? '#1e1e1e' : 'transparent',
                color: tab === t.id ? '#f0ede8' : '#444',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TODAY */}
        {tab === 'today' && (
          <div className="space-y-4">
            <div
              className="rounded-xl border"
              style={{ background: '#111', borderColor: '#1e1e1e' }}
            >
              <StreakDisplay streak={streak} longestStreak={longestStreak} totalDays={totalDays} />
            </div>

            <div className="space-y-2.5">
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
              style={{ background: '#111', borderColor: '#1e1e1e' }}
            >
              <div className="text-[10px] text-[#444] uppercase tracking-widest mb-3">Last 7 days</div>
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
                      <div className="text-[10px]" style={{ color: '#444' }}>
                        {d.toLocaleDateString('en', { weekday: 'narrow' })}
                      </div>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{
                          background: full ? '#f97316' : partial ? '#3a2200' : '#161616',
                          color: full ? '#0a0a0a' : partial ? '#f97316' : '#2a2a2a',
                          outline: isToday ? '1px solid #f9731650' : 'none',
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
            <HabitManager habits={habits} onAdd={addHabit} onRemove={removeHabit} />

            <CalendarHeatmap logs={logs} habitIds={habitIds} />
          </div>
        )}

      </div>
    </div>
  )
}
