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
from .Kmeanrecommend import *
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



class GetRecommended2(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host

        endpoint = "player/currently-playing"


        response = execute_spotify_api_request_current_song(host, endpoint)

        item = response.get('item').get('name')

        resit = get_recommended2(item)


        return Response(resit, status=status.HTTP_200_OK)




class getAccessToken(APIView):
    def get(self, request, format=None):
        access_token = get_access_token(
            self.request.session.session_key)
        return Response({'access_token': access_token}, status=status.HTTP_200_OK)



