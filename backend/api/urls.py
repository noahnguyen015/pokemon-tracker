from django.urls import path
from .views import hello_world, RegisterView, LoginView

urlpatterns = [
    path('hello/', hello_world),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]