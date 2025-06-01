#define forms for the API
from rest_framework import serializers
#use our User model
from .models import CustomUser, SoulLink
from django.contrib.auth import authenticate


#serializer for creating/registering new users
#automically links to the CustomUser model & deals with saving
class RegisterSerializer(serializers.ModelSerializer):

    #password field, write only means react can send the passwordm but Django never sends it back
    password = serializers.CharField(write_only=True)

    #How serializer works
    #model connects to the CustomUser
    #fields that are sent/received 
    class Meta: 
        model = CustomUser
        fields = ['username', 'password']

    #Called when .save() on serializer
    #requires custom .save() functionality because of hashed password (custom creation of entry)
    #validated_data is the safely inputed fields from user (username, password)
    def create(self, validated_data):
        #calls create_user from models page for user creation/ password hashing
        return CustomUser.objects.create_user(**validated_data)


#No model saving, validates username & password
class LoginSerializer(serializers.Serializer):
    #requires input fields, no writeonly because we're not returning anything 
    username = serializers.CharField()
    password = serializers.CharField()

    #called when .is_valid() is used in views
    #data is incoming data (username & passowrd)
    #requires custom logic for these because of pasword hashing
    def validate(self, data):
        #Django authenticate function checks if users exists with the data
        user = authenticate(**data)
        #if user exists then return the user, allows use of user object (JWT)
        if user and user.is_active:
            return user
        #fail = HTTP 400
        raise serializers.ValidationError("Invalid username or password")

class SoulLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoulLink
        fields = ["pokemon1", "pokemon2", "route"]

