import { getDailyQuote } from '../data/quotes'

export default function DailyQuote() {
  const { text, author } = getDailyQuote()

  return (
    <div
      className="rounded-xl px-4 py-3.5 flex gap-3"
      style={{ background: 'var(--surface)', borderLeft: '3px solid var(--accent)' }}
    >
      <div>
        <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-2)' }}>
          "{text}"
        </p>
        {author !== 'Unknown' && (
          <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-3)' }}>
            — {author}
          </p>
        )}
      </div>
    </div>
  )
}
