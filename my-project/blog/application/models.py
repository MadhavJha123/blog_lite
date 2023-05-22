from .database import db
from datetime import datetime
from flask_security import UserMixin,RoleMixin


class User(db.Model,UserMixin):
    id=db.Column(db.Integer,autoincrement=True,primary_key=True)
    username=db.Column(db.String(20),nullable=False)
    p_pic=db.Column(db.String(),nullable=True)
    bio=db.Column(db.String(200),nullable=True)
    email=db.Column(db.String(),unique=True,nullable=False)
    password=db.Column(db.String(10),nullable=False)
    active=db.Column(db.Boolean())
    visited = db.Column(db.Boolean(),default=False)
    fs_uniquifier=db.Column(db.String(255),unique=True,nullable=True)
    follower = db.relationship('Followers', backref='user', lazy=True)
    follow=db.relationship('Follows', backref='user', lazy=True)
    posts=db.relationship('Posts',backref='user',lazy=True)
    roles = db.relationship('Role',secondary='roles_users',backref=db.backref('users'))

class Role(db.Model,RoleMixin):
    id=db.Column(db.Integer(),primary_key=True)
    name=db.Column(db.String(50),unique=True,nullable=False)
    desc=db.Column(db.String(100)) 

roles_users=db.Table('roles_users',
                        db.Column('user_id',db.Integer(),db.ForeignKey('user.id')),
                        db.Column('role_id',db.Integer(),db.ForeignKey('role.id')))    

class Followers(db.Model):
    id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    followers=db.Column(db.String(),default="No followers yet")
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Follows(db.Model):
    id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    follows=db.Column(db.String(),default="You don't follow anyone")
    follow_id=db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Posts(db.Model):
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    p_name=db.Column(db.String(200),nullable=False)
    post = db.Column(db.String(),nullable=False)
    time = db.Column(db.String(50),nullable=False)
    caption=db.Column(db.String(),nullable=True)
    post_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  

