FROM python:3.10
WORKDIR /ISS
COPY . .
RUN pip install -r requirements.txt
CMD ["gunicorn", "backend.wsgi"]
