# General tools
import os
import datetime
import json
#For data Handling
import pandas as pd
import numpy as np

#For Visualizations
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px 
#Ignore Warnings
import warnings
warnings.filterwarnings('ignore')

#Progreebar
from tqdm import tqdm

# For transformations and predictions
from scipy.optimize import curve_fit
from yellowbrick.target import FeatureCorrelation
from sklearn.preprocessing import FunctionTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans 
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.tree import DecisionTreeRegressor

# For scoring
from sklearn.metrics import mean_squared_error as mse
from sklearn.metrics import r2_score,mean_absolute_error

# For validation
from sklearn.model_selection import train_test_split


def get_recommended2(playing_name):
    #Load the dataset
    df = pd.read_csv('C:/Users/Admin/Spotify_Capstone_Project-main/data/data.csv')

    #Remove the Square Brackets from the artists

    df["artists"]=df["artists"].str.replace("[", "")
    df["artists"]=df["artists"].str.replace("]", "")
    df["artists"]=df["artists"].str.replace("'", "")

    def normalize_column(col):
        """
        col - column in the dataframe which needs to be normalized
        """
        max_d = df[col].max()
        min_d = df[col].min()
        df[col] = (df[col] - min_d)/(max_d - min_d)
        
    #Normalize allnumerical columns so that min value is 0 and max value is 1
    num_types = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
    num = df.select_dtypes(include=num_types)
            
    for col in num.columns:
        normalize_column(col)
        
    #perform Kmeans CLustering
    km = KMeans(n_clusters=25)
    pred = km.fit_predict(num)
    df['pred'] = pred
    normalize_column('pred')

    #Song Recommender
    class Song_Recommender():
        """
        Neighbourhood Based Collborative Filterng REcoomendation System using similarity Metrics
        Manhattan Distance is calculated for all songs and Recommend Songs that are similar to it based on any given song
        """
        def __init__(self, data):
            self.data_ = data
        
        #function which returns recommendations, we can also choose the amount of songs to be recommended
        def get_recommendations(self, song_name, n_top):
            distances = []
            #choosing the given song_name and dropping it from the data
            song = self.data_[(self.data_.name.str.lower() == song_name.lower())].head(1).values[0]
            rem_data = self.data_[self.data_.name.str.lower() != song_name.lower()]
            for r_song in tqdm(rem_data.values):
                dist = 0
                for col in np.arange(len(rem_data.columns)):
                    #indeces of non-numerical columns(id,Release date,name,artists)
                    if not col in [3,8,14,16]:
                        #calculating the manhettan distances for each numerical feature
                        dist = dist + np.absolute(float(song[col]) - float(r_song[col]))
                distances.append(dist)
            rem_data['distance'] = distances
            #sorting our data to be ascending by 'distance' feature
            rem_data = rem_data.sort_values('distance')
            columns = ['id']
            return rem_data[columns][:n_top]


    #Instantiate recommender class
    recommender = Song_Recommender(df)

    #Get recommendations 'Red Roses (feat. Landon Cube)' song
    json1=recommender.get_recommendations(playing_name, 7)
    return json1