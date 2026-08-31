'use client'

import { Building2, Check, ChevronDown, MapPinned, Search, WalletCards, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

type FilterValues = {
  tranzactie?: string
  tip?: string
  zona?: string
  pret?: string
}

type Option = { value: string; label: string; detail?: string }

const propertyTypes: Option[] = [
  { value: '', label: 'Orice proprietate', detail: 'Arată-mi toate opțiunile' },
  { value: 'apartment', label: 'Apartament', detail: 'Apartamente și studiouri' },
  { value: 'house', label: 'Casă sau vilă', detail: 'Case individuale și duplexuri' },
  { value: 'penthouse', label: 'Penthouse', detail: 'Ultimul etaj și terase ample' },
  { value: 'land', label: 'Teren', detail: 'Pentru casă sau investiție' },
  { value: 'commercial', label: 'Spațiu comercial', detail: 'Birouri și spații comerciale' },
]

const locations: Option[] = [
  { value: '', label: 'Timișoara + împrejurimi', detail: 'Toate zonele disponibile' },
  { value: 'Timișoara', label: 'Timișoara', detail: 'Oraș și cartiere' },
  { value: 'Dumbrăvița', label: 'Dumbrăvița', detail: 'Nordul orașului' },
  { value: 'Giroc', label: 'Giroc', detail: 'Sudul orașului' },
  { value: 'Ghiroda', label: 'Ghiroda', detail: 'Estul orașului' },
  { value: 'Moșnița Nouă', label: 'Moșnița Nouă', detail: 'Est metropolitan' },
]

const budgets: Option[] = [
  { value: '', label: 'Buget flexibil', detail: 'Fără limită de preț' },
  { value: '100000', label: 'Până la 100.000 €' },
  { value: '200000', label: 'Până la 200.000 €' },
  { value: '300000', label: 'Până la 300.000 €' },
  { value: '500000', label: 'Până la 500.000 €' },
]

function CustomDropdown({
  icon: Icon,
  label,
  name,
  options,
  value,
  onChange,
}: {
  icon: typeof Building2
  label: string
  name: string
  options: Option[]
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const id = useId()
  const selected = options.find((option) => option.value === value) || options[0]

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [])

  return (
    <div className={`custom-filter${open ? ' custom-filter--open' : ''}`} ref={root}>
      <input type="hidden" name={name} value={value} />
      <button
        className="custom-filter__trigger"
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="custom-filter__icon"><Icon size={19} /></span>
        <span className="custom-filter__copy"><small>{label}</small><strong>{selected.label}</strong></span>
        <ChevronDown className="custom-filter__chevron" size={17} />
      </button>
      {open && (
        <div className="custom-filter__menu" id={`${id}-listbox`} role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              className={option.value === value ? 'is-selected' : ''}
              type="button"
              role="option"
              aria-selected={option.value === value}
              key={`${name}-${option.value || 'all'}`}
              onClick={() => { onChange(option.value); setOpen(false) }}
            >
              <span><strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}</span>
              {option.value === value && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function SearchFilters({ variant, initial = {} }: { variant: 'hero' | 'catalog'; initial?: FilterValues }) {
  const [transaction, setTransaction] = useState(initial.tranzactie || 'sale')
  const [type, setType] = useState(initial.tip || '')
  const [location, setLocation] = useState(initial.zona || '')
  const [budget, setBudget] = useState(initial.pret || '')
  const hasFilters = Boolean(type || location || budget || transaction !== 'sale')

  const reset = () => {
    setTransaction('sale')
    setType('')
    setLocation('')
    setBudget('')
  }

  return (
    <form className={`search-module search-module--${variant}`} action="/proprietati" method="get">
      <div className="search-module__topline">
        <strong className="search-module__title">Căutare personalizată</strong>
        <div className="transaction-switch" aria-label="Tip tranzacție">
          <button className={transaction === 'sale' ? 'is-active' : ''} type="button" onClick={() => setTransaction('sale')}>Cumpăr</button>
          <button className={transaction === 'rent' ? 'is-active' : ''} type="button" onClick={() => setTransaction('rent')}>Închiriez</button>
          <input type="hidden" name="tranzactie" value={transaction} />
        </div>
      </div>
      <div className="search-module__fields">
        <CustomDropdown icon={Building2} label="Tipul spațiului" name="tip" options={propertyTypes} value={type} onChange={setType} />
        <CustomDropdown icon={MapPinned} label="Unde te vezi?" name="zona" options={locations} value={location} onChange={setLocation} />
        <CustomDropdown icon={WalletCards} label="Buget orientativ" name="pret" options={budgets} value={budget} onChange={setBudget} />
        <button className="search-submit" type="submit"><span>{variant === 'hero' ? 'Arată-mi opțiunile' : 'Aplică filtrele'}</span><Search size={19} /></button>
      </div>
      {variant === 'catalog' && hasFilters && <button className="search-reset" type="button" onClick={reset}><X size={14} /> Resetează</button>}
    </form>
  )
}
