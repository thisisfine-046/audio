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
from .recommendTFIDF import *
import string
import re

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
        items1 = albums.get('items')[0]
        album_type=items1.get('album_type')
        artist1=items1.get('artists')[0]


        song1 = {
            'artist_name':artist1.get('name'),
            'images':items1.get('images')[0].get('url'),
            'song_name':items1.get('name'),
            'song_id':items1.get('id'),
            'song_uri':items1.get('uri'),
            'album-type':album_type
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
        song_name=track.get('name')
        song_duration=track.get('duration_ms')
        song_uri=track.get('uri')
        album=track.get('album')
        artist=album.get('artists')[0]
        artist_uri=artist.get('uri')
        album_name=album.get('name')
        album_uri=album.get('uri')

        artist_string = ""

        for i, artist in enumerate(track.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name
        
        song1 = {
            'artist_name':artist_string,
            'artist_uri':artist_uri,
            'images':album.get('images')[0].get('url'),
            'album_name':album_name,
            'album_uri':album_uri,
            'song_name':song_name  ,
            'song_duration':song_duration,
            'song_uri':song_uri
        }


        items2= tracks.get('items')[1]
        track2=items2.get('track')
        song_name2=track2.get('name')
        song_duration2=track2.get('duration_ms')
        song_uri2=track2.get('uri')
        album2=track2.get('album')
        artist2=album2.get('artists')[0]
        artist_uri2=artist2.get('uri')
        album_name2=album2.get('name')
        album_uri2=album2.get('uri')

        artist_string2 = ""

        for i, artist2 in enumerate(track2.get('artists')):
            if i > 0:
                artist_string2 += ", "
            name2 = artist2.get('name')
            artist_string2 += name2 

        song2 = {
            'artist_name':artist_string2,
            'artist_uri':artist_uri2,
            'images':album2.get('images')[0].get('url'),
            'album_name':album_name2,
            'album_uri':album_uri2 ,
            'song_name':song_name2  ,
            'song_duration':song_duration2,
            'song_uri':song_uri2 
        }

        items3= tracks.get('items')[2]
        track3=items3.get('track')
        song_name3=track3.get('name')
        song_duration3=track3.get('duration_ms')
        song_uri3=track3.get('uri')
        album3=track3.get('album')
        artist3=album3.get('artists')[0]
        artist_uri3=artist3.get('uri')
        album_name3=album3.get('name')
        album_uri3=album3.get('uri')

        artist_string3 = ""

        for i, artist3 in enumerate(track3.get('artists')):
            if i > 0:
                artist_string3 += ", "
            name3 = artist3.get('name')
            artist_string3 += name3 

        song3 = {
            'artist_name':artist_string3,
            'artist_uri':artist_uri3,
            'images':album3.get('images')[0].get('url'),
            'album_name':album_name3,
            'album_uri':album_uri3 ,  
            'song_name':song_name3  ,
            'song_duration':song_duration3,
            'song_uri':song_uri3 
        }

        items4= tracks.get('items')[3]
        track4=items4.get('track')
        song_name4=track4.get('name')
        song_duration4=track4.get('duration_ms')
        song_uri4=track4.get('uri')
        album4=track4.get('album')
        artist4=album4.get('artists')[0]
        artist_uri4=artist4.get('uri')
        album_name4=album4.get('name')
        album_uri4=album4.get('uri')

        artist_string4 = ""

        for i, artist4 in enumerate(track4.get('artists')):
            if i > 0:
                artist_string4 += ", "
            name4 = artist4.get('name')
            artist_string4 += name4 

        song4 = {
            'artist_name':artist_string4 ,
            'artist_uri':artist_uri4,
            'images':album4.get('images')[0].get('url'),
            'album_name':album_name4,
            'album_uri':album_uri4   ,
            'song_name':song_name4  ,
            'song_duration':song_duration4,
            'song_uri':song_uri4 
        }

        items5= tracks.get('items')[4]
        track5=items5.get('track')
        song_name5=track5.get('name')
        song_duration5=track5.get('duration_ms')
        song_uri5=track5.get('uri')
        album5=track5.get('album')
        artist5=album5.get('artists')[0]
        artist_uri5=artist5.get('uri')
        album_name5=album5.get('name')
        album_uri5=album5.get('uri')

        artist_string5 = ""

        for i, artist5 in enumerate(track5.get('artists')):
            if i > 0:
                artist_string5 += ", "
            name5 = artist5.get('name')
            artist_string5 += name5 

        song5 = {
            'artist_name':artist_string5,
            'artist_uri':artist_uri5,
            'images':album5.get('images')[0].get('url'),
            'album_name':album_name5,
            'album_uri':album_uri5 ,
            'song_name':song_name5  ,
            'song_duration':song_duration5,
            'song_uri':song_uri5   
        }

        items6= tracks.get('items')[5]
        track6=items6.get('track')
        song_name6=track6.get('name')
        song_duration6=track6.get('duration_ms')
        song_uri6=track6.get('uri')
        album6=track6.get('album')
        artist6=album6.get('artists')[0]
        artist_uri6=artist6.get('uri')
        album_name6=album6.get('name')
        album_uri6=album6.get('uri')
        
        artist_string6 = ""

        for i, artist6 in enumerate(track6.get('artists')):
            if i > 0:
                artist_string6 += ", "
            name6= artist6.get('name')
            artist_string6 += name6 

        song6 = {
            'artist_name':artist_string6,
            'artist_uri':artist_uri6,
            'images':album6.get('images')[0].get('url'),
            'album_name':album_name6,
            'album_uri':album_uri6 ,
            'song_name':song_name6  ,
            'song_duration':song_duration6,
            'song_uri':song_uri6   
        }

        items7= tracks.get('items')[6]
        track7=items7.get('track')
        song_name7=track7.get('name')
        song_duration7=track7.get('duration_ms')
        song_uri7=track7.get('uri')
        album7=track7.get('album')
        artist7=album7.get('artists')[0]
        artist_uri7=artist7.get('uri')
        album_name7=album7.get('name')
        album_uri7=album7.get('uri')
                
        artist_string7 = ""

        for i, artist7 in enumerate(track7.get('artists')):
            if i > 0:
                artist_string7 += ", "
            name7= artist7.get('name')
            artist_string7 += name7 

        song7 = {
            'artist_name':artist_string7,
            'artist_uri':artist_uri7,
            'images':album7.get('images')[0].get('url'),
            'album_name':album_name7,
            'album_uri':album_uri7   ,
            'song_name':song_name7  ,
            'song_duration':song_duration7,
            'song_uri':song_uri7 
        }


        items8= tracks.get('items')[7]
        track8=items8.get('track')
        song_name8=track8.get('name')
        song_duration8=track8.get('duration_ms')
        song_uri8=track8.get('uri')
        album8=track8.get('album')
        artist8=album8.get('artists')[0]
        artist_uri8=artist8.get('uri')
        album_name8=album8.get('name')
        album_uri8=album8.get('uri')

        artist_string8 = ""

        for i, artist8 in enumerate(track8.get('artists')):
            if i > 0:
                artist_string8 += ", "
            name8 = artist8.get('name')
            artist_string8 += name8
        
        song8 = {
            'artist_name':artist_string8,
            'artist_uri':artist_uri8,
            'images':album8.get('images')[0].get('url'),
            'album_name':album_name8,
            'album_uri':album_uri8,
            'song_name':song_name8  ,
            'song_duration':song_duration8,
            'song_uri':song_uri8
        }


        items9= tracks.get('items')[8]
        track9=items9.get('track')
        song_name9=track9.get('name')
        song_duration9=track9.get('duration_ms')
        song_uri9=track9.get('uri')
        album9=track9.get('album')
        artist9=album9.get('artists')[0]
        artist_uri9=artist9.get('uri')
        album_name9=album9.get('name')
        album_uri9=album9.get('uri')

        artist_string9 = ""

        for i, artist9 in enumerate(track9.get('artists')):
            if i > 0:
                artist_string9 += ", "
            name9 = artist9.get('name')
            artist_string9 += name9

        song9 = {
            'artist_name':artist_string9,
            'artist_uri':artist_uri9,
            'images':album9.get('images')[0].get('url'),
            'album_name':album_name9,
            'album_uri':album_uri9 ,
            'song_name':song_name9  ,
            'song_duration':song_duration9,
            'song_uri':song_uri9 
        }

        items10= tracks.get('items')[9]
        track10=items10.get('track')
        song_name10=track10.get('name')
        song_duration10=track10.get('duration_ms')
        song_uri10=track10.get('uri')
        album10=track10.get('album')
        artist10=album10.get('artists')[0]
        artist_uri10=artist10.get('uri')
        album_name10=album10.get('name')
        album_uri10=album10.get('uri')

        artist_string10 = ""

        for i, artist10 in enumerate(track10.get('artists')):
            if i > 0:
                artist_string10 += ", "
            name10 = artist10.get('name')
            artist_string10 += name10 

        song10 = {
            'artist_name':artist_string10,
            'artist_uri':artist_uri10,
            'images':album10.get('images')[0].get('url'),
            'album_name':album_name10,
            'album_uri':album_uri10 ,  
            'song_name':song_name10  ,
            'song_duration':song_duration10,
            'song_uri':song_uri10
        }

        items11= tracks.get('items')[10]
        track11=items11.get('track')
        song_name11=track11.get('name')
        song_duration11=track11.get('duration_ms')
        song_uri11=track11.get('uri')
        album11=track11.get('album')
        artist11=album11.get('artists')[0]
        artist_uri11=artist11.get('uri')
        album_name11=album11.get('name')
        album_uri11=album11.get('uri')

        artist_string11 = ""

        for i, artist11 in enumerate(track11.get('artists')):
            if i > 0:
                artist_string11 += ", "
            name11 = artist11.get('name')
            artist_string11 += name11 

        song11 = {
            'artist_name':artist_string11 ,
            'artist_uri':artist_uri11,
            'images':album11.get('images')[0].get('url'),
            'album_name':album_name11,
            'album_uri':album_uri11   ,
            'song_name':song_name11  ,
            'song_duration':song_duration11,
            'song_uri':song_uri11 
        }

        items12= tracks.get('items')[11]
        track12=items12.get('track')
        song_name12=track12.get('name')
        song_duration12=track12.get('duration_ms')
        song_uri12=track12.get('uri')
        album12=track12.get('album')
        artist12=album12.get('artists')[0]
        artist_uri12=artist12.get('uri')
        album_name12=album12.get('name')
        album_uri12=album12.get('uri')

        artist_string12 = ""

        for i, artist12 in enumerate(track12.get('artists')):
            if i > 0:
                artist_string12 += ", "
            name12 = artist12.get('name')
            artist_string12 += name12 

        song12 = {
            'artist_name':artist_string12,
            'artist_uri':artist_uri12,
            'images':album12.get('images')[0].get('url'),
            'album_name':album_name12,
            'album_uri':album_uri12 ,
            'song_name':song_name12  ,
            'song_duration':song_duration12,
            'song_uri':song_uri12   
        }

        items13= tracks.get('items')[12]
        track13=items13.get('track')
        song_name13=track13.get('name')
        song_duration13=track13.get('duration_ms')
        song_uri13=track13.get('uri')
        album13=track13.get('album')
        artist13=album13.get('artists')[0]
        artist_uri13=artist13.get('uri')
        album_name13=album13.get('name')
        album_uri13=album13.get('uri')
        
        artist_string13 = ""

        for i, artist13 in enumerate(track13.get('artists')):
            if i > 0:
                artist_string13 += ", "
            name13= artist13.get('name')
            artist_string13 += name13 

        song13 = {
            'artist_name':artist_string13,
            'artist_uri':artist_uri13,
            'images':album13.get('images')[0].get('url'),
            'album_name':album_name13,
            'album_uri':album_uri13 ,
            'song_name':song_name13  ,
            'song_duration':song_duration13,
            'song_uri':song_uri13   
        }

        items14= tracks.get('items')[13]
        track14=items14.get('track')
        song_name14=track14.get('name')
        song_duration14=track14.get('duration_ms')
        song_uri14=track14.get('uri')
        album14=track14.get('album')
        artist14=album14.get('artists')[0]
        artist_uri14=artist14.get('uri')
        album_name14=album14.get('name')
        album_uri14=album14.get('uri')
                
        artist_string14 = ""

        for i, artist14 in enumerate(track14.get('artists')):
            if i > 0:
                artist_string14 += ", "
            name14= artist14.get('name')
            artist_string14 += name14 

        song14 = {
            'artist_name':artist_string14,
            'artist_uri':artist_uri14,
            'images':album14.get('images')[0].get('url'),
            'album_name':album_name14,
            'album_uri':album_uri14   ,
            'song_name':song_name14  ,
            'song_duration':song_duration14,
            'song_uri':song_uri14 
        }

        items15= tracks.get('items')[14]
        track15=items15.get('track')
        song_name15=track15.get('name')
        song_duration15=track15.get('duration_ms')
        song_uri15=track15.get('uri')
        album15=track15.get('album')
        artist15=album15.get('artists')[0]
        artist_uri15=artist15.get('uri')
        album_name15=album15.get('name')
        album_uri15=album15.get('uri')

        artist_string15 = ""

        for i, artist15 in enumerate(track15.get('artists')):
            if i > 0:
                artist_string15 += ", "
            name15 = artist15.get('name')
            artist_string15 += name15
        
        song15 = {
            'artist_name':artist_string15,
            'artist_uri':artist_uri15,
            'images':album15.get('images')[0].get('url'),
            'album_name':album_name15,
            'album_uri':album_uri15,
            'song_name':song_name15  ,
            'song_duration':song_duration15,
            'song_uri':song_uri15
        }


        items16= tracks.get('items')[15]
        track16=items16.get('track')
        song_name16=track16.get('name')
        song_duration16=track16.get('duration_ms')
        song_uri16=track16.get('uri')
        album16=track16.get('album')
        artist16=album16.get('artists')[0]
        artist_uri16=artist16.get('uri')
        album_name16=album16.get('name')
        album_uri16=album16.get('uri')

        artist_string16 = ""

        for i, artist16 in enumerate(track16.get('artists')):
            if i > 0:
                artist_string16 += ", "
            name16 = artist16.get('name')
            artist_string16 += name16 

        song16 = {
            'artist_name':artist_string16,
            'artist_uri':artist_uri16,
            'images':album16.get('images')[0].get('url'),
            'album_name':album_name16,
            'album_uri':album_uri16 ,
            'song_name':song_name16  ,
            'song_duration':song_duration16,
            'song_uri':song_uri16 
        }

        items17= tracks.get('items')[16]
        track17=items17.get('track')
        song_name17=track17.get('name')
        song_duration17=track17.get('duration_ms')
        song_uri17=track17.get('uri')
        album17=track17.get('album')
        artist17=album17.get('artists')[0]
        artist_uri17=artist17.get('uri')
        album_name17=album17.get('name')
        album_uri17=album17.get('uri')

        artist_string17 = ""

        for i, artist17 in enumerate(track17.get('artists')):
            if i > 0:
                artist_string17 += ", "
            name17 = artist17.get('name')
            artist_string17 += name17 

        song17 = {
            'artist_name':artist_string17,
            'artist_uri':artist_uri17,
            'images':album17.get('images')[0].get('url'),
            'album_name':album_name17,
            'album_uri':album_uri17 ,  
            'song_name':song_name17  ,
            'song_duration':song_duration17,
            'song_uri':song_uri17
        }

        items18= tracks.get('items')[17]
        track18=items18.get('track')
        song_name18=track18.get('name')
        song_duration18=track18.get('duration_ms')
        song_uri18=track18.get('uri')
        album18=track18.get('album')
        artist18=album18.get('artists')[0]
        artist_uri18=artist18.get('uri')
        album_name18=album18.get('name')
        album_uri18=album18.get('uri')

        artist_string18 = ""

        for i, artist18 in enumerate(track18.get('artists')):
            if i > 0:
                artist_string18 += ", "
            name18 = artist18.get('name')
            artist_string18 += name18 

        song18 = {
            'artist_name':artist_string18 ,
            'artist_uri':artist_uri18,
            'images':album18.get('images')[0].get('url'),
            'album_name':album_name18,
            'album_uri':album_uri18   ,
            'song_name':song_name18  ,
            'song_duration':song_duration18,
            'song_uri':song_uri18 
        }

        items19= tracks.get('items')[18]
        track19=items19.get('track')
        song_name19=track19.get('name')
        song_duration19=track19.get('duration_ms')
        song_uri19=track19.get('uri')
        album19=track19.get('album')
        artist19=album19.get('artists')[0]
        artist_uri19=artist19.get('uri')
        album_name19=album19.get('name')
        album_uri19=album19.get('uri')

        artist_string19 = ""

        for i, artist19 in enumerate(track19.get('artists')):
            if i > 0:
                artist_string19 += ", "
            name19 = artist19.get('name')
            artist_string19 += name19 

        song19 = {
            'artist_name':artist_string19,
            'artist_uri':artist_uri19,
            'images':album19.get('images')[0].get('url'),
            'album_name':album_name19,
            'album_uri':album_uri19 ,
            'song_name':song_name19  ,
            'song_duration':song_duration19,
            'song_uri':song_uri19   
        }

        items20= tracks.get('items')[19]
        track20=items20.get('track')
        song_name20=track20.get('name')
        song_duration20=track20.get('duration_ms')
        song_uri20=track20.get('uri')
        album20=track20.get('album')
        artist20=album20.get('artists')[0]
        artist_uri20=artist20.get('uri')
        album_name20=album20.get('name')
        album_uri20=album20.get('uri')
        
        artist_string20 = ""

        for i, artist20 in enumerate(track20.get('artists')):
            if i > 0:
                artist_string20 += ", "
            name20= artist20.get('name')
            artist_string20 += name20 

        song20 = {
            'artist_name':artist_string20,
            'artist_uri':artist_uri20,
            'images':album20.get('images')[0].get('url'),
            'album_name':album_name20,
            'album_uri':album_uri20 ,
            'song_name':song_name20  ,
            'song_duration':song_duration20,
            'song_uri':song_uri20   
        }

        global_top = {
            'song1':song1,
            'song2': song2,
            'song3': song3,
            'song4':song4,
            'song5': song5,
            'song6': song6,
            'song7':song7,
            'song8':song8,
            'song9': song9,
            'song10': song10,
            'song11':song11,
            'song12': song12,
            'song13': song13,
            'song14':song14,
            'song15':song15,
            'song16': song16,
            'song17': song17,
            'song18':song18,
            'song19': song19,
            'song20': song20
        
        }

        return Response( global_top, status=status.HTTP_200_OK)

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
        song_name=track.get('name')
        song_duration=track.get('duration_ms')
        song_uri=track.get('uri')
        album=track.get('album')
        artist=album.get('artists')[0]
        artist_uri=artist.get('uri')
        album_name=album.get('name')
        album_uri=album.get('uri')

        artist_string = ""

        for i, artist in enumerate(track.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name
        
        song1 = {
            'artist_name':artist_string,
            'artist_uri':artist_uri,
            'images':album.get('images')[0].get('url'),
            'album_name':album_name,
            'album_uri':album_uri,
            'song_name':song_name  ,
            'song_duration':song_duration,
            'song_uri':song_uri
        }


        items2= tracks.get('items')[1]
        track2=items2.get('track')
        song_name2=track2.get('name')
        song_duration2=track2.get('duration_ms')
        song_uri2=track2.get('uri')
        album2=track2.get('album')
        artist2=album2.get('artists')[0]
        artist_uri2=artist2.get('uri')
        album_name2=album2.get('name')
        album_uri2=album2.get('uri')

        artist_string2 = ""

        for i, artist2 in enumerate(track2.get('artists')):
            if i > 0:
                artist_string2 += ", "
            name2 = artist2.get('name')
            artist_string2 += name2 

        song2 = {
            'artist_name':artist_string2,
            'artist_uri':artist_uri2,
            'images':album2.get('images')[0].get('url'),
            'album_name':album_name2,
            'album_uri':album_uri2 ,
            'song_name':song_name2  ,
            'song_duration':song_duration2,
            'song_uri':song_uri2 
        }

        items3= tracks.get('items')[2]
        track3=items3.get('track')
        song_name3=track3.get('name')
        song_duration3=track3.get('duration_ms')
        song_uri3=track3.get('uri')
        album3=track3.get('album')
        artist3=album3.get('artists')[0]
        artist_uri3=artist3.get('uri')
        album_name3=album3.get('name')
        album_uri3=album3.get('uri')

        artist_string3 = ""

        for i, artist3 in enumerate(track3.get('artists')):
            if i > 0:
                artist_string3 += ", "
            name3 = artist3.get('name')
            artist_string3 += name3 

        song3 = {
            'artist_name':artist_string3,
            'artist_uri':artist_uri3,
            'images':album3.get('images')[0].get('url'),
            'album_name':album_name3,
            'album_uri':album_uri3 ,  
            'song_name':song_name3  ,
            'song_duration':song_duration3,
            'song_uri':song_uri3 
        }

        items4= tracks.get('items')[3]
        track4=items4.get('track')
        song_name4=track4.get('name')
        song_duration4=track4.get('duration_ms')
        song_uri4=track4.get('uri')
        album4=track4.get('album')
        artist4=album4.get('artists')[0]
        artist_uri4=artist4.get('uri')
        album_name4=album4.get('name')
        album_uri4=album4.get('uri')

        artist_string4 = ""

        for i, artist4 in enumerate(track4.get('artists')):
            if i > 0:
                artist_string4 += ", "
            name4 = artist4.get('name')
            artist_string4 += name4 

        song4 = {
            'artist_name':artist_string4 ,
            'artist_uri':artist_uri4,
            'images':album4.get('images')[0].get('url'),
            'album_name':album_name4,
            'album_uri':album_uri4   ,
            'song_name':song_name4  ,
            'song_duration':song_duration4,
            'song_uri':song_uri4 
        }

        items5= tracks.get('items')[4]
        track5=items5.get('track')
        song_name5=track5.get('name')
        song_duration5=track5.get('duration_ms')
        song_uri5=track5.get('uri')
        album5=track5.get('album')
        artist5=album5.get('artists')[0]
        artist_uri5=artist5.get('uri')
        album_name5=album5.get('name')
        album_uri5=album5.get('uri')

        artist_string5 = ""

        for i, artist5 in enumerate(track5.get('artists')):
            if i > 0:
                artist_string5 += ", "
            name5 = artist5.get('name')
            artist_string5 += name5 

        song5 = {
            'artist_name':artist_string5,
            'artist_uri':artist_uri5,
            'images':album5.get('images')[0].get('url'),
            'album_name':album_name5,
            'album_uri':album_uri5 ,
            'song_name':song_name5  ,
            'song_duration':song_duration5,
            'song_uri':song_uri5   
        }

        items6= tracks.get('items')[5]
        track6=items6.get('track')
        song_name6=track6.get('name')
        song_duration6=track6.get('duration_ms')
        song_uri6=track6.get('uri')
        album6=track6.get('album')
        artist6=album6.get('artists')[0]
        artist_uri6=artist6.get('uri')
        album_name6=album6.get('name')
        album_uri6=album6.get('uri')
        
        artist_string6 = ""

        for i, artist6 in enumerate(track6.get('artists')):
            if i > 0:
                artist_string6 += ", "
            name6= artist6.get('name')
            artist_string6 += name6 

        song6 = {
            'artist_name':artist_string6,
            'artist_uri':artist_uri6,
            'images':album6.get('images')[0].get('url'),
            'album_name':album_name6,
            'album_uri':album_uri6 ,
            'song_name':song_name6  ,
            'song_duration':song_duration6,
            'song_uri':song_uri6   
        }

        items7= tracks.get('items')[6]
        track7=items7.get('track')
        song_name7=track7.get('name')
        song_duration7=track7.get('duration_ms')
        song_uri7=track7.get('uri')
        album7=track7.get('album')
        artist7=album7.get('artists')[0]
        artist_uri7=artist7.get('uri')
        album_name7=album7.get('name')
        album_uri7=album7.get('uri')
                
        artist_string7 = ""

        for i, artist7 in enumerate(track7.get('artists')):
            if i > 0:
                artist_string7 += ", "
            name7= artist7.get('name')
            artist_string7 += name7 

        song7 = {
            'artist_name':artist_string7,
            'artist_uri':artist_uri7,
            'images':album7.get('images')[0].get('url'),
            'album_name':album_name7,
            'album_uri':album_uri7   ,
            'song_name':song_name7  ,
            'song_duration':song_duration7,
            'song_uri':song_uri7 
        }


        items8= tracks.get('items')[7]
        track8=items8.get('track')
        song_name8=track8.get('name')
        song_duration8=track8.get('duration_ms')
        song_uri8=track8.get('uri')
        album8=track8.get('album')
        artist8=album8.get('artists')[0]
        artist_uri8=artist8.get('uri')
        album_name8=album8.get('name')
        album_uri8=album8.get('uri')

        artist_string8 = ""

        for i, artist8 in enumerate(track8.get('artists')):
            if i > 0:
                artist_string8 += ", "
            name8 = artist8.get('name')
            artist_string8 += name8
        
        song8 = {
            'artist_name':artist_string8,
            'artist_uri':artist_uri8,
            'images':album8.get('images')[0].get('url'),
            'album_name':album_name8,
            'album_uri':album_uri8,
            'song_name':song_name8  ,
            'song_duration':song_duration8,
            'song_uri':song_uri8
        }


        items9= tracks.get('items')[8]
        track9=items9.get('track')
        song_name9=track9.get('name')
        song_duration9=track9.get('duration_ms')
        song_uri9=track9.get('uri')
        album9=track9.get('album')
        artist9=album9.get('artists')[0]
        artist_uri9=artist9.get('uri')
        album_name9=album9.get('name')
        album_uri9=album9.get('uri')

        artist_string9 = ""

        for i, artist9 in enumerate(track9.get('artists')):
            if i > 0:
                artist_string9 += ", "
            name9 = artist9.get('name')
            artist_string9 += name9

        song9 = {
            'artist_name':artist_string9,
            'artist_uri':artist_uri9,
            'images':album9.get('images')[0].get('url'),
            'album_name':album_name9,
            'album_uri':album_uri9 ,
            'song_name':song_name9  ,
            'song_duration':song_duration9,
            'song_uri':song_uri9 
        }

        items10= tracks.get('items')[9]
        track10=items10.get('track')
        song_name10=track10.get('name')
        song_duration10=track10.get('duration_ms')
        song_uri10=track10.get('uri')
        album10=track10.get('album')
        artist10=album10.get('artists')[0]
        artist_uri10=artist10.get('uri')
        album_name10=album10.get('name')
        album_uri10=album10.get('uri')

        artist_string10 = ""

        for i, artist10 in enumerate(track10.get('artists')):
            if i > 0:
                artist_string10 += ", "
            name10 = artist10.get('name')
            artist_string10 += name10 

        song10 = {
            'artist_name':artist_string10,
            'artist_uri':artist_uri10,
            'images':album10.get('images')[0].get('url'),
            'album_name':album_name10,
            'album_uri':album_uri10 ,  
            'song_name':song_name10  ,
            'song_duration':song_duration10,
            'song_uri':song_uri10
        }

        items11= tracks.get('items')[10]
        track11=items11.get('track')
        song_name11=track11.get('name')
        song_duration11=track11.get('duration_ms')
        song_uri11=track11.get('uri')
        album11=track11.get('album')
        artist11=album11.get('artists')[0]
        artist_uri11=artist11.get('uri')
        album_name11=album11.get('name')
        album_uri11=album11.get('uri')

        artist_string11 = ""

        for i, artist11 in enumerate(track11.get('artists')):
            if i > 0:
                artist_string11 += ", "
            name11 = artist11.get('name')
            artist_string11 += name11 

        song11 = {
            'artist_name':artist_string11 ,
            'artist_uri':artist_uri11,
            'images':album11.get('images')[0].get('url'),
            'album_name':album_name11,
            'album_uri':album_uri11   ,
            'song_name':song_name11  ,
            'song_duration':song_duration11,
            'song_uri':song_uri11 
        }

        items12= tracks.get('items')[11]
        track12=items12.get('track')
        song_name12=track12.get('name')
        song_duration12=track12.get('duration_ms')
        song_uri12=track12.get('uri')
        album12=track12.get('album')
        artist12=album12.get('artists')[0]
        artist_uri12=artist12.get('uri')
        album_name12=album12.get('name')
        album_uri12=album12.get('uri')

        artist_string12 = ""

        for i, artist12 in enumerate(track12.get('artists')):
            if i > 0:
                artist_string12 += ", "
            name12 = artist12.get('name')
            artist_string12 += name12 

        song12 = {
            'artist_name':artist_string12,
            'artist_uri':artist_uri12,
            'images':album12.get('images')[0].get('url'),
            'album_name':album_name12,
            'album_uri':album_uri12 ,
            'song_name':song_name12  ,
            'song_duration':song_duration12,
            'song_uri':song_uri12   
        }

        items13= tracks.get('items')[12]
        track13=items13.get('track')
        song_name13=track13.get('name')
        song_duration13=track13.get('duration_ms')
        song_uri13=track13.get('uri')
        album13=track13.get('album')
        artist13=album13.get('artists')[0]
        artist_uri13=artist13.get('uri')
        album_name13=album13.get('name')
        album_uri13=album13.get('uri')
        
        artist_string13 = ""

        for i, artist13 in enumerate(track13.get('artists')):
            if i > 0:
                artist_string13 += ", "
            name13= artist13.get('name')
            artist_string13 += name13 

        song13 = {
            'artist_name':artist_string13,
            'artist_uri':artist_uri13,
            'images':album13.get('images')[0].get('url'),
            'album_name':album_name13,
            'album_uri':album_uri13 ,
            'song_name':song_name13  ,
            'song_duration':song_duration13,
            'song_uri':song_uri13   
        }

        items14= tracks.get('items')[13]
        track14=items14.get('track')
        song_name14=track14.get('name')
        song_duration14=track14.get('duration_ms')
        song_uri14=track14.get('uri')
        album14=track14.get('album')
        artist14=album14.get('artists')[0]
        artist_uri14=artist14.get('uri')
        album_name14=album14.get('name')
        album_uri14=album14.get('uri')
                
        artist_string14 = ""

        for i, artist14 in enumerate(track14.get('artists')):
            if i > 0:
                artist_string14 += ", "
            name14= artist14.get('name')
            artist_string14 += name14 

        song14 = {
            'artist_name':artist_string14,
            'artist_uri':artist_uri14,
            'images':album14.get('images')[0].get('url'),
            'album_name':album_name14,
            'album_uri':album_uri14   ,
            'song_name':song_name14  ,
            'song_duration':song_duration14,
            'song_uri':song_uri14 
        }

        items15= tracks.get('items')[14]
        track15=items15.get('track')
        song_name15=track15.get('name')
        song_duration15=track15.get('duration_ms')
        song_uri15=track15.get('uri')
        album15=track15.get('album')
        artist15=album15.get('artists')[0]
        artist_uri15=artist15.get('uri')
        album_name15=album15.get('name')
        album_uri15=album15.get('uri')

        artist_string15 = ""

        for i, artist15 in enumerate(track15.get('artists')):
            if i > 0:
                artist_string15 += ", "
            name15 = artist15.get('name')
            artist_string15 += name15
        
        song15 = {
            'artist_name':artist_string15,
            'artist_uri':artist_uri15,
            'images':album15.get('images')[0].get('url'),
            'album_name':album_name15,
            'album_uri':album_uri15,
            'song_name':song_name15  ,
            'song_duration':song_duration15,
            'song_uri':song_uri15
        }


        items16= tracks.get('items')[15]
        track16=items16.get('track')
        song_name16=track16.get('name')
        song_duration16=track16.get('duration_ms')
        song_uri16=track16.get('uri')
        album16=track16.get('album')
        artist16=album16.get('artists')[0]
        artist_uri16=artist16.get('uri')
        album_name16=album16.get('name')
        album_uri16=album16.get('uri')

        artist_string16 = ""

        for i, artist16 in enumerate(track16.get('artists')):
            if i > 0:
                artist_string16 += ", "
            name16 = artist16.get('name')
            artist_string16 += name16 

        song16 = {
            'artist_name':artist_string16,
            'artist_uri':artist_uri16,
            'images':album16.get('images')[0].get('url'),
            'album_name':album_name16,
            'album_uri':album_uri16 ,
            'song_name':song_name16  ,
            'song_duration':song_duration16,
            'song_uri':song_uri16 
        }

        items17= tracks.get('items')[16]
        track17=items17.get('track')
        song_name17=track17.get('name')
        song_duration17=track17.get('duration_ms')
        song_uri17=track17.get('uri')
        album17=track17.get('album')
        artist17=album17.get('artists')[0]
        artist_uri17=artist17.get('uri')
        album_name17=album17.get('name')
        album_uri17=album17.get('uri')

        artist_string17 = ""

        for i, artist17 in enumerate(track17.get('artists')):
            if i > 0:
                artist_string17 += ", "
            name17 = artist17.get('name')
            artist_string17 += name17 

        song17 = {
            'artist_name':artist_string17,
            'artist_uri':artist_uri17,
            'images':album17.get('images')[0].get('url'),
            'album_name':album_name17,
            'album_uri':album_uri17 ,  
            'song_name':song_name17  ,
            'song_duration':song_duration17,
            'song_uri':song_uri17
        }

        items18= tracks.get('items')[17]
        track18=items18.get('track')
        song_name18=track18.get('name')
        song_duration18=track18.get('duration_ms')
        song_uri18=track18.get('uri')
        album18=track18.get('album')
        artist18=album18.get('artists')[0]
        artist_uri18=artist18.get('uri')
        album_name18=album18.get('name')
        album_uri18=album18.get('uri')

        artist_string18 = ""

        for i, artist18 in enumerate(track18.get('artists')):
            if i > 0:
                artist_string18 += ", "
            name18 = artist18.get('name')
            artist_string18 += name18 

        song18 = {
            'artist_name':artist_string18 ,
            'artist_uri':artist_uri18,
            'images':album18.get('images')[0].get('url'),
            'album_name':album_name18,
            'album_uri':album_uri18   ,
            'song_name':song_name18  ,
            'song_duration':song_duration18,
            'song_uri':song_uri18 
        }

        items19= tracks.get('items')[18]
        track19=items19.get('track')
        song_name19=track19.get('name')
        song_duration19=track19.get('duration_ms')
        song_uri19=track19.get('uri')
        album19=track19.get('album')
        artist19=album19.get('artists')[0]
        artist_uri19=artist19.get('uri')
        album_name19=album19.get('name')
        album_uri19=album19.get('uri')

        artist_string19 = ""

        for i, artist19 in enumerate(track19.get('artists')):
            if i > 0:
                artist_string19 += ", "
            name19 = artist19.get('name')
            artist_string19 += name19 

        song19 = {
            'artist_name':artist_string19,
            'artist_uri':artist_uri19,
            'images':album19.get('images')[0].get('url'),
            'album_name':album_name19,
            'album_uri':album_uri19 ,
            'song_name':song_name19  ,
            'song_duration':song_duration19,
            'song_uri':song_uri19   
        }

        items20= tracks.get('items')[19]
        track20=items20.get('track')
        song_name20=track20.get('name')
        song_duration20=track20.get('duration_ms')
        song_uri20=track20.get('uri')
        album20=track20.get('album')
        artist20=album20.get('artists')[0]
        artist_uri20=artist20.get('uri')
        album_name20=album20.get('name')
        album_uri20=album20.get('uri')
        
        artist_string20 = ""

        for i, artist20 in enumerate(track20.get('artists')):
            if i > 0:
                artist_string20 += ", "
            name20= artist20.get('name')
            artist_string20 += name20 

        song20 = {
            'artist_name':artist_string20,
            'artist_uri':artist_uri20,
            'images':album20.get('images')[0].get('url'),
            'album_name':album_name20,
            'album_uri':album_uri20 ,
            'song_name':song_name20  ,
            'song_duration':song_duration20,
            'song_uri':song_uri20   
        }

        today_top = {
            'song1':song1,
            'song2': song2,
            'song3': song3,
            'song4':song4,
            'song5': song5,
            'song6': song6,
            'song7':song7,
            'song8':song8,
            'song9': song9,
            'song10': song10,
            'song11':song11,
            'song12': song12,
            'song13': song13,
            'song14':song14,
            'song15':song15,
            'song16': song16,
            'song17': song17,
            'song18':song18,
            'song19': song19,
            'song20': song20
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


class GetRecommended1(APIView):
    def get(self, request, format=None):
        
        
        access_token = get_access_token(
            self.request.session.session_key)


        response = get_recommended(access_token)
        
        data=response.get('data')[0]
        uri='spotify:track:'
        artist_string =''
        for i,dat1 in enumerate(data.get('artists_upd')):
            if i > 0:
                artist_string += ", "
            name= dat1
            artist_string += name

        rec1={
            'name':data.get('name'),
            'artist':artist_string ,
            'img':data.get('url'),
            'uri':uri+data.get('id')
        }

        data2=response.get('data')[1]

        artist_string2 =''
        for i,dat2 in enumerate(data2.get('artists_upd')):
            if i > 0:
                artist_string2 += ", "
            name2= dat2
            artist_string2 += name2

        rec2={
            'name':data2.get('name'),
            'artist':artist_string2 ,
            'img':data2.get('url'),
            'uri':uri+data2.get('id')
        }


        data3=response.get('data')[2]

        artist_string3 =''
        for i,dat3 in enumerate(data3.get('artists_upd')):
            if i > 0:
                artist_string3 += ", "
            name3= dat3
            artist_string3 += name3

        rec3={
            'name':data3.get('name'),
            'artist':artist_string3 ,
            'img':data3.get('url'),
            'uri':uri+data3.get('id')
        }


        data4=response.get('data')[3]

        artist_string4 =''
        for i,dat4 in enumerate(data4.get('artists_upd')):
            if i > 0:
                artist_string4 += ", "
            name4= dat4
            artist_string4 += name4

        rec4={
            'name':data4.get('name'),
            'artist':artist_string ,
            'img':data4.get('url'),
            'uri':uri+data4.get('id'),
        }


        data5=response.get('data')[4]

        artist_string5 =''
        for i,dat5 in enumerate(data5.get('artists_upd')):
            if i > 0:
                artist_string5 += ", "
            name5= dat5
            artist_string5 += name5

        rec5={
            'name':data5.get('name'),
            'artist':artist_string ,
            'img':data5.get('url'),
            'uri':uri+data5.get('id')
        }

        data6=response.get('data')[5]

        artist_string6 =''
        for i,dat6 in enumerate(data6.get('artists_upd')):
            if i > 0:
                artist_string6 += ", "
            name6= dat6
            artist_string6 += name6

        rec6={
            'name':data6.get('name'),
            'artist':artist_string6 ,
            'img':data6.get('url'),
            'uri':uri+data6.get('id')
        }

        data7=response.get('data')[6]

        artist_string7 =''
        for i,dat7 in enumerate(data7.get('artists_upd')):
            if i > 0:
                artist_string7 += ", "
            name7= dat7
            artist_string7 += name7

        rec7={
            'name':data7.get('name'),
            'artist':artist_string7 ,
            'img':data7.get('url'),
            'uri':uri+data7.get('id')
        }
        
        data8=response.get('data')[7]
        artist_string8 =''
        for i,dat8 in enumerate(data8.get('artists_upd')):
            if i > 0:
                artist_string8 += ", "
            name8= dat8
            artist_string8 += name8

        rec8={
            'name':data8.get('name'),
            'artist':artist_string8 ,
            'img':data8.get('url'),
            'uri':uri+data8.get('id')
        }

        data9=response.get('data')[8]

        artist_string9 =''
        for i,dat9 in enumerate(data9.get('artists_upd')):
            if i > 0:
                artist_string9 += ", "
            name9= dat9
            artist_string9 += name9

        rec9={
            'name':data9.get('name'),
            'artist':artist_string9 ,
            'img':data9.get('url'),
            'uri':uri+data9.get('id')
        }


        data10=response.get('data')[9]

        artist_string10 =''
        for i,dat10 in enumerate(data10.get('artists_upd')):
            if i > 0:
                artist_string10 += ", "
            name10= dat10
            artist_string10 += name10

        rec10={
            'name':data10.get('name'),
            'artist':artist_string10 ,
            'img':data10.get('url'),
            'uri':uri+data10.get('id')
        }


        data11=response.get('data')[10]

        artist_string11 =''
        for i,dat11 in enumerate(data11.get('artists_upd')):
            if i > 0:
                artist_string11 += ", "
            name11= dat11
            artist_string11 += name11

        rec11={
            'name':data11.get('name'),
            'artist':artist_string11 ,
            'img':data11.get('url'),
            'uri':uri+data11.get('id'),
        }


        data12=response.get('data')[11]

        artist_string12 =''
        for i,dat12 in enumerate(data12.get('artists_upd')):
            if i > 0:
                artist_string12 += ", "
            name12= dat12
            artist_string12 += name12

        rec12={
            'name':data12.get('name'),
            'artist':artist_string12 ,
            'img':data12.get('url'),
            'uri':uri+data12.get('id')
        }

        data13=response.get('data')[12]

        artist_string13 =''
        for i,dat13 in enumerate(data13.get('artists_upd')):
            if i > 0:
                artist_string13 += ", "
            name13= dat13
            artist_string13 += name13

        rec13={
            'name':data13.get('name'),
            'artist':artist_string13 ,
            'img':data13.get('url'),
            'uri':uri+data13.get('id')
        }

        data14=response.get('data')[13]

        artist_string14 =''
        for i,dat14 in enumerate(data14.get('artists_upd')):
            if i > 0:
                artist_string14 += ", "
            name14= dat14
            artist_string14 += name14

        rec14={
            'name':data14.get('name'),
            'artist':artist_string14 ,
            'img':data14.get('url'),
            'uri':uri+data14.get('id')
        }

        data15=response.get('data')[14]
        artist_string15 =''
        for i,dat15 in enumerate(data15.get('artists_upd')):
            if i > 0:
                artist_string15 += ", "
            name15= dat15
            artist_string15 += name15

        rec15={
            'name':data15.get('name'),
            'artist':artist_string15 ,
            'img':data15.get('url'),
            'uri':uri+data15.get('id')
        }

        data16=response.get('data')[15]

        artist_string16 =''
        for i,dat16 in enumerate(data16.get('artists_upd')):
            if i > 0:
                artist_string16 += ", "
            name16= dat16
            artist_string16 += name16

        rec16={
            'name':data16.get('name'),
            'artist':artist_string16 ,
            'img':data16.get('url'),
            'uri':uri+data16.get('id')
        }


        data17=response.get('data')[16]

        artist_string17 =''
        for i,dat17 in enumerate(data17.get('artists_upd')):
            if i > 0:
                artist_string17 += ", "
            name17= dat17
            artist_string17 += name17

        rec17={
            'name':data17.get('name'),
            'artist':artist_string17 ,
            'img':data17.get('url'),
            'uri':uri+data17.get('id')
        }


        data18=response.get('data')[17]

        artist_string18 =''
        for i,dat18 in enumerate(data18.get('artists_upd')):
            if i > 0:
                artist_string18 += ", "
            name18= dat18
            artist_string18 += name18

        rec18={
            'name':data18.get('name'),
            'artist':artist_string18 ,
            'img':data18.get('url'),
            'uri':uri+data18.get('id'),
        }


        data19=response.get('data')[18]

        artist_string19 =''
        for i,dat19 in enumerate(data19.get('artists_upd')):
            if i > 0:
                artist_string19 += ", "
            name19= dat19
            artist_string19 += name19

        rec19={
            'name':data19.get('name'),
            'artist':artist_string19 ,
            'img':data19.get('url'),
            'uri':uri+data19.get('id')
        }

        data20=response.get('data')[19]

        artist_string20 =''
        for i,dat20 in enumerate(data6.get('artists_upd')):
            if i > 0:
                artist_string20 += ", "
            name20= dat20
            artist_string20 += name20

        rec20={
            'name':data20.get('name'),
            'artist':artist_string20 ,
            'img':data20.get('url'),
            'uri':uri+data20.get('id')
        }

        
        rec = {
            '0':rec1,
            '1':rec2,
            '2':rec3,
            '3':rec4,
            '4':rec5,
            '5':rec6,
            '7':rec7,
            '8':rec8,
            '9':rec9,
            '10':rec10,
            '11':rec11,
            '12':rec12,
            '13':rec13,
            '14':rec14,
            '15':rec15,
            '16':rec16,
            '17':rec17,
            '18':rec18,
            '19':rec19,
            '20':rec20
        }

        resr = []
        for key,value in rec.items():
            resr.append(value)

        return Response(resr, status=status.HTTP_200_OK)

class GetRecommended(APIView):
    def get(self, request, format=None):
        
        
        access_token = get_access_token(
            self.request.session.session_key)


        response = get_recommended(access_token)
        
        data=response.get('data')[0]
        uri='spotify:track:'
        artist_string =''
        for i,dat1 in enumerate(data.get('artists_upd')):
            if i > 0:
                artist_string += ", "
            name= dat1
            artist_string += name

        rec1={
            'name':data.get('name'),
            'artist':artist_string ,
            'img':data.get('url'),
            'uri':uri+data.get('id')
        }

        data2=response.get('data')[1]

        artist_string2 =''
        for i,dat2 in enumerate(data2.get('artists_upd')):
            if i > 0:
                artist_string2 += ", "
            name2= dat2
            artist_string2 += name2

        rec2={
            'name':data2.get('name'),
            'artist':artist_string2 ,
            'img':data2.get('url'),
            'uri':uri+data2.get('id')
        }


        data3=response.get('data')[2]

        artist_string3 =''
        for i,dat3 in enumerate(data3.get('artists_upd')):
            if i > 0:
                artist_string3 += ", "
            name3= dat3
            artist_string3 += name3

        rec3={
            'name':data3.get('name'),
            'artist':artist_string3 ,
            'img':data3.get('url'),
            'uri':uri+data3.get('id')
        }


        data4=response.get('data')[3]

        artist_string4 =''
        for i,dat4 in enumerate(data4.get('artists_upd')):
            if i > 0:
                artist_string4 += ", "
            name4= dat4
            artist_string4 += name4

        rec4={
            'name':data4.get('name'),
            'artist':artist_string ,
            'img':data4.get('url'),
            'uri':uri+data4.get('id'),
        }


        data5=response.get('data')[4]

        artist_string5 =''
        for i,dat5 in enumerate(data5.get('artists_upd')):
            if i > 0:
                artist_string5 += ", "
            name5= dat5
            artist_string5 += name5

        rec5={
            'name':data5.get('name'),
            'artist':artist_string ,
            'img':data5.get('url'),
            'uri':uri+data5.get('id')
        }

        data6=response.get('data')[5]

        artist_string6 =''
        for i,dat6 in enumerate(data6.get('artists_upd')):
            if i > 0:
                artist_string6 += ", "
            name6= dat6
            artist_string6 += name6

        rec6={
            'name':data6.get('name'),
            'artist':artist_string6 ,
            'img':data6.get('url'),
            'uri':uri+data6.get('id')
        }

        data7=response.get('data')[6]

        artist_string7 =''
        for i,dat7 in enumerate(data7.get('artists_upd')):
            if i > 0:
                artist_string7 += ", "
            name7= dat7
            artist_string7 += name7

        rec7={
            'name':data7.get('name'),
            'artist':artist_string7 ,
            'img':data7.get('url'),
            'uri':uri+data7.get('id')
        }

        
        rec = {
            '0':rec1,
            '1':rec2,
            '2':rec3,
            '3':rec4,
            '4':rec5,
            '5':rec6,
            '7':rec7
        }

        resr = []
        for key,value in rec.items():
            resr.append(value)

        return Response(resr, status=status.HTTP_200_OK)

class getAccessToken(APIView):
    def get(self, request, format=None):
        access_token = get_access_token(
            self.request.session.session_key)
        return Response({'access_token': access_token}, status=status.HTTP_200_OK)



