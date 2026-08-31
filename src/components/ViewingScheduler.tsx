'use client'

import { CalendarCheck, CalendarDays, Check, Clock3, LoaderCircle, X } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'

type AvailableDate = { value: string; weekday: string; day: string; month: string }

const times = ['10:00', '12:00', '15:00', '17:00']

export function ViewingScheduler({
  propertyId,
  propertyTitle,
  dates,
}: {
  propertyId: number
  propertyTitle: string
  dates: AvailableDate[]
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [date, setDate] = useState(dates[0]?.value || '')
  const [time, setTime] = useState('')
  const [booked, setBooked] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!date) return
    const controller = new AbortController()
    fetch(`/api/viewings?date=${date}&propertyId=${propertyId}&propertyTitle=${encodeURIComponent(propertyTitle)}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setBooked(Array.isArray(data.booked) ? data.booked : []))
      .catch((reason) => { if (reason.name !== 'AbortError') setBooked([]) })
      .finally(() => { if (!controller.signal.aborted) setLoadingSlots(false) })
    return () => controller.abort()
  }, [date, propertyId, propertyTitle])

  const selectedDate = dates.find((item) => item.value === date)

  function chooseDate(value: string) {
    setDate(value)
    setTime('')
    setLoadingSlots(true)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!date || !time) {
      setError('Alege data și ora vizionării.')
      return
    }

    setSubmitting(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/viewings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        phone: form.get('phone'),
        email: form.get('email'),
        note: form.get('note'),
        company: form.get('company'),
        date,
        time,
        propertyId,
        propertyTitle,
      }),
    })
    const data = await response.json()
    setSubmitting(false)

    if (!response.ok) {
      setError(data.error || 'Programarea nu a putut fi salvată.')
      if (response.status === 409) setBooked((current) => [...current, time])
      return
    }
    setSuccess(true)
  }

  return (
    <div className="viewing-scheduler">
      <button className="button button--accent" type="button" onClick={() => dialog.current?.showModal()}><span>Alege data și ora</span><CalendarDays size={17} /></button>
      <dialog className="viewing-dialog" ref={dialog} onClose={() => { setError(''); if (success) setSuccess(false) }}>
        <button className="viewing-dialog__close" type="button" aria-label="Închide" onClick={() => dialog.current?.close()}><X /></button>
        {success ? (
          <div className="viewing-success">
            <span><CalendarCheck /></span>
            <small>Vizionare programată</small>
            <h2>Ne vedem la proprietate.</h2>
            <p>Am rezervat <strong>{selectedDate?.weekday}, {selectedDate?.day} {selectedDate?.month}</strong>, la <strong>{time}</strong>. Echipa LC Estate Partners te va contacta pentru confirmare.</p>
            <button className="button button--dark" type="button" onClick={() => dialog.current?.close()}>Am înțeles</button>
          </div>
        ) : (
          <form className="viewing-form" onSubmit={submit}>
            <div className="viewing-form__heading"><span className="eyebrow">Vizionare online</span><h2>Alege momentul potrivit.</h2><p>{propertyTitle}</p></div>
            <fieldset><legend>1. Alege ziua</legend><div className="date-options">{dates.map((item) => <button className={date === item.value ? 'is-selected' : ''} type="button" onClick={() => chooseDate(item.value)} key={item.value}><small>{item.weekday}</small><strong>{item.day}</strong><span>{item.month}</span>{date === item.value && <Check size={13} />}</button>)}</div></fieldset>
            <fieldset><legend>2. Alege ora</legend><div className="time-options">{times.map((slot) => { const unavailable = booked.includes(slot); return <button className={time === slot ? 'is-selected' : ''} type="button" disabled={unavailable || loadingSlots} onClick={() => setTime(slot)} key={slot}><Clock3 size={15} />{slot}{unavailable && <small>ocupat</small>}</button> })}</div></fieldset>
            <fieldset className="viewing-details"><legend>3. Datele tale</legend><div><label><span>Nume *</span><input name="name" required autoComplete="name" placeholder="Nume și prenume" /></label><label><span>Telefon *</span><input name="phone" required type="tel" autoComplete="tel" placeholder="07xx xxx xxx" /></label></div><label><span>E-mail</span><input name="email" type="email" autoComplete="email" placeholder="nume@email.ro" /></label><label><span>Observații</span><textarea name="note" rows={2} placeholder="Orice detaliu util pentru agent..." /></label><label className="hidden-field">Companie<input name="company" tabIndex={-1} autoComplete="off" /></label></fieldset>
            {error && <p className="viewing-error" role="alert">{error}</p>}
            <button className="button button--accent viewing-submit" type="submit" disabled={submitting}>{submitting ? <>Se salvează...<LoaderCircle className="spin" /></> : <>Confirmă programarea<CalendarCheck /></>}</button>
            <p className="viewing-privacy">Nu este necesară plata. Agentul confirmă telefonic programarea.</p>
          </form>
        )}
      </dialog>
    </div>
  )
}
