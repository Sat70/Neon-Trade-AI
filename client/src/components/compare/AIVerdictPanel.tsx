type AIVerdictPanelProps = {
  text: string
}

export default function AIVerdictPanel({ text }: AIVerdictPanelProps) {
  return (
    <div className="rounded-2xl border border-teal-400/20 bg-gradient-to-br from-teal-500/10 to-transparent p-6 shadow-xl shadow-teal-500/20 backdrop-blur-lg">
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/30 text-teal-300">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <h3 className="text-lg font-semibold text-white">AI Verdict</h3>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{text}</p>
      <div className="mt-4 h-px w-24 rounded-full bg-gradient-to-r from-teal-400 to-transparent" />
    </div>
  )
}
