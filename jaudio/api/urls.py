
from django.urls import path ,include
from .views import RoomView , CreateRoomView

urlpatterns = [
    path('room',RoomView.as_view()),
    path('createroom',CreateRoomView.as_view())
] 