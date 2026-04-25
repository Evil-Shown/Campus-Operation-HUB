const colorClasses = {
  gray: 'bg-slate-200 text-slate-700',
  green: 'bg-emerald-100 text-emerald-700',
  yellow: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
}

export default function Badge({ text, color = 'gray' }) {
  const classes = colorClasses[color] || colorClasses.gray

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{text}</span>
}
