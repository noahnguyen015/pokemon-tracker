from django.shortcuts import render

# Create your views here.
#apiview - 
from rest_framework.decorators import api_view
from rest_framework.response import Response

#base class for making classbased views in Django REST Framework
from rest_framework.views import APIView
#Used to return JSON Responses from API
from rest_framework.response import Response
#readable HTTP codes (200,300,400,500)
from rest_framework import status
#JWT tokens
from rest_framework_simplejwt.tokens import RefreshToken
#serializers
from .serializers import RegisterSerializer, LoginSerializer

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django!"})

#make class-based view on registration
#for only POST
class RegisterView(APIView):
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
    #POST request done to /api/login
    def post(self, request):
        #pass login data to serializer
        serializer = LoginSerializer(data=request.data)
        #check if credentials correct
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
        #fail response (invalid login)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)