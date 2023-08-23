/* eslint-disable no-underscore-dangle */

const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(exportService, playlistsService, validator) {
    this._exportService = exportService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this._exportService.sendMessage(
      'export:playlists',
      JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });

    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
