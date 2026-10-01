import type { Payload } from 'payload'

export const emailEnabled = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)

function escape(text: string) {
  return text.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] || char)
}

// Forms must still succeed when e-mail fails: the request is already saved in the CMS.
export async function notifyTeam(payload: Payload, { subject, rows, extraRecipients = [] }: {
  subject: string
  rows: [string, string | number | null | undefined][]
  extraRecipients?: (string | null | undefined)[]
}) {
  if (!emailEnabled) return
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    const to = [process.env.NOTIFY_EMAIL || settings.email, ...extraRecipients].filter((address): address is string => Boolean(address))
    if (!to.length) return
    const filled = rows.filter(([, value]) => value !== undefined && value !== null && value !== '')
    await payload.sendEmail({
      to: [...new Set(to)],
      subject,
      text: filled.map(([label, value]) => `${label}: ${value}`).join('\n'),
      html: `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${filled
        .map(([label, value]) => `<tr><td style="color:#666">${escape(label)}</td><td><strong>${escape(String(value)).replace(/\n/g, '<br>')}</strong></td></tr>`)
        .join('')}</table><p style="font-family:sans-serif;font-size:13px;color:#666">Detaliile complete sunt în panoul de administrare.</p>`,
    })
  } catch (error) {
    payload.logger.error({ err: error, msg: `Notificarea „${subject}” nu a putut fi trimisă.` })
  }
}
