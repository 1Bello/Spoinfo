web: gunicorn backend.wsgi --log-file - 
#or works good with external database
web: python3 manage.py migrate && gunicorn backend.wsgi