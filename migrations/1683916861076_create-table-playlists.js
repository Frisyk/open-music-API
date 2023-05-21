/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // add foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('songs', 'fk_songs_albums', 'FOREIGN KEY(albumId) REFERENCES albums(id) ON DELETE CASCADE');

  // membuat user baru.
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_playlists', 'old_playlists', 'old_playlists', 'old playlists')");

  // mengubah nilai owner pada note yang owner-nya bernilai NULL
  pgm.sql("UPDATE playlists SET owner = 'old_playlists' WHERE owner IS NULL");
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
  pgm.dropConstraint('songs', 'fk_songs_albums');
};
