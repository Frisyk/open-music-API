/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
// const NotFoundError = require('../../exceptions/NotFoundError');

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
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistSongsById(playlistId, songId) {
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
