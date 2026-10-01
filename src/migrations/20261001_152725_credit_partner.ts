import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`credit_requests\` ADD \`notary_help\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`credit_partner_name\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`credit_partner_email\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`credit_requests\` DROP COLUMN \`notary_help\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`credit_partner_name\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`credit_partner_email\`;`)
}
