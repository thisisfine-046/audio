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

class getAccessToken(APIView):
    def get(self, request, format=None):
        access_token = get_access_token(
            self.request.session.session_key)
        return Response({'access_token': access_token}, status=status.HTTP_200_OK)



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
        song_name=album.get('name')
        song_uri=album.get('uri')
        song1 = {
            'artist_name':artist_name,
            'artist_uri':artist_uri,
            'images':album.get('images')[0].get('url'),
            'song_name':song_name,
            'song_uri':song_uri   
        }

        items2= tracks.get('items')[1]
        track2=items2.get('track')
        album2=track2.get('album')
        artist2=album2.get('artists')[0]
        artist_name2=artist2.get('name')
        artist_uri2=artist2.get('uri')
        song_name2=album2.get('name')
        song_uri2=album2.get('uri')
        song2 = {
            'artist_name':artist_name2,
            'artist_uri':artist_uri2,
            'images':album2.get('images')[0].get('url'),
            'song_name':song_name2,
            'song_uri':song_uri2   
        }

        items3= tracks.get('items')[2]
        track3=items3.get('track')
        album3=track3.get('album')
        artist3=album3.get('artists')[0]
        artist_name3=artist3.get('name')
        artist_uri3=artist3.get('uri')
        song_name3=album3.get('name')
        song_uri3=album3.get('uri')
        song3 = {
            'artist_name':artist_name3,
            'artist_uri':artist_uri3,
            'images':album3.get('images')[0].get('url'),
            'song_name':song_name3,
            'song_uri':song_uri3   
        }

        items4= tracks.get('items')[3]
        track4=items4.get('track')
        album4=track4.get('album')
        artist4=album4.get('artists')[0]
        artist_name4=artist4.get('name')
        artist_uri4=artist4.get('uri')
        song_name4=album4.get('name')
        song_uri4=album4.get('uri')
        song4 = {
            'artist_name':artist_name4,
            'artist_uri':artist_uri4,
            'images':album4.get('images')[0].get('url'),
            'song_name':song_name4,
            'song_uri':song_uri4   
        }

        items5= tracks.get('items')[4]
        track5=items5.get('track')
        album5=track5.get('album')
        artist5=album5.get('artists')[0]
        artist_name5=artist5.get('name')
        artist_uri5=artist5.get('uri')
        song_name5=album5.get('name')
        song_uri5=album5.get('uri')
        song5 = {
            'artist_name':artist_name5,
            'artist_uri':artist_uri5,
            'images':album5.get('images')[0].get('url'),
            'song_name':song_name5,
            'song_uri':song_uri5   
        }

        items6= tracks.get('items')[5]
        track6=items6.get('track')
        album6=track6.get('album')
        artist6=album6.get('artists')[0]
        artist_name6=artist6.get('name')
        artist_uri6=artist6.get('uri')
        song_name6=album6.get('name')
        song_uri6=album6.get('uri')
        song6 = {
            'artist_name':artist_name6,
            'artist_uri':artist_uri6,
            'images':album6.get('images')[0].get('url'),
            'song_name':song_name6,
            'song_uri':song_uri6   
        }

        items7= tracks.get('items')[6]
        track7=items7.get('track')
        album7=track7.get('album')
        artist7=album7.get('artists')[0]
        artist_name7=artist7.get('name')
        artist_uri7=artist7.get('uri')
        song_name7=album7.get('name')
        song_uri7=album7.get('uri')
        song7 = {
            'artist_name':artist_name7,
            'artist_uri':artist_uri7,
            'images':album7.get('images')[0].get('url'),
            'song_name':song_name7,
            'song_uri':song_uri7   
        }

        global_top = {
            'song1':song1,
            'song2': song2,
            'song3': song3,
            'song4':song4,
            'song5': song5,
            'song6': song6,
            'song7':song7
        }

        return Response(global_top, status=status.HTTP_200_OK)

class TopToday(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        playlistID = "37i9dQZF1DXcBWIGoYBM5M"
        endpoint = "playlists/" + playlistID
        response = execute_spotify_api_globaltop(host, endpoint)

        tracks = response.get('tracks')
        items= tracks.get('items')[0]
        track=items.get('track')
        album=track.get('album')
        artist=album.get('artists')[0]
        artist_name=artist.get('name')
        artist_uri=artist.get('uri')
        song_name=album.get('name')
        song_uri=album.get('uri')

        
        access_token = get_access_token(
            self.request.session.session_key)


        song1 = {
            'access_token':access_token,
            'artist_name':artist_name,
            'artist_uri':artist_uri,
            'images':album.get('images')[0].get('url'),
            'song_name':song_name,
            'song_uri':song_uri   
        }

        items2= tracks.get('items')[1]
        track2=items2.get('track')
        album2=track2.get('album')
        artist2=album2.get('artists')[0]
        artist_name2=artist2.get('name')
        artist_uri2=artist2.get('uri')
        song_name2=album2.get('name')
        song_uri2=album2.get('uri')
        song2 = {
            'access_token':access_token,
            'artist_name':artist_name2,
            'artist_uri':artist_uri2,
            'images':album2.get('images')[0].get('url'),
            'song_name':song_name2,
            'song_uri':song_uri2   
        }

        items3= tracks.get('items')[2]
        track3=items3.get('track')
        album3=track3.get('album')
        artist3=album3.get('artists')[0]
        artist_name3=artist3.get('name')
        artist_uri3=artist3.get('uri')
        song_name3=album3.get('name')
        song_uri3=album3.get('uri')
        song3 = {
            'access_token':access_token,
            'artist_name':artist_name3,
            'artist_uri':artist_uri3,
            'images':album3.get('images')[0].get('url'),
            'song_name':song_name3,
            'song_uri':song_uri3   
        }

        today_top = {
            
            'song1':song1,
            'song2': song2,
            'song3': song3,
        }
        return Response(today_top, status=status.HTTP_200_OK)




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