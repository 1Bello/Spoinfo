from django.shortcuts import render, redirect
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from requests import Request, post, get
from django.http import JsonResponse
import json

from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from .util import update_or_create_user_tokens, is_spotify_authenticated, get_user_tokens
from .models import SpotifyUser, Playlist, Track, PlaylistTrack, UserTopTrack, UserTopArtist
from .serializers import (
    PlaylistSerializer, 
    TrackSerializer, 
    UserTopTrackSerializer,
    UserTopArtistSerializer
)

class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = [
            'user-read-playback-state',
            'user-modify-playback-state',
            'user-read-currently-playing',
            'playlist-read-private',
            'playlist-modify-public',
            'playlist-modify-private',
            'user-top-read',
            'user-read-recently-played',
            'user-read-email',
            'user-read-private'
        ]
        
        if not request.session.session_key:
            request.session.create()
        
        session_key = request.session.session_key
        
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': ' '.join(scopes),
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'state': session_key
        }).prepare().url

        return Response({
            'url': url,
            'session_id': session_key
        }, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    if error:
        return JsonResponse({'error': error}, status=400)

    if not request.session.session_key:
        request.session.create()
    
    session_id = request.session.session_key
    
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if error:
        return JsonResponse({'error': error}, status=400)

    try:
        update_or_create_user_tokens(
            session_id,
            access_token, 
            token_type, 
            expires_in, 
            refresh_token
        )

        # Store session info
        request.session['spotify_authenticated'] = True
        request.session.save()

        return redirect('http://localhost:3000/Data#access_token=' + access_token + '&refresh_token=' + refresh_token + '&expires_in=' + str(expires_in)+ '&session_id=' + session_id)
    
    except Exception as e:
        print("Error updating tokens:", str(e))
        return JsonResponse({'error': str(e)}, status=500)

class SpotifyAuthenticationStatus(APIView):
    def get(self, request, format=None):
        try:
            session_id = request.GET.get('session_id')
            
            if not session_id:
                return Response({
                    'error': 'No session ID provided',
                    'status': False
                }, status=status.HTTP_400_BAD_REQUEST)
            
            is_authenticated = is_spotify_authenticated(session_id)
            
            return Response({
                'status': is_authenticated,
                'session_id': session_id
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e),
                'status': False
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SpotifyAuthenticationRequired(IsAuthenticated):
    def has_permission(self, request, view):
        return request.session.get('spotify_authenticated', False)

class UserPlaylists(APIView):
    def get(self, request, format=None):
        session_id = request.GET.get('session_id')
        access_token = request.GET.get('access_token')
        
        if not session_id or not access_token:
            return Response({'error': 'Missing session ID or access token'}, status=status.HTTP_400_BAD_REQUEST)
            
        headers = {'Authorization': f'Bearer {access_token}'}
        response = get('https://api.spotify.com/v1/me/playlists', headers=headers)
        
        if response.status_code != 200:
            return Response({'error': 'Failed to fetch playlists'}, status=response.status_code)

        return Response(response.json()['items'], status=status.HTTP_200_OK)

class UserTopItems(APIView):
    def get(self, request, format=None):
        session_id = request.GET.get('session_id')
        access_token = request.GET.get('access_token')
        
        if not session_id or not access_token:
            return Response({'error': 'Missing session ID or access token'}, status=status.HTTP_400_BAD_REQUEST)

        time_range = request.GET.get('time_range', 'medium_term')
        item_type = request.GET.get('type', 'tracks')
        
        headers = {'Authorization': f'Bearer {access_token}'}
        response = get(
            f'https://api.spotify.com/v1/me/top/{item_type}',
            headers=headers,
            params={'time_range': time_range, 'limit': 50}
        )

        if response.status_code != 200:
            return Response({'error': f'Failed to fetch top {item_type}'}, status=response.status_code)

        return Response(response.json()['items'], status=status.HTTP_200_OK)
    
class ArtistDetails(APIView):
    def get(self, request, id, format=None):  # Accept 'id' as a URL parameter
        access_token = request.GET.get('access_token')  # Still fetch 'access_token' from query params
        
        if not access_token or not id:
            return Response({'error': 'Missing access token or artist ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        headers = {'Authorization': f'Bearer {access_token}'}
        response = get(f'https://api.spotify.com/v1/artists/{id}', headers=headers)  # Use 'id' in the URL
        
        if response.status_code != 200:
            return Response({'error': 'Failed to fetch artist details'}, status=response.status_code)
        
        return Response(response.json(), status=status.HTTP_200_OK)