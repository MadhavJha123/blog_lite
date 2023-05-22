from .workers import celery
from celery.schedules import crontab
from flask_restful import abort
from flask_login import current_user
from jinja2 import Template
from weasyprint import HTML
import os
from .database import db
import smtplib
from .models import User,Posts,Followers
import csv
from email.mime.text import MIMEText
from .security import user_datastore
from email.mime.multipart import MIMEMultipart
from email import encoders
from email.mime.base import MIMEBase

SMTP_SERVER_HOST='localhost'
SMTP_SERVER_PORT=1025
SENDER_ADDRESS="email@madhav.com"
SENDER_PASSWORD=""

def send_email(receiver_email,subject,message,attachment_files=None):
    try:
        msg=MIMEMultipart()
        msg["From"]=SENDER_ADDRESS
        msg["To"]=receiver_email
        msg['Subject']=subject
        msg.attach(MIMEText(message,"html"))

        if attachment_files:
            with open(attachment_files,"rb") as f:
                attach=MIMEBase("application","octet-stream")
                attach.set_payload(f.read())
            encoders.encode_base64(attach)
            attach.add_header(
                "Content-Disposition", f"attachment; filename={attachment_files}"
            )    
            msg.attach(attach)

        s=smtplib.SMTP(host=SMTP_SERVER_HOST,port=SMTP_SERVER_PORT)
        s.login(SENDER_ADDRESS,SENDER_PASSWORD)
        s.send_message(msg)
        s.quit()

        return True

    except Exception as e:
        print(e)

@celery.task
def generate_csv(id):
    user=user_datastore.find_user(id=id)
    file_path =str(user.username) + "_report.csv"
    posts=Posts.query.filter_by(post_id=id).all()
    # Open CSV file and write data to it
    try:
        with open(file_path, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            header = ["S_no.","Post caption","Created on"]
            writer.writerow(header)
            s_no=0
            for post in posts:
                s_no+=1
                data=[s_no,post.caption,post.time]
                writer.writerow(data)
    except:
        raise Exception("error")            
    return file_path

@celery.task
def welcome_mail(receiver_email, subject, username):
    with open("./mails/welcome.html",'r') as f:
        template = Template(f.read())
    send_email(receiver_email,subject,message=template.render(user=username))
    return "Mail sent"

@celery.task
def daily_reminder():
    users=db.session.query(User).all()
    with open("./mails/reminder.html",'r') as f:
        template = Template(f.read())
    for user in users:
        if user.visited==True:
            print()
        else:
            send_email(user.email,subject="daily reminder",message=template.render(user=user.username))
            db.session.commit()
    return "daily reminder sent"        
    
@celery.task
def download_alert(receiver_email):
    user=user_datastore.find_user(email=receiver_email)
    name=user.username
    f = open('./mails/alert.html','r')
    template = Template(f.read())
    send_email(receiver_email,subject="Download alert",message=template.render(user=user.username),attachment_files=str(name)+"_report.csv")
    return "sent download alert"

@celery.task
def visited():
    users=db.session.query(User).all()
    for user in users:
        user.visited=False
        db.session.commit()

@celery.task
def monthly_pdf_report(id):
    user=User.query.filter_by(id=id).first()
    posts=Posts.query.filter_by(post_id=id).all()
    followers=Followers.query.filter_by(follower_id=id).all()
    if user:
        all_posts=[]
        all_followers=[]
        for post in posts:
            all_posts.append(post)
        for follower in followers:
            all_followers.append(follower)
    with open("./reports/monthly_report.html") as f:
        template=Template(f.read())
    res=template.render(all_posts=all_posts,all_followers=all_followers,user=user.username)  
    html=HTML(string=res)
    file_name="./monthly_reports/"+str(user.username)+"_monthly_report.pdf"
    if os.path.exists(file_name):
        os.remove(file_name)
    html.write_pdf(target=file_name)
    return file_name    

@celery.task
def monthly_report():
    users=db.session.query(User).all()
    f=open('./mails/report.html','r')
    template=Template(f.read())
    if users:
        for user in users:
            file_path=monthly_pdf_report(id=user.id)
            if file_path:
                send_email(user.email,subject="Monthly Report of Blog",message=template.render(username=user.username),attachment_files=file_path)
        f.close()
        return "monthly report sent"
    else:
        abort(400,message="User not found")

@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(
            hour=9,
            minute=00,
            day_of_month=1
        ),
        monthly_report.s(), name='1st of every month at 9:00 AM'
    )
    sender.add_periodic_task(
        crontab(
            hour=19,
            minute=30
        ),
        daily_reminder.s(), name="Daily reminder at 7:30 PM"
    )
    sender.add_periodic_task(
        crontab(
            hour=21,
            minute=00
        ),
        visited.s(), name="Reset visited status")