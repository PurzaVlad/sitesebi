import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Fișier media', plural: 'Media' },
  admin: { group: 'Conținut' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Text alternativ',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: process.env.UPLOAD_DIR || 'media',
    imageSizes: [
      { name: 'card', width: 800, height: 560, position: 'centre' },
      { name: 'thumbnail', width: 360, height: 360, position: 'centre' },
    ],
    mimeTypes: ['image/*'],
  },
}
