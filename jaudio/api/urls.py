
from django.urls import path ,include
from .views import RoomView

urlpatterns = [
    path('room',RoomView.as_view())
] 