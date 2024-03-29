/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(PlaylistSongsService, PlaylistsService, validator) {
    this._playlistSongsService = PlaylistSongsService;
    this._playlistsService = PlaylistsService;
    this._validator = validator;

    autoBind(this); // mem-bind nilai this untuk seluruh method sekaligus
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const action = 'add';

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.verifySongExist(songId);
    await this._playlistSongsService.postPlaylistActivity(playlistId, credentialId, songId, action);
    const playlistSongsId = await this._playlistSongsService.postPlaylistSongs({
      songId,
      playlistId,
    });

    const response = h.response({
      status: 'success',
      message: 'Musik berhasil ditambahkan',
      data: {
        playlistSongsId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlistSongs = await this._playlistSongsService.getPlaylistSongs(playlistId);

    const playlist = {
      id: playlistSongs[0].id,
      name: playlistSongs[0].name,
      username: playlistSongs[0].username,
      songs: playlistSongs.map((row) => ({
        id: row.song_id,
        title: row.song_title,
        performer: row.song_performer,
      })),
    };

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._playlistSongsService.getPlaylistActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }

  async deletePlaylistSongByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const action = 'delete';

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.postPlaylistActivity(playlistId, credentialId, songId, action);
    await this._playlistSongsService.deletePlaylistSongById(playlistId, songId);

    return {
      status: 'success',
      message: 'music berhasil dihapus',
    };
  }
}

module.exports = PlaylistSongsHandler;
