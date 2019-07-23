import threading
import time

from django.apps import apps
from django.http import JsonResponse, HttpResponseBadRequest, StreamingHttpResponse
from django.shortcuts import render, render_to_response


# Create your views here.
from django.views import View

from arduino_controller.serialport import SerialPortDataTarget


def index(request):
    sr = apps.get_app_config('django_arduino_controller').serial_reader
    if sr is None:
        return HttpResponseBadRequest(content="Serial Reader not running")
    return render(request,'django_arduino_controller_index.html')

def logger(request):
    sr = apps.get_app_config('django_arduino_controller').serial_reader
    if sr is None:
        return HttpResponseBadRequest(content="Serial Reader not running")
    return render(request,'django_arduino_controller_logger.html')