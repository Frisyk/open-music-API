exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    songid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('playlist_songs', 'fk_playlistSongs_songs', 'FOREIGN KEY(songid) REFERENCES songs(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlistSongs_playlists', 'FOREIGN KEY(playlistid) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
  pgm.dropConstraint('playlist_songs', 'fk_playlistSongs_songs');
  pgm.dropConstraint('playlist_songs', 'fk_playlistSongs_playlists');
};
