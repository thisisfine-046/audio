from django.urls import path
from .views import index , homepage , login , loginspotify

app_name = 'frontend'

urlpatterns = [

    path('', index , name= ''),
    path('home', homepage),

    path('roompage', index),

    path('login',loginspotify),
    path('join',index),
    path('create',index),
    path('room/<str:roomCode>',index),
    path('search',index),
    path('library',index),
    path('explore',index)
]

