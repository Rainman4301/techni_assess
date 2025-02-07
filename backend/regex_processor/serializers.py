# regex_processor/serializers.py
from rest_framework import serializers

'''
Used to convert complex data types like querysets into JSON format. 
In your case, it's used for converting data between the frontend and backend via API.
'''



class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    user_input = serializers.CharField()
