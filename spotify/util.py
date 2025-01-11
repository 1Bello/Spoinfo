from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from typing import Optional, Union

from .models import SpotifyToken
from .credentials import CLIENT_ID, CLIENT_SECRET

BASE_URL = "https://api.spotify.com/v1/"

def get_user_tokens(session_id: str) -> Optional[SpotifyToken]:
    if not session_id:
        return None
    user_tokens = SpotifyToken.objects.filter(session_id=session_id)
    return user_tokens.first() if user_tokens.exists() else None

def update_or_create_user_tokens(
    session_id: str,
    access_token: str,
    token_type: str,
    expires_in: int,
    refresh_token: str
) -> SpotifyToken:
    if not session_id:
        raise ValueError("session_id cannot be empty")
    
    expires_at = timezone.now() + timedelta(seconds=expires_in)
    
    tokens, _ = SpotifyToken.objects.update_or_create(
        session_id=session_id,
        defaults={
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': token_type,
            'expires_in': expires_at
        }
    )
    return tokens

def is_spotify_authenticated(session_id: str) -> bool:
    tokens = get_user_tokens(session_id)
    if not tokens:
        return False
        
    is_expired = tokens.expires_in <= timezone.now()
    if is_expired:
        refreshed = refresh_spotify_token(session_id)
        return refreshed is not None
    return True

def refresh_spotify_token(session_id: str) -> Optional[SpotifyToken]:
    tokens = get_user_tokens(session_id)
    if not tokens:
        return None
    
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': tokens.refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    })
    
    if response.status_code != 200:
        return None
        
    data = response.json()
    return update_or_create_user_tokens(
        session_id=session_id,
        access_token=data['access_token'],
        token_type=data['token_type'],
        expires_in=data['expires_in'],
        refresh_token=data.get('refresh_token', tokens.refresh_token)
    )

def execute_spotify_api_request(session_id: str, endpoint: str, post_=False, put_=False, data=None) -> Optional[dict]:
    tokens = get_user_tokens(session_id)
    if not tokens:
        return None

    headers = {'Authorization': f'Bearer {tokens.access_token}'}
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if post_:
            response = post(url, headers=headers, json=data)
        elif put_:
            response = put(url, headers=headers, json=data)
        else:
            response = get(url, headers=headers)
            
        if response.status_code not in [200, 201, 204]:
            if response.status_code == 401:
                refreshed = refresh_spotify_token(session_id)
                if refreshed:
                    return execute_spotify_api_request(session_id, endpoint, post_, put_, data)
            return None
            
        return response.json() if response.status_code != 204 else {'success': True}
    except Exception:
        return None