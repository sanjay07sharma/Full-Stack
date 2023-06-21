# -*- coding: utf-8 -*-
{
    'name': "musicSPA",

    'summary': "A music player that allows you to search and play your favorite songs",

    'author': "Sanjay Sharma",
    'category': 'Tools',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/views.xml',
        'views/template.xml',
        'demo/demo.xml',
    ],
    # the specific reasons for adding app.js to the backend may depend on 
    # the requirements of the application and the functionality that is being implemented.
    # i want when the application is loaded, this JavaScript file will be included on the backend.

    'assets': {
    'web.assets_backend': [
        'musicSPA/static/src/js/app.js',
    ],
    },
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    
    'installable': True,
    'application': True,
    'license': 'OEEL-1',
}
