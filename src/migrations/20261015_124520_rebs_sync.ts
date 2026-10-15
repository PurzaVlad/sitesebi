import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`leads\` ADD \`crm_property_id\` numeric;`)
  await db.run(sql`ALTER TABLE \`leads\` ADD \`crm_status\` text;`)
  await db.run(sql`ALTER TABLE \`credit_requests\` ADD \`crm_status\` text;`)
  await db.run(sql`ALTER TABLE \`viewings\` ADD \`crm_property_id\` numeric;`)
  await db.run(sql`ALTER TABLE \`viewings\` ADD \`crm_status\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`crm_property_id\`;`)
  await db.run(sql`ALTER TABLE \`leads\` DROP COLUMN \`crm_status\`;`)
  await db.run(sql`ALTER TABLE \`credit_requests\` DROP COLUMN \`crm_status\`;`)
  await db.run(sql`ALTER TABLE \`viewings\` DROP COLUMN \`crm_property_id\`;`)
  await db.run(sql`ALTER TABLE \`viewings\` DROP COLUMN \`crm_status\`;`)
}
