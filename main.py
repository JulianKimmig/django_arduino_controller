import os
import sys

from json_dict import JsonDict
from os.path import expanduser

import plug_in_django
from plug_in_django import manage as plug_in_django_manage

BASENAME = "Django Arduino Controller"
SNAKE_NAME = BASENAME.lower().replace(' ', '_')
BASE_DIR = os.path.join(expanduser("~"), "." + SNAKE_NAME)

def main():
    os.makedirs(BASE_DIR, exist_ok=True)
    config = JsonDict(os.path.join(BASE_DIR, SNAKE_NAME + "_config.json"))

    plug_in_django_manage.CONFIG = config.getsubdict(preamble=['plug_in_django_server'])

    plug_in_django_manage.run(sys.argv[0], "runserver", "--noreload",
                               "0.0.0.0:" + str(config.get("controll_server", "django_settings", "port", default=8000)))


if __name__ == "__main__":
    main()
