from django.urls import path
from .views import AuthURL, spotify_callback, SpotifyAuthenticationStatus, UserPlaylists, UserTopItems, ArtistDetails, PlaylistDetails

urlpatterns = [

    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', SpotifyAuthenticationStatus.as_view()),
    path('user-playlists', UserPlaylists.as_view()),
    path('user-top-items', UserTopItems.as_view()),
    path('artist-details/<str:id>/', ArtistDetails.as_view()),
    path('playlist-details/<str:id>/', PlaylistDetails.as_view())
]