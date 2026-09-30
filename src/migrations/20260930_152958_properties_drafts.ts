import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_properties_v_version_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_properties_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_properties_v_version_features_order_idx\` ON \`_properties_v_version_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_version_features_parent_id_idx\` ON \`_properties_v_version_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_properties_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_transaction\` text DEFAULT 'sale',
  	\`version_property_type\` text,
  	\`version_status\` text DEFAULT 'available',
  	\`version_price\` numeric,
  	\`version_currency\` text DEFAULT 'EUR',
  	\`version_location\` text,
  	\`version_short_description\` text,
  	\`version_description\` text,
  	\`version_area\` numeric,
  	\`version_land_area\` numeric,
  	\`version_rooms\` numeric,
  	\`version_bathrooms\` numeric,
  	\`version_floor\` text,
  	\`version_year_built\` numeric,
  	\`version_energy_class\` text,
  	\`version_agent_id\` integer,
  	\`version_featured\` integer DEFAULT false,
  	\`version_published_at\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`properties\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_agent_id\`) REFERENCES \`team_members\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_properties_v_parent_idx\` ON \`_properties_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_version_version_slug_idx\` ON \`_properties_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_version_version_agent_idx\` ON \`_properties_v\` (\`version_agent_id\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_version_version_updated_at_idx\` ON \`_properties_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_version_version_created_at_idx\` ON \`_properties_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_version_version__status_idx\` ON \`_properties_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_created_at_idx\` ON \`_properties_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_updated_at_idx\` ON \`_properties_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_latest_idx\` ON \`_properties_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_autosave_idx\` ON \`_properties_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_properties_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_properties_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_properties_v_rels_order_idx\` ON \`_properties_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_rels_parent_idx\` ON \`_properties_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_rels_path_idx\` ON \`_properties_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_properties_v_rels_media_id_idx\` ON \`_properties_v_rels\` (\`media_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_properties_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`properties\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_properties_features\`("_order", "_parent_id", "id", "feature") SELECT "_order", "_parent_id", "id", "feature" FROM \`properties_features\`;`)
  await db.run(sql`DROP TABLE \`properties_features\`;`)
  await db.run(sql`ALTER TABLE \`__new_properties_features\` RENAME TO \`properties_features\`;`)
  await db.run(sql`CREATE INDEX \`properties_features_order_idx\` ON \`properties_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`properties_features_parent_id_idx\` ON \`properties_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_properties\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`transaction\` text DEFAULT 'sale',
  	\`property_type\` text,
  	\`status\` text DEFAULT 'available',
  	\`price\` numeric,
  	\`currency\` text DEFAULT 'EUR',
  	\`location\` text,
  	\`short_description\` text,
  	\`description\` text,
  	\`area\` numeric,
  	\`land_area\` numeric,
  	\`rooms\` numeric,
  	\`bathrooms\` numeric,
  	\`floor\` text,
  	\`year_built\` numeric,
  	\`energy_class\` text,
  	\`agent_id\` integer,
  	\`featured\` integer DEFAULT false,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`agent_id\`) REFERENCES \`team_members\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_properties\`("id", "title", "slug", "transaction", "property_type", "status", "price", "currency", "location", "short_description", "description", "area", "land_area", "rooms", "bathrooms", "floor", "year_built", "energy_class", "agent_id", "featured", "published_at", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "transaction", "property_type", "status", "price", "currency", "location", "short_description", "description", "area", "land_area", "rooms", "bathrooms", "floor", "year_built", "energy_class", "agent_id", "featured", "published_at", "updated_at", "created_at", 'published' FROM \`properties\`;`)
  await db.run(sql`DROP TABLE \`properties\`;`)
  await db.run(sql`ALTER TABLE \`__new_properties\` RENAME TO \`properties\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`properties_slug_idx\` ON \`properties\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`properties_agent_idx\` ON \`properties\` (\`agent_id\`);`)
  await db.run(sql`CREATE INDEX \`properties_updated_at_idx\` ON \`properties\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`properties_created_at_idx\` ON \`properties\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`properties__status_idx\` ON \`properties\` (\`_status\`);`)
  // Listings that existed before drafts were enabled stay live on the site.
  await db.run(sql`UPDATE \`properties\` SET \`_status\` = 'published' WHERE \`_status\` IS NULL OR \`_status\` = 'draft';`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`agency_name\` text DEFAULT 'LC Estate Partners',
  	\`city\` text DEFAULT 'Timișoara',
  	\`phone\` text DEFAULT '+40 730 816 657',
  	\`email\` text DEFAULT 'lc.estate.solution@gmail.com',
  	\`address\` text DEFAULT 'Str. Eugeniu de Savoya 12, Timișoara',
  	\`whatsapp\` text DEFAULT '40730816657',
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
  // Re-enabled only after every rebuild, so dropping old tables can't cascade into child rows.
  await db.run(sql`PRAGMA foreign_keys=ON;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_properties_v_version_features\`;`)
  await db.run(sql`DROP TABLE \`_properties_v\`;`)
  await db.run(sql`DROP TABLE \`_properties_v_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_properties\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`transaction\` text DEFAULT 'sale' NOT NULL,
  	\`property_type\` text NOT NULL,
  	\`status\` text DEFAULT 'available' NOT NULL,
  	\`price\` numeric NOT NULL,
  	\`currency\` text DEFAULT 'EUR',
  	\`location\` text NOT NULL,
  	\`short_description\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`area\` numeric,
  	\`land_area\` numeric,
  	\`rooms\` numeric,
  	\`bathrooms\` numeric,
  	\`floor\` text,
  	\`year_built\` numeric,
  	\`energy_class\` text,
  	\`agent_id\` integer,
  	\`featured\` integer DEFAULT false,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`agent_id\`) REFERENCES \`team_members\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_properties\`("id", "title", "slug", "transaction", "property_type", "status", "price", "currency", "location", "short_description", "description", "area", "land_area", "rooms", "bathrooms", "floor", "year_built", "energy_class", "agent_id", "featured", "published_at", "updated_at", "created_at") SELECT "id", "title", "slug", "transaction", "property_type", "status", "price", "currency", "location", "short_description", "description", "area", "land_area", "rooms", "bathrooms", "floor", "year_built", "energy_class", "agent_id", "featured", "published_at", "updated_at", "created_at" FROM \`properties\`;`)
  await db.run(sql`DROP TABLE \`properties\`;`)
  await db.run(sql`ALTER TABLE \`__new_properties\` RENAME TO \`properties\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`properties_slug_idx\` ON \`properties\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`properties_agent_idx\` ON \`properties\` (\`agent_id\`);`)
  await db.run(sql`CREATE INDEX \`properties_updated_at_idx\` ON \`properties\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`properties_created_at_idx\` ON \`properties\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_properties_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`properties\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_properties_features\`("_order", "_parent_id", "id", "feature") SELECT "_order", "_parent_id", "id", "feature" FROM \`properties_features\`;`)
  await db.run(sql`DROP TABLE \`properties_features\`;`)
  await db.run(sql`ALTER TABLE \`__new_properties_features\` RENAME TO \`properties_features\`;`)
  await db.run(sql`CREATE INDEX \`properties_features_order_idx\` ON \`properties_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`properties_features_parent_id_idx\` ON \`properties_features\` (\`_parent_id\`);`)
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
}
