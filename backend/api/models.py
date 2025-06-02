from django.db import models
#AbstractBaseUser - for password & authentication support
#BaseUserManager - how users are created (superusers, users)
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Manager handles user creation
#if you want to make your own custom user model, you have to use a manager
class CustomUserManager(BaseUserManager):
    #creates regular users
        #required fields
    def create_user(self, username, password):
        if not username:
            raise ValueError("Username is required")
        if not password:
            raise ValueError("Password is required")
        #object with username
        user = self.model(username=username)
        user.set_password(password)  # Hash the password
        #saves it to database
        user.save()
        return user

    def create_superuser(self, username, password):
        #uses createuser
        user = self.create_user(username, password)
        #gives it admin permissions
        user.is_staff = True
        user.is_superuser = True
        #save to database and return superuser
        user.save()
        return user

# Actual user model
class CustomUser(AbstractBaseUser):

    #textfield, unique=true means all different usernames
    username = models.CharField(max_length=150, unique=True)
    #can they login? False if you want to disable an account
    is_active = models.BooleanField(default=True)
    #do they have access to admin site
    #admins have this as true
    is_staff = models.BooleanField(default=False)

    #links the manager
    #calls custom_manager when you call any of the create functions
    objects = CustomUserManager()

    #tells Django to use username as login field
    USERNAME_FIELD = "username"

    #print user to console or admin
    def __str__(self):
        return self.username

#pokemon information

class SoulLink(models.Model):
    #one to one with user
    #if customuser is deleted, so is the soul link entries
    user=models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="soullink")

    #columns used in the database
    pokemon1 = models.CharField(max_length=150, unique=True)
    pokemon2 = models.CharField(max_length=150, unique=True)
    route = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return f"{self.pokemon1} and {self.pokemon2}"
