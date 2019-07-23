# chat/routing.py
from django.urls import path

from .apps import DjangoArduinoControllerConfig
from . import consumers

prefix = DjangoArduinoControllerConfig.baseurl + "/"
if len(prefix) == 1:
    prefix = ""
#urlpatterns = [
#    path(prefix+'ws/<socket_type>', consumers.BoardDataConsumer,name="websocket"),
#    path(prefix+'ws/<socket_type>/<arg>', consumers.BoardDataConsumer,name="websocket_arg"),
#]
urlpatterns = [
    dict(route='ws/boarddata/<socket_type>', view=consumers.BoardDataConsumer,name="websocket"),
    dict(route='ws/boarddata/<socket_type>/<arg>', view=consumers.BoardDataConsumer,name="websocket_arg"),
    dict(route='ws/datalogger', view=consumers.DataLoggerConsumer,name="dataloggersocket"),
]