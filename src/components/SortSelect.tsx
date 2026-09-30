'use client'

import { ArrowDownUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const sortOptions = [
  { value: '', label: 'Cele mai noi' },
  { value: 'pret-asc', label: 'Preț crescător' },
  { value: 'pret-desc', label: 'Preț descrescător' },
  { value: 'suprafata', label: 'Suprafață mare' },
]

export function SortSelect({ params }: { params: Record<string, string | undefined> }) {
  const router = useRouter()

  const change = (value: string) => {
    const query = new URLSearchParams()
    Object.entries({ ...params, sort: value }).forEach(([key, item]) => { if (item) query.set(key, item) })
    router.push(`/proprietati?${query}`, { scroll: false })
  }

  return (
    <label className="sort-select">
      <ArrowDownUp size={15} aria-hidden="true" />
      <span>Sortează</span>
      <select value={params.sort || ''} onChange={(event) => change(event.target.value)}>
        {sortOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}
