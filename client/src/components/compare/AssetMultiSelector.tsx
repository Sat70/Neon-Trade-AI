import { useState, useMemo, useRef, useEffect } from 'react'
import type { CompareAssetOption } from '../../data/compareMockData'

const MAX_ASSETS = 4

type AssetMultiSelectorProps = {
  pool: CompareAssetOption[]
  selected: CompareAssetOption[]
  onChange: (selected: CompareAssetOption[]) => void
}

export default function AssetMultiSelector({ pool, selected, onChange }: AssetMultiSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pool
    return pool.filter(
      (a) =>
        a.ticker.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    )
  }, [pool, query])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggle = (asset: CompareAssetOption) => {
    const inSelected = selected.some((s) => s.id === asset.id)
    if (inSelected) {
      onChange(selected.filter((s) => s.id !== asset.id))
    } else if (selected.length < MAX_ASSETS) {
      onChange([...selected, asset])
    }
  }

  const remove = (id: string) => {
    onChange(selected.filter((s) => s.id !== id))
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <label className="mb-2 block text-sm font-medium text-slate-400">
        Select 2–4 assets to compare
      </label>
      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-sm">
        {selected.map((a) => (
          <span
            key={a.id}
            className="inline-flex items-center gap-1 rounded-full border border-teal-400/40 bg-teal-500/20 px-3 py-1 text-xs font-medium text-teal-200"
          >
            {a.ticker}
            <button
              type="button"
              onClick={() => remove(a.id)}
              className="rounded-full p-0.5 transition hover:bg-teal-400/30"
              aria-label={`Remove ${a.ticker}`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        {selected.length < MAX_ASSETS && (
          <div className="relative flex-1 min-w-[140px]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              placeholder="Search ticker or name..."
              className="w-full border-0 bg-transparent py-1.5 text-sm text-white placeholder-slate-500 outline-none"
            />
            {open && (
              <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-xl border border-white/10 bg-slate-900/95 py-2 shadow-xl backdrop-blur-lg">
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-slate-500">No matches</li>
                ) : (
                  filtered.map((asset) => {
                    const isSelected = selected.some((s) => s.id === asset.id)
                    return (
                      <li key={asset.id}>
                        <button
                          type="button"
                          onClick={() => {
                            toggle(asset)
                            setQuery('')
                          }}
                          disabled={isSelected}
                          className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition ${
                            isSelected
                              ? 'cursor-default text-slate-500'
                              : 'text-slate-200 hover:bg-teal-500/20 hover:text-teal-200'
                          }`}
                        >
                          <span className="font-medium">{asset.ticker}</span>
                          <span className="truncate text-slate-400">{asset.name}</span>
                        </button>
                      </li>
                    )
                  })
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
