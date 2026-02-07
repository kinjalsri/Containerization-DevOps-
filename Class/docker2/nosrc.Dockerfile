FROM python

WORKDIR /home/app


RUN pip install numpy

CMD ["python", "app.py"] 