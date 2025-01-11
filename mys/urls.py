from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('current-user/', views.CurrentUser.as_view(), name='current-user'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('signup/', views.UserSignup.as_view(), name='signup'),
    path('users/', views.UserListCreate.as_view(), name='user-list-create'),
    path('users/<int:pk>/', views.UserRetrieveUpdateDestroy.as_view(), name='user-retrieve-update-destroy'),
    path('api-token-auth/', obtain_auth_token, name='api-token-auth'),
    
]
