from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room
from .models import Vote
from django.http import JsonResponse




class AuthURL(APIView):
    def get(self, request, fornat=None):
        scopes =  "user-read-email " \
        + "user-read-private user-modify-playback-state " \
        + "user-top-read user-read-playback-state streaming " \
        + "playlist-modify-public playlist-read-private playlist-modify-private " \
        + "user-follow-read user-library-read user-read-recently-played " \
        + "playlist-read-collaborative " \
        + "user-read-currently-playing " \


        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)

        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': room.votes_to_skip,
            'id': song_id
        }

        self.update_room_song(room, song_id)

        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=room).delete()


class NewReleases(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "browse/new-releases"
        response = execute_spotify_api_newrelease(host, endpoint)

        albums = response.get('albums')
        href=albums.get('href')
        # items = albums.get('items')
        # artist=items.get('artists')

        # a = 0

        # for i in enumerate(albums.get('items')):
        #     items = albums.get('items')
        items1 = albums.get('items')[0]
        artist1=items1.get('artists')[0]

        song1 = {
            'artist_name':artist1.get('name'),
            'images':items1.get('images')[0].get('url'),
            'song_name':items1.get('name'),
            'song_id':items1.get('id'),
            'song_uri':items1.get('uri')
        }

        items2 = albums.get('items')[1]
        artist2=items2.get('artists')[0]

        song2 = {
            'artist_name':artist2.get('name'),
            'images':items2.get('images')[0].get('url'),
            'song_name':items2.get('name'),
            'song_id':items2.get('id'),
            'song_uri':items2.get('uri')
        }

        items3 = albums.get('items')[2]
        artist3=items3.get('artists')[0]

        song3 = {
            'artist_name':artist3.get('name'),
            'images':items3.get('images')[0].get('url'),
            'song_name':items3.get('name'),
            'song_id':items3.get('id'),
            'song_uri':items3.get('uri')
        }

        items4 = albums.get('items')[3]
        artist4=items4.get('artists')[0]

        song4 = {
            'artist_name':artist4.get('name'),
            'images':items4.get('images')[0].get('url'),
            'song_name':items4.get('name'),
            'song_id':items4.get('id'),
            'song_uri':items4.get('uri')
        }

        items5 = albums.get('items')[4]
        artist5=items5.get('artists')[0]

        song5 = {
            'artist_name':artist5.get('name'),
            'images':items5.get('images')[0].get('url'),
            'song_name':items5.get('name'),
            'song_id':items5.get('id'),
            'song_uri':items5.get('uri')
        }

        items6 = albums.get('items')[5]
        artist6=items6.get('artists')[0]

        song6 = {
            'artist_name':artist6.get('name'),
            'images':items6.get('images')[0].get('url'),
            'song_name':items6.get('name'),
            'song_id':items6.get('id'),
            'song_uri':items6.get('uri')
        }

        items7 = albums.get('items')[6]
        artist7=items7.get('artists')[0]

        song7 = {
            'artist_name':artist7.get('name'),
            'images':items7.get('images')[0].get('url'),
            'song_name':items7.get('name'),
            'song_id':items7.get('id'),
            'song_uri':items7.get('uri')
        }


        new_release = {
            'song1':song1,
            'song2': song2,
            'song3': song3,
            'song4':song4,
            'song5': song5,
            'song6': song6,
            'song7':song7
    

        }

        return Response(new_release, status=status.HTTP_200_OK)

class GlobalTop(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        playlistID = "37i9dQZEVXbMDoHDwVN2tF"
        endpoint = "playlists/" + playlistID
        response = execute_spotify_api_globaltop(host, endpoint)

        tracks = response.get('tracks')
        items= tracks.get('items')[0]
        track=items.get('track')
        album=track.get('album')
        artist=album.get('artists')[0]
        artist_name=artist.get('name')
        artist_uri=artist.get('uri')
        track_id=album.get('id')
        song_name=album.get('name')
        song_uri=album.get('uri')
        song = {
            'artist_name':artist_name,
            'artist_uri':artist_uri,
            'images':album.get('images')[0].get('url'),
            'song_name':song_name,
            'song_id':track_id,
            'song_uri':song_uri
            
        }


        return Response(song, status=status.HTTP_200_OK)





































class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        return Response({}, status=status.HTTP_403_FORBIDDEN)


class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            skip_song(room.host)
        else:
            vote = Vote(user=self.request.session.session_key,
                        room=room, song_id=room.current_song)
            vote.save()

        return Response({}, status.HTTP_204_NO_CONTENT)