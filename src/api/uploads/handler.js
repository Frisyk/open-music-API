/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, albumService, validator) {
    this._service = service;
    this._albumsService = albumService;
    this._validator = validator;

    autoBind(this);
  }

  async postCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._albumsService.addCover(id, url);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });

    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
