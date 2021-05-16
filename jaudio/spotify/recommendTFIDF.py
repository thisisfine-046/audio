import pandas as pd
import numpy as np
import json
import re 
import sys
import itertools

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt


import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
import spotipy.util as util

import warnings
warnings.filterwarnings("ignore")
from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from .models import Vote
from django.http import JsonResponse

class Recommend_TFIDF(APIView):
    def get(self, request, fornat=None):
        response = {}
        pd.set_option('display.max_columns', None)
        pd.set_option("max_rows", None)
        spotify_df = pd.read_csv('C:/Users/Admin/Desktop/spotify-recommendation-system-main/data.csv')
        #print(spotify_df.head())


        data_w_genre = pd.read_csv('C:/Users/Admin/Desktop/spotify-recommendation-system-main/data_w_genres.csv')
        tabletest = data_w_genre.head()
        

        result = spotify_df.to_json(orient="index")
        parsed = json.loads(result)

        #print(data_w_genre.dtypes)

        return Response({'url': result}, status=status.HTTP_200_OK)
