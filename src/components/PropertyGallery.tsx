'use client'

import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const touchStart = useRef<number | null>(null)
  const [index, setIndex] = useState(0)
  const count = images.length

  const open = (value: number) => {
    setIndex(value)
    dialog.current?.showModal()
  }
  const step = (delta: number) => setIndex((current) => (current + delta + count) % count)

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') step(1)
    if (event.key === 'ArrowLeft') step(-1)
  }
  const onTouchStart = (event: TouchEvent) => { touchStart.current = event.touches[0].clientX }
  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart.current === null) return
    const distance = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(distance) > 45) step(distance < 0 ? 1 : -1)
    touchStart.current = null
  }

  return (
    <>
      <div className={`gallery-grid gallery-grid--${Math.min(count, 3)}`}>
        {images.slice(0, 3).map((image, position) => (
          <button className={`gallery-grid__item gallery-grid__item--${position + 1}`} type="button" key={image} onClick={() => open(position)} aria-label={`Deschide fotografia ${position + 1} din ${count}`}>
            <Image src={image} fill alt={`${title} — imagine ${position + 1}`} priority={position === 0} sizes={position === 0 ? '(max-width: 800px) 100vw, 66vw' : '34vw'} />
          </button>
        ))}
        {count > 1 && <button className="gallery-grid__all" type="button" onClick={() => open(0)}><Images size={17} /> Vezi toate cele {count} fotografii</button>}
      </div>
      <dialog className="lightbox" ref={dialog} onKeyDown={onKeyDown} aria-label={`Galerie foto — ${title}`}>
        <div className="lightbox__top">
          <span>{index + 1} / {count}</span>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Închide galeria"><X /></button>
        </div>
        <div className="lightbox__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <Image src={images[index]} alt={`${title} — imagine ${index + 1}`} fill sizes="100vw" />
          {count > 1 && <>
            <button className="lightbox__nav lightbox__nav--prev" type="button" onClick={() => step(-1)} aria-label="Fotografia anterioară"><ChevronLeft /></button>
            <button className="lightbox__nav lightbox__nav--next" type="button" onClick={() => step(1)} aria-label="Fotografia următoare"><ChevronRight /></button>
          </>}
        </div>
        {count > 1 && <div className="lightbox__thumbs">
          {images.map((image, position) => (
            <button className={position === index ? 'is-active' : ''} type="button" key={image} onClick={() => setIndex(position)} aria-label={`Fotografia ${position + 1}`} aria-current={position === index}>
              <Image src={image} alt="" fill sizes="96px" />
            </button>
          ))}
        </div>}
      </dialog>
    </>
  )
}
