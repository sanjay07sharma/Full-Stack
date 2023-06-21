# -*- coding: utf-8 -*-
import json
import os
import base64
from odoo import http
from odoo.http import Response
from odoo.modules.module import get_module_resource


# we are using a web framework or library that is built on top of Python's http module,
class MusicSpa(http.Controller):
    @http.route('/music', auth='public')
    def index(self, **kw):
        return http.request.render('musicSPA.music_template')

    @http.route('/music/search', auth='public', type="http", methods=["GET"])
    def search(self, **kw):
        # Retrieve the song name from the search query
        song_name = kw.get('song_name')
        albums = http.request.env['music.album'].search_read([('name','ilike',song_name)],fields={'name','player_ids'})
        musics = http.request.env['music.player'].search_read([('name', 'ilike', song_name)],fields={"name", "url", 'album_id'})
    
        if not musics:
            musics = "Song not Found"
        if not albums:
            albums = "Album not Found"

        return Response(json.dumps({'result': musics , 'albumdata' : albums}), content_type='application/json')

    @http.route('/music/fetch', type='http', auth='public', methods=['GET'])
    def find(self, **kw):
        album = kw.get('album_name')
        albums = http.request.env['music.album'].search_read([('name', 'ilike', album)], fields=['name', 'player_ids'])
        player_ids = [player_id for album in albums for player_id in album['player_ids']]
        musics = http.request.env['music.player'].search_read([('id', 'in', player_ids)],fields={"name", "url"})
        print(musics)

        if not albums:
            albums = "Album not Found"

        return Response(json.dumps({'result': musics}), content_type='application/json')

    @http.route('/music/<model("music.player"):music>', type='http', auth="public", methods=["GET"])
    def load(self, music, **kw):
        music_file_path = get_module_resource('musicSPA', 'static/songs', music.filename)
        file = open(music_file_path, 'rb').read()
        return file
