import os
import sys

import logging
import coloredlogs
from logging.handlers import RotatingFileHandler

from plug_in_django import manage as plug_in_django_manage
from django_arduino_controller.apps import DjangoArduinoControllerConfig

from json_dict import JsonDict


DEBUGGING = True

BASENAME = "Django Arduino Controller"
SNAKE_NAME = BASENAME.lower().replace(' ', '_')
BASE_DIR = os.path.join(os.path.expanduser("~"), "." + SNAKE_NAME)



def main():
    os.makedirs(BASE_DIR, exist_ok=True)
    config = JsonDict(os.path.join(BASE_DIR, SNAKE_NAME + "_config.json"))

    logging_fmt = "%(asctime)s %(filename)s %(lineno)d %(name)s %(levelname)-8s  %(message)s"
    logging.basicConfig(
        level=config.get("basic", "logging", "level", default=logging.DEBUG if DEBUGGING else logging.INFO),
        format=logging_fmt,
        datefmt="(%H:%M:%S)",
    )

    rotating_handler = RotatingFileHandler(os.path.join(BASE_DIR, 'log.log'),
                                           maxBytes=config.get("basic", "logging", "max_bytes", default=2 ** 19),
                                           backupCount=config.get("basic", "logging", "backup_count", default=10))
    rotating_handler.setFormatter(logging.Formatter(logging_fmt))
    logging.getLogger('').addHandler(rotating_handler)

    logger = logging.getLogger(BASENAME)

    coloredlogs.install(level='DEBUG', fmt=logging_fmt)

    logger.info("Use basedir: " + os.path.abspath(BASE_DIR))



    #    board_collection.
    import arduino_board_collection.board_collection

    #plugin to django
    plug_in_django_manage.plug_in(DjangoArduinoControllerConfig,config)

    plug_in_django_manage.CONFIG.put("django_settings", "apps","channels",value=True)

    #set site parameters
    plug_in_django_manage.CONFIG.put("public", "site", "title", value=BASENAME)
    plug_in_django_manage.CONFIG.put("django_settings", "DEBUG", value=DEBUGGING)
    plug_in_django_manage.CONFIG.put("django_settings", "BASE_DIR", value=BASE_DIR)


    #login required
    plug_in_django_manage.CONFIG.put("django_settings", "manual", "add_to_list", "MIDDLEWARE", value=[
   #     "global_login_required.GlobalLoginRequiredMiddleware"
    ])
    # if login is required accounds neet to be public
    plug_in_django_manage.CONFIG.put("django_settings", "manual", "add_to_list", "PUBLIC_PATHS", value=[
        r"^/accounts/.*"
    ])


    plug_in_django_manage.run(sys.argv[0], "runserver", "--noreload",
                              "0.0.0.0:" + str(plug_in_django_manage.CONFIG.get("django_settings", "port", default=8000)))


if __name__ == "__main__":
    DjangoArduinoControllerConfig.baseurl=""
    main()
