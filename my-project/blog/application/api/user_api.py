from flask import jsonify
from flask_restful import Resource, fields, marshal_with,reqparse,abort,marshal
from flask_security import auth_required
from flask_login import current_user
from datetime import datetime as dt
from ..task import welcome_mail
import json
from ..database import db
from sqlalchemy import or_
from flask_security.utils import hash_password,verify_password
from ..security import user_datastore
from ..models import User,Followers,Follows,Posts


output_field = {
    "id": fields.Integer,
    "username":fields.String,
    "email": fields.String,
    "p_pic":fields.String,
    "bio":fields.String,
    "visited":fields.Boolean
}

post_field={
    "id":fields.Integer,
    "p_name":fields.String,
    "post":fields.String,
    "time":fields.String,
    "caption":fields.String,
    "post_id":fields.Integer
}

create_user_parser=reqparse.RequestParser()
create_user_parser.add_argument('username')
create_user_parser.add_argument('email')
create_user_parser.add_argument('password')
create_user_parser.add_argument('p_pic')
create_user_parser.add_argument('bio')

new_user_parser=reqparse.RequestParser()
new_user_parser.add_argument('username')
new_user_parser.add_argument('o_password')
new_user_parser.add_argument('n_password')

class UserAPI(Resource):
    @auth_required('token')
    #@marshal_with(output_field)
    def get(self,id=None):
        # if id==current_user.id:
        user=user_datastore.find_user(id=id)
        if user:
            user.visited=True
            db.session.commit()
            # 1. Get the list of users that the current user follows
            following = [f.follower_id for f in Followers.query.filter_by(followers=user.username).all()]

        #    # 2. Get all posts made by the current user and by the users they follow
            posts = Posts.query.filter(Posts.post_id.in_([user.id] + following)).all()
            
        #     # 3. Combine the posts in a single list and sort them by time
        #     #all_posts = sorted(posts, key=lambda p: posts.post_id, reverse=True)
            mposts=Posts.query.filter(Posts.post_id.in_([user.id])).all()
            nfollows=len(Follows.query.filter_by(follow_id=user.id).all())
            nfollowers=len(Follows.query.filter_by(follows=user.username).all())
            
            result = {
                "user": marshal(user, output_field),
                "all_posts":[marshal(p, post_field) for p in posts],
                "myposts":[marshal(p, post_field) for p in mposts],
                "followers":{"nfollowers":nfollowers},
                "follows":{"nfollows":nfollows}
            }
            return jsonify(result)
        else:
            abort(400,message="User does not exist")
    
    @marshal_with(output_field)
    def post(self):
        args=create_user_parser.parse_args()
        username = args.get("username")
        email = args.get("email")
        password = args.get("password")
        p_pic=args.get("p_pic")
        bio=args.get("bio")
        if username!="":
            if email!="":
                if "@" in email:
                    if password!="":
                        if not user_datastore.find_user(email = email):
                            user_datastore.create_user(
                                username=username,
                                email=email,
                                password=hash_password(password),
                                p_pic=p_pic,
                                bio=bio
                            )
                            db.session.commit()
                            welcome_mail.delay(receiver_email=email,subject='Hii there!',username=username)
                            json.dumps({'success':True}), 200, {'ContentType':'application/json'}
                        else:
                            abort(400,message="User already exist.")   

                    else:
                        abort(400,message="Creating a password is mendatory")        
                else:
                    abort(400,message="Invalid Email")              
            else:
                  abort(400,message="Email is mendatory")      
        else:
            abort(400,message="Username is mendatory") 

    @auth_required('token')
    @marshal_with(output_field)
    def put(self):
        #if id==current_user.id:
        args=new_user_parser.parse_args()
        username=args.get("username")
        o_password=args.get("o_password")
        #n_password=args.get("n_password")
        user=user_datastore.find_user(email=current_user.email)
        ver=verify_password(o_password,current_user.password)
        isalready=user_datastore.find_user(username=username)
        #verify_password(o_password,n_password)
        if user:
            if not isalready:
                if ver:
                    user.username=username
                    db.session.commit()
                    json.dumps({'success':True}), 200, {'ContentType':'application/json'}
                else:
                    abort(400,message="Wrong Password")    
            else:
                abort(400,message="This username is already used.please use different one.")        
        else:
            abort(400,message="User not found.")        
        # else:        
        #     abort(400,message="You are not authorized to update this user")        

    @auth_required('token')
    @marshal_with(output_field)    
    def delete(self):
        #if id==current_user.id:
        user = User.query.filter_by(id=current_user.id).first()
        followers = Followers.query.filter(or_(Followers.followers == current_user.username, Followers.follower_id == current_user.id)).all()
        for follower in followers:
            db.session.delete(follower)
        follows = Follows.query.filter(or_(Follows.follow_id==current_user.id, Follows.follows==current_user.username)).all()
        for follow in follows:
            db.session.delete(follow)
        posts = Posts.query.filter_by(post_id=current_user.id).all()
        for post in posts:
            db.session.delete(post)
        db.session.delete(user)
        db.session.commit()
        json.dumps({'success':True}), 200, {'ContentType':'application/json'}
        
        # else:
        #     abort(400,message="You are not authorized to delete this user")   