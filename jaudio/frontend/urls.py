from django.urls import path
from .views import index ,homepage

urlpatterns = [

    path('',index),
    path('home', homepage),
    path('join',index),
    path('create',index),
    path('room/<str:roomCode>',index),
    path('search',index),
    path('library',index),
    path('explore',index)
]

