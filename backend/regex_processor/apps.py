from django.apps import AppConfig


'''
tells Django how to configure the app when 
it’s included in INSTALLED_APPS in settings.py.
'''

class RegexProcessorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'regex_processor'
