
from django.urls import path ,include
from .views import RoomView , CreateRoomView , GetRoom

urlpatterns = [
    path('room',RoomView.as_view()),
    path('create-room',CreateRoomView.as_view()),
    path('get-room',GetRoom.as_view())
] 