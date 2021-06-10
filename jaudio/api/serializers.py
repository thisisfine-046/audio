from rest_framework import serializers
from .models import Room
from .models import PlayListName


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause',
                  'votes_to_skip', 'created_at')


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')


class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')



class PlaylistNameSerializer(serializers.ModelSerializer):
    class Meta:
        model= PlayListName
        fields = ('PlayListName')

class UpdatePlaylistNameSerializer(serializers.ModelSerializer):
    class Meta:
        model= PlayListName
        fields = ('PlayListName')