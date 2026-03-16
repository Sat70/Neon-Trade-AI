type AIReasoningPanelProps = {
  text: string
}

export default function AIReasoningPanel({ text }: AIReasoningPanelProps) {
  return (
    <div className="rounded-2xl border border-teal-400/20 bg-gradient-to-br from-teal-500/10 to-transparent p-6 shadow-xl shadow-teal-500/20 backdrop-blur-lg">
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/30 text-teal-300">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </span>
        <h3 className="text-lg font-semibold text-white">Why AI Predicts This</h3>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">{text}</p>
      <div className="mt-4 h-px w-24 rounded-full bg-gradient-to-r from-teal-400 to-transparent" />
    </div>
  )
}
