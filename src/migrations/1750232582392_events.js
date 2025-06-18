/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('events', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    title: {
      type: 'varchar(100)',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: false,
    },
    image: {
      type: 'text',
      notNull: false,
      comment: 'Image file path or URL',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('events', 'created_at');

  // Insert default data
  pgm.sql(`
    INSERT INTO events (title, description, image) VALUES
    ('Corporate', 'Rumarasa Nusantara adalah pilihan tepat untuk mengadakan acara korporat dengan suasana eksklusif dan hidangan berkualitas.', 'ImageBanner1.jpg'),
    ('Wedding', 'Rayakan hari istimewa Anda di Rumarasa Nusantara, tempat ideal untuk menggelar resepsi pernikahan yang elegan dan berkesan.', 'ImageBanner2.jpg'),
    ('Birthday', 'Buat momen ulang tahun Anda lebih spesial di Rumarasa Nusantara dengan suasana hangat dan menu istimewa.', 'ImageBanner2.jpg'),
    ('Community', 'Rumarasa Nusantara adalah tempat yang cocok untuk berkumpul bersama komunitas, berbagi cerita dan cita rasa Nusantara.', 'ImageBanner2.jpg'),
    ('Artisan', 'Rasakan sentuhan seni kuliner di Rumarasa Nusantara, di mana cita rasa tradisional bertemu dengan presentasi modern.', 'ImageBanner2.jpg');
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('events');
};