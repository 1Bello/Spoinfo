import random
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
import json
from django.http import JsonResponse
from requests import Request, post
from .serializers import UserSerializer, PlaylistSerializer, SongSerializer, AlbumSerializer, UserSignupSerializer
from .models import User, Playlist, Song, Album

class CurrentUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        })

class UserLogin(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
        })

class UserSignup(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')

        if not username or not email or not password:
            return Response({'error': 'Please provide all required fields'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            email=email,
            username=username,
            password=password,
            phone=phone,
        )

        return Response({'message': 'User created'}, status=status.HTTP_201_CREATED)

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
        