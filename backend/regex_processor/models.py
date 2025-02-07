# regex_processor/models.py
from django.db import models

'''
Contains the database models for your app. 
If you were storing files or data in a database, 
this is where you would define those models.
'''


class ProcessedFile(models.Model):
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user_input = models.TextField()
    processed_data = models.JSONField()
