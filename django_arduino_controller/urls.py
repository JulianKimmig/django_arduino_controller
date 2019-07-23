from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

from django_arduino_controller import views, routing

urlpatterns = [
                  path('', views.index,name="index"),
                  path('logger', views.logger,name="logger"),
              ] + [path(**pattern) for pattern in routing.urlpatterns]
