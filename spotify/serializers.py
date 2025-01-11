from rest_framework import serializers
from .models import Playlist, Track

class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = '__all__'

class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = '__all__'

class UserTopTrackSerializer(serializers.Serializer):
    track = TrackSerializer()
    rank = serializers.IntegerField()

class UserTopArtistSerializer(serializers.Serializer):
    name = serializers.CharField()
    genres = serializers.ListField(child=serializers.CharField())
    popularity = serializers.IntegerField()
    image_url = serializers.URLField()
    rank = serializers.IntegerField()