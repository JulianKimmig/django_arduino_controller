FROM python:3.7-alpine
MAINTAINER Julian Kimmig

ENV PYTHONUNBUFFERED 1

RUN apk update
RUN apk add make automake gcc g++ subversion python3-dev

COPY ./requirements.txt /requirements.txt

RUN mkdir /django_arduino_controller_dir

#RUN adduser -D user -G dialout
#USER user

ENV PATH /home/user/.local/bin:$PATH

RUN export PATH=$HOME/.local/bin:$PATH
RUN pip install --user --upgrade -r /requirements.txt

WORKDIR /django_arduino_controller_dir
COPY ./django_arduino_controller /django_arduino_controller_dir/django_arduino_controller
COPY ./main.py /django_arduino_controller_dir/main.py



