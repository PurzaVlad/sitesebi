import Image from 'next/image'

export function AgentPhoto({ name, src, className, sizes }: {
  name: string
  src: string
  className: string
  sizes: string
}) {
  return (
    <div className={className}>
      {src ? <Image src={src} alt={name} fill sizes={sizes} /> : (
        <span className="agent-photo__placeholder" aria-label={name}>
          {name.split(/\s+/).map((part) => part[0]).join('')}
        </span>
      )}
    </div>
  )
}
