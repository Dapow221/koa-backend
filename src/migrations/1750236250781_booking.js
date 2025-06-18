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
  pgm.createTable('booking', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    title: {
      type: 'varchar(100)',
      notNull: true,
    },
    subtitle: {
      type: 'varchar(255)',
      notNull: false,
    },
    description: {
      type: 'text',
      notNull: false,
    },
    sub_description: {
        type: 'text',
        notNull: false,
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

  // Insert default data
  pgm.sql(`
    INSERT INTO booking (title, subtitle, description, sub_description) VALUES
    ('EVENT, MEETING, WEEDINGS & CATERING', 'Great Venue for Any Occasion', 'Rumarasa Nusantara menyediakan ruang makan yang fleksibel dengan suasana hangat dan nyaman, dirancang khusus untuk berbagai jenis acara dan pertemuan – mulai dari perayaan ulang tahun yang meriah hingga rapat bisnis yang santai dan peluncuran produk yang sukses.', 'Kami juga siap memenuhi kebutuhan katering Anda untuk setiap acara spesial. Temukan berbagai pilihan menu autentik Indonesia, hidangan laut segar, dan makanan tradisional Nusantara yang dapat disesuaikan dengan kebutuhan acara Anda, termasuk pernikahan, arisan, meeting kantor, dan acara keluarga lainnya.');
  `);

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('booking');
};