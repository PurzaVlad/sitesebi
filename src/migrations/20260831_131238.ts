import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`agency_name\` text DEFAULT 'LC Estate Partners',
  	\`city\` text DEFAULT 'Timișoara',
  	\`phone\` text DEFAULT '+40 723 000 000',
  	\`email\` text DEFAULT 'contact@lcestatepartners.ro',
  	\`address\` text DEFAULT 'Str. Eugeniu de Savoya 12, Timișoara',
  	\`whatsapp\` text DEFAULT '40723000000',
  	\`hero_title\` text DEFAULT 'Locul potrivit se simte ca acasă.',
  	\`hero_subtitle\` text DEFAULT 'Proprietăți atent selectate în Timișoara și împrejurimi, prezentate clar și fără presiune.',
  	\`facebook\` text,
  	\`instagram\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "agency_name", "city", "phone", "email", "address", "whatsapp", "hero_title", "hero_subtitle", "facebook", "instagram", "updated_at", "created_at") SELECT "id", "agency_name", "city", "phone", "email", "address", "whatsapp", "hero_title", "hero_subtitle", "facebook", "instagram", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`agency_name\` text DEFAULT 'NOVA Estate',
  	\`city\` text DEFAULT 'Timișoara',
  	\`phone\` text DEFAULT '+40 723 000 000',
  	\`email\` text DEFAULT 'salut@novaestate.ro',
  	\`address\` text DEFAULT 'Str. Eugeniu de Savoya 12, Timișoara',
  	\`whatsapp\` text DEFAULT '40723000000',
  	\`hero_title\` text DEFAULT 'Locul potrivit se simte ca acasă.',
  	\`hero_subtitle\` text DEFAULT 'Proprietăți atent selectate în Timișoara și împrejurimi, prezentate clar și fără presiune.',
  	\`facebook\` text,
  	\`instagram\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "agency_name", "city", "phone", "email", "address", "whatsapp", "hero_title", "hero_subtitle", "facebook", "instagram", "updated_at", "created_at") SELECT "id", "agency_name", "city", "phone", "email", "address", "whatsapp", "hero_title", "hero_subtitle", "facebook", "instagram", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
}
