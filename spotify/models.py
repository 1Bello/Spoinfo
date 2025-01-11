from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

class SpotifyToken(models.Model):
    session_id = models.CharField(max_length=512, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=512)
    refresh_token = models.CharField(max_length=512)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

    def is_expired(self):
        return self.expires_in <= timezone.now()

class SpotifyUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    spotify_id = models.CharField(max_length=255)
    display_name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    profile_image_url = models.URLField(null=True, blank=True)
    country = models.CharField(max_length=2, null=True, blank=True)
    product = models.CharField(max_length=50, null=True, blank=True)  # premium, free, etc.
    access_token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

    def is_expired(self):
        return self.expires_in <= timezone.now()

    def __str__(self):
        return f"{self.user.username}'s Spotify Account"

class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    playlist_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    spotify_url = models.URLField()
    image_url = models.URLField(null=True, blank=True)
    is_public = models.BooleanField(default=True)
    follower_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'playlist_id']

    def __str__(self):
        return self.name

class Track(models.Model):
    spotify_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    album = models.CharField(max_length=255)
    duration_ms = models.IntegerField()
    preview_url = models.URLField(null=True, blank=True)
    spotify_url = models.URLField()
    image_url = models.URLField(null=True, blank=True)
    popularity = models.IntegerField(default=0)
    explicit = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.artist}"

class PlaylistTrack(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='tracks')
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    position = models.IntegerField()

    class Meta:
        unique_together = ['playlist', 'track', 'position']
        ordering = ['position']

class UserTopTrack(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    time_range = models.CharField(
        max_length=20,
        choices=[
            ('short_term', 'Last 4 Weeks'),
            ('medium_term', 'Last 6 Months'),
            ('long_term', 'All Time')
        ]
    )
    rank = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'track', 'time_range']
        ordering = ['rank']

class UserTopArtist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    artist_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    genres = models.JSONField(default=list)
    popularity = models.IntegerField(default=0)
    image_url = models.URLField(null=True, blank=True)
    time_range = models.CharField(
        max_length=20,
        choices=[
            ('short_term', 'Last 4 Weeks'),
            ('medium_term', 'Last 6 Months'),
            ('long_term', 'All Time')
        ]
    )
    rank = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'artist_id', 'time_range']
        ordering = ['rank']