#1.start redis server 
#open in a wsl terminal
sudo service redis-server start
redis-cli

#2.start the celery worker
#First change the directory to blog
python -m celery -A app.celery worker --pool=solo -l info

#2.Start the celery beat
#First change the directory to blog
python -m celery -A app.celery beat --max-interval 1 -l info

#4.start mailhog server
#First change the directory to blog
wt MailHog_windows_amd64.exe

#5.Run app.py file
