from django.urls import path
from .views import *
from .recommendTFIDF import *
from .Kmeanrecommend import *
urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('pause', PauseSong.as_view()),
    path('play', PlaySong.as_view()),
    path('skip', SkipSong.as_view()),
    path('get-access_token', getAccessToken.as_view()),
    path('get-recommend1', GetRecommended1.as_view()),
    path('get-recommend', GetRecommended.as_view()),
    path('get-recommend2', GetRecommended2.as_view()),
]