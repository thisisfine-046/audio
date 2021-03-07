from django.shortcuts import render

# Create your views here.


def index(request , *args, **kwargs):
    return render(request,'frontend/index.html')

def homepage(request , *args, **kwargs):
    return render(request,'frontend/homepage.html')