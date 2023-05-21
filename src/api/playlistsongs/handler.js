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
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const playlistSongsId = await this._playlistSongsService.postPlaylistSongs({
      songId,
      playlistId,
    });
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.verifySongExist(songId);

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

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const playlistSongs = await this._playlistSongsService.getPlaylistSongs(playlistId);
    return {
      status: 'success',
      data: {
        playlistSongs,
      },
    };
  }

  async deletePlaylistSongsByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistSongsService.deletePlaylistSongsById(playlistId, songId);

    return {
      status: 'success',
      message: 'music berhasil dihapus',
    };
  }
}

module.exports = PlaylistSongsHandler;
