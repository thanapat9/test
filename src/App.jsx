import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import StreakDisplay from './components/StreakDisplay'
import HabitCard from './components/HabitCard'
import CalendarHeatmap from './components/CalendarHeatmap'
import WorkoutBadge from './components/WorkoutBadge'

const KAIZEN_QUOTES = [
  'Small daily improvements lead to stunning results.',
  '1% better every day = 37x better in a year.',
  'Focus on the process, not the outcome.',
  'Progress, not perfection.',
  'Fall in love with the process.',
]

function getTodayLabel() {
  return new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getMotivation(streak) {
  if (streak === 0) return 'เริ่มต้นวันนี้เลย! 🚀'
  if (streak === 1) return 'ดีมาก! เริ่มต้นแล้ว 🌱'
  if (streak < 7) return `${streak} วันติดแล้ว! อย่าหยุด 💪`
  if (streak < 14) return `สัปดาห์กว่าแล้ว! คุณทำได้ 🔥`
  if (streak < 30) return `${streak} วัน! กำลังสร้างนิสัยที่ดี ⚡`
  return `${streak} วัน! ระดับ Kaizen Master 🏆`
}

export default function App() {
  const {
    logs,
    today,
    todayLog,
    todayWorkout,
    streak,
    longestStreak,
    totalDays,
    toggleCourse,
    toggleWorkout,
    updateCourseNote,
  } = useHabits()

  const [tab, setTab] = useState('today')
  const quote = KAIZEN_QUOTES[new Date().getDay() % KAIZEN_QUOTES.length]
  const bothDone = todayLog.course?.done && todayLog.workout?.done

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-md mx-auto px-4 pb-10">
        {/* Header */}
        <div className="pt-8 pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">改善</span>
            <h1 className="text-2xl font-bold text-gray-100">Kaizen Tracker</h1>
          </div>
          <p className="text-xs text-gray-500 italic">"{quote}"</p>
        </div>

        {/* Date */}
        <div className="text-center mb-3">
          <span className="text-sm text-gray-400">{getTodayLabel()}</span>
        </div>

        {/* Celebration banner */}
        {bothDone && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-green-900/50 to-teal-900/50 border border-green-500/30 text-center">
            <span className="text-lg">🎉</span>
            <span className="text-sm text-green-300 font-semibold ml-2">
              เสร็จครบทุก habit วันนี้แล้ว!
            </span>
          </div>
        )}

        {/* Tab nav */}
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1 mb-6">
          {[
            { id: 'today', label: 'Today' },
            { id: 'progress', label: 'Progress' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? 'bg-gray-700 text-gray-100 shadow'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'today' && (
          <div className="space-y-4">
            {/* Streak card */}
            <div className="rounded-2xl border border-gray-700/60 bg-gray-900/50">
              <StreakDisplay
                streak={streak}
                longestStreak={longestStreak}
                totalDays={totalDays}
              />
              <div className="text-center text-sm text-gray-500 pb-4">
                {getMotivation(streak)}
              </div>
            </div>

            {/* Workout badge */}
            <div className="flex justify-center">
              <WorkoutBadge type={todayWorkout} done={todayLog.workout?.done} />
            </div>

            {/* Habit cards */}
            <div className="space-y-3">
              <HabitCard
                icon="📚"
                title="Data Engineer Course"
                subtitle="เรียน course วันนี้อย่างน้อย 1 chapter"
                done={todayLog.course?.done}
                note={todayLog.course?.note}
                showNote
                onToggle={toggleCourse}
                onNoteChange={updateCourseNote}
              />

              <HabitCard
                icon={todayWorkout === 'Push' ? '💪' : todayWorkout === 'Pull' ? '🏋️' : '🦵'}
                title={`${todayWorkout} Day`}
                subtitle={
                  todayWorkout === 'Push'
                    ? 'Chest · Shoulders · Triceps'
                    : todayWorkout === 'Pull'
                    ? 'Back · Biceps · Rear Delts'
                    : 'Quads · Hamstrings · Calves'
                }
                done={todayLog.workout?.done}
                onToggle={() => toggleWorkout(todayWorkout)}
              />
            </div>

            {/* 7-day mini view */}
            <div className="rounded-2xl border border-gray-700/60 bg-gray-900/50 p-4">
              <div className="text-sm font-semibold text-gray-400 mb-3">7 วันล่าสุด</div>
              <div className="flex justify-between">
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date()
                  d.setDate(d.getDate() - (6 - i))
                  const dateStr = d.toISOString().split('T')[0]
                  const log = logs[dateStr]
                  const course = log?.course?.done
                  const workout = log?.workout?.done
                  const isToday = dateStr === today
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-600">
                        {d.toLocaleDateString('en', { weekday: 'narrow' })}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all ${
                          isToday ? 'border-purple-500' : 'border-transparent'
                        } ${
                          course && workout
                            ? 'bg-green-500/20 border-green-500/40'
                            : course || workout
                            ? 'bg-yellow-500/20 border-yellow-500/40'
                            : 'bg-gray-800'
                        }`}
                      >
                        {course && workout ? '✓' : course || workout ? '·' : ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {tab === 'progress' && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '🔥 Streak', value: streak, unit: 'days', color: 'text-orange-400' },
                { label: '🏆 Best', value: longestStreak, unit: 'days', color: 'text-yellow-400' },
                { label: '📅 Total', value: totalDays, unit: 'days', color: 'text-blue-400' },
              ].map(s => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gray-700/60 bg-gray-900/50 p-3 text-center"
                >
                  <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-600">{s.unit}</div>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <CalendarHeatmap logs={logs} />

            {/* Workout history */}
            <div className="rounded-2xl border border-gray-700/60 bg-gray-900/50 p-5">
              <div className="text-sm font-semibold text-gray-400 mb-3">Workout History</div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {Object.entries(logs)
                  .filter(([, v]) => v.workout?.done)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 15)
                  .map(([date, log]) => (
                    <div key={date} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {new Date(date + 'T00:00:00').toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          log.workout.type === 'Push'
                            ? 'bg-red-900/50 text-red-300'
                            : log.workout.type === 'Pull'
                            ? 'bg-blue-900/50 text-blue-300'
                            : 'bg-purple-900/50 text-purple-300'
                        }`}
                      >
                        {log.workout.type}
                      </span>
                    </div>
                  ))}
                {Object.keys(logs).filter(d => logs[d]?.workout?.done).length === 0 && (
                  <div className="text-gray-600 text-sm text-center py-4">
                    ยังไม่มีประวัติ workout
                  </div>
                )}
              </div>
            </div>

            {/* Course notes */}
            <div className="rounded-2xl border border-gray-700/60 bg-gray-900/50 p-5">
              <div className="text-sm font-semibold text-gray-400 mb-3">Course Notes</div>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {Object.entries(logs)
                  .filter(([, v]) => v.course?.done && v.course?.note)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 15)
                  .map(([date, log]) => (
                    <div key={date} className="text-sm">
                      <span className="text-gray-600 text-xs">
                        {new Date(date + 'T00:00:00').toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <p className="text-gray-300 mt-0.5 italic">"{log.course.note}"</p>
                    </div>
                  ))}
                {Object.keys(logs).filter(d => logs[d]?.course?.note).length === 0 && (
                  <div className="text-gray-600 text-sm text-center py-4">
                    ยังไม่มีโน้ตจาก course
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
