from django.apps import AppConfig
import arduino_controller.serialreader.serialreader as acsr
from django_arduino_controller.consumers import APIConsumer


class DjangoArduinoControllerConfig(AppConfig):
    apis = []
    module_path = ".".join(__name__.split(".")[:-1])
    name = "django_arduino_controller"
    baseurl = "arduino_controller"

    serial_reader = None
    config = None

    def ready(self):
        if self.serial_reader is None:
            self.serial_reader = acsr.SerialReader(
                start_in_background=True, config=self.config.getsubdict(["portdata"])
            )
        for i in range(len(self.apis)):
            api = self.apis[i](self.serial_reader,config=self.config.get_parent().getsubdict(preamble=["apis",i]))
            APIConsumer.register_api(api)

    @classmethod
    def add_api(cls, api_class):
        cls.apis.append(api_class)
        if cls.serial_reader is not None:
            i = len(cls.apis) - 1
            api = cls.apis[i](cls.serial_reader,config=cls.config.get_parent().getsubdict(preamble=["apis",i]))
            APIConsumer.register_api(api)