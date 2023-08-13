/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async postPlaylistSongs({ playlistId, songId }) {
    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('musik gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongs(id) {
    const query = {
      text: 'SELECT p.id AS playlist_id, p.name AS playlist_name, u.username, s.id AS song_id, s.title AS song_title, s.performer AS song_performer FROM playlists p JOIN users u ON p.owner = u.id JOIN playlist_songs ps ON p.id = ps.playlistid JOIN songs s ON ps.songid = s.id WHERE p.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistSongById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlistid = $1 AND songid = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('PlaylistSongs gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;
