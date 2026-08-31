import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`viewings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`date\` text NOT NULL,
  	\`time\` text NOT NULL,
  	\`property_title\` text NOT NULL,
  	\`property_id\` integer,
  	\`name\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`email\` text,
  	\`note\` text,
  	\`status\` text DEFAULT 'scheduled',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`property_id\`) REFERENCES \`properties\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`viewings_property_idx\` ON \`viewings\` (\`property_id\`);`)
  await db.run(sql`CREATE INDEX \`viewings_updated_at_idx\` ON \`viewings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`viewings_created_at_idx\` ON \`viewings\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`viewings_id\` integer REFERENCES viewings(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_viewings_id_idx\` ON \`payload_locked_documents_rels\` (\`viewings_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`viewings\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`properties_id\` integer,
  	\`team_members_id\` integer,
  	\`leads_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`properties_id\`) REFERENCES \`properties\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`team_members_id\`) REFERENCES \`team_members\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`leads_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "properties_id", "team_members_id", "leads_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "properties_id", "team_members_id", "leads_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_properties_id_idx\` ON \`payload_locked_documents_rels\` (\`properties_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_team_members_id_idx\` ON \`payload_locked_documents_rels\` (\`team_members_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_leads_id_idx\` ON \`payload_locked_documents_rels\` (\`leads_id\`);`)
}
