from odoo import models, fields

class MusicAlbum(models.Model):
    _name = "music.album" 
    _description = 'A simple music player to search and listen to your songs'

    name = fields.Char('Album Name')
    player_ids = fields.One2many(comodel_name="music.player",inverse_name='album_id')
