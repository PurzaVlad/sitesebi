'use client'

import { Check, ChevronDown, WalletCards } from 'lucide-react'
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'

const priceLabel = (value: number) => `${new Intl.NumberFormat('ro-RO').format(value)} €`

export function BudgetFilter({ transaction, minimum, maximum, onChange }: {
  transaction: string
  minimum: string
  maximum: string
  onChange: (minimum: string, maximum: string) => void
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  const isRent = transaction === 'rent'
  const limit = Math.max(isRent ? 5000 : 1000000, Number(maximum) || 0, Number(minimum) || 0)
  const low = Math.max(0, Number(minimum) || 0)
  const high = maximum ? Math.max(low, Number(maximum)) : limit
  const presets = isRent ? [500, 1000, 1500, 2000] : [100000, 200000, 300000, 500000]
  const suffix = isRent ? ' / lună' : ''
  const label = low > 0
    ? `${priceLabel(low)} – ${maximum ? priceLabel(high) : 'fără limită'}${suffix}`
    : maximum ? `Până la ${priceLabel(high)}${suffix}` : 'Buget flexibil'

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  return (
    <div className={`custom-filter budget-filter${open ? ' custom-filter--open' : ''}`} ref={root}>
      <input type="hidden" name="pretMin" value={minimum} />
      <input type="hidden" name="pret" value={maximum} />
      <button ref={trigger} className="custom-filter__trigger" type="button" aria-expanded={open} aria-controls={`${id}-budget`} onClick={() => setOpen((current) => !current)}>
        <span className="custom-filter__icon"><WalletCards size={22} /></span>
        <span className="custom-filter__copy"><small>Buget orientativ</small><strong title={label}>{label}</strong></span>
        <ChevronDown className="custom-filter__chevron" size={17} />
      </button>
      {open && <div className="custom-filter__menu budget-filter__menu" id={`${id}-budget`} role="group" aria-label="Interval de preț">
        <div className="budget-range">
          <div className="budget-range__values" aria-live="polite">
            <div><span>Preț minim</span><strong>{priceLabel(low)}</strong></div>
            <div><span>Preț maxim{suffix}</span><strong>{maximum ? priceLabel(high) : 'Fără limită'}</strong></div>
          </div>
          <div className="budget-range__sliders" style={{ '--range-start': `${low / limit * 100}%`, '--range-end': `${high / limit * 100}%` } as CSSProperties}>
            <div className="budget-range__track" />
            <input type="range" aria-label="Preț minim" aria-valuetext={priceLabel(low)} min={0} max={limit} step={isRent ? 50 : 1000} value={low} onChange={(event) => {
              const value = Math.min(Number(event.target.value), high)
              onChange(value ? String(value) : '', maximum)
            }} />
            <input type="range" aria-label="Preț maxim" aria-valuetext={maximum ? priceLabel(high) : 'Fără limită'} min={0} max={limit} step={isRent ? 50 : 1000} value={high} onChange={(event) => {
              const value = Math.max(Number(event.target.value), low)
              onChange(minimum, value === limit ? '' : String(value))
            }} />
          </div>
          <div className="budget-range__limits"><span>0 €</span><span>{priceLabel(limit)}+</span></div>
        </div>
        <p className="budget-filter__presets-label">Bugete orientative</p>
        <div className="budget-filter__presets" role="group" aria-label="Bugete orientative">
          <button type="button" className={!minimum && !maximum ? 'is-selected' : ''} aria-pressed={!minimum && !maximum} onClick={() => onChange('', '')}>
            <span>Buget flexibil</span>{!minimum && !maximum && <Check size={16} />}
          </button>
          {presets.map((price) => {
            const selected = !minimum && maximum === String(price)
            return <button key={price} type="button" className={selected ? 'is-selected' : ''} aria-pressed={selected} onClick={() => onChange('', String(price))}>
              <span>Până la {priceLabel(price)}{suffix}</span>{selected && <Check size={16} />}
            </button>
          })}
        </div>
        <button className="budget-filter__done" type="button" onClick={() => { setOpen(false); trigger.current?.focus() }}>Gata</button>
      </div>}
    </div>
  )
}
