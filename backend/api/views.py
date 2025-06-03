from django.shortcuts import render

# Create your views here.
#apiview - 
from rest_framework.decorators import api_view
#allows login view unauthorized access
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import SoulLink
#base class for making classbased views in Django REST Framework
from rest_framework.views import APIView
#Used to return JSON Responses from API
from rest_framework.response import Response
#readable HTTP codes (200,300,400,500)
from rest_framework import status
#JWT tokens
from rest_framework_simplejwt.tokens import RefreshToken
#serializers
from .serializers import RegisterSerializer, LoginSerializer, SoulLinkSerializer

import json

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django!"})

#make class-based view on registration
#for only POST
class RegisterView(APIView):

    permission_classes = [AllowAny]

#runs when frontend sends a post request to /api/registers
    def post(self, request):
        #takes incoming JSON and puts it into serializer
        serializer = RegisterSerializer(data=request.data)
        #if input is validated
        if serializer.is_valid():
            #calls create() in serailizer
            #leads to new user in CustomUserManager
            serializer.save()
            #return success message and status to frontend
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        #fail response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#for logging in
class LoginView(APIView):

    permission_classes = [AllowAny]

    #POST request done to /api/login
    def post(self, request):
        #pass login data to serializer
        serializer = LoginSerializer(data=request.data)
        #check if credentials correct

        if not serializer.is_valid():
            print(serializer.errors)

        if serializer.is_valid():
            #if successful object return by validate() to serializer
            user = serializer.validated_data
            #JWT token for logged-in user
            refresh = RefreshToken.for_user(user)
            #refresh & access tokens w/ username as response (stored in React)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username
            })
        else:
            print("Incoming data:", request.data)
            print("Serializer errors:", serializer.errors)
        #fail response (invalid login)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SoulLinkView(APIView):

    permission_classes = [AllowAny]

    #grab the soullink information
    def get(self, request):
        #check if the soullink object exists for the user
        #find all the objects in soullink related to user
        #many = true (for multiple objects)
        linkedpokemon = SoulLink.objects.filter(user=request.user)

        #convert the model to JSON w/ serializer
        serializer = SoulLinkSerializer(linkedpokemon, many=True)

        #return serialized data with API resposne
        return Response(serializer.data, status=status.HTTP_200_OK)

    #send the soullink information 
    #DRF (Django Rest Framework) info: already parsed, handles the JSON string based on Content-Type header, so request data should be dictionary or query dict based on content
    def post(self, request):
        print(request.data)

        #need to convert json --> dictionary
        sl_data = request.data

        #for get_or_create() check if the soullink exists for the user and creates it if it doesn't
        #soullink, _ = SoulLink.objects.get_or_create(user=request.user)
        soullink = SoulLink.objects.create(user=request.user,pokemon1=sl_data["pokemon1"], pokemon2=sl_data["pokemon2"], route=sl_data["route"])
        #load incoming data into serializer
        serializer = SoulLinkSerializer(soullink, data=request.data)

        #checks if fields are present, and if format is correct
        if serializer.is_valid():
            #save the data into the database
            serializer.save()
            #returns success message and updated data
            return Response({"message":"soullink was sent successfully", 
                             "data": serializer.data}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            

