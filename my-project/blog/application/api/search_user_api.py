from flask import jsonify,request
from flask_restful import Resource, fields, marshal_with,reqparse,abort,marshal
from flask_security import auth_required
from flask_login import current_user
from datetime import datetime as dt
import json
from ..database import db
from flask_security.utils import hash_password,verify_password
from ..security import user_datastore
from ..models import User,Followers,Follows,Posts

output_field = {
    "id": fields.Integer,
    "username":fields.String,
    "email": fields.String,
    "p_pic":fields.String,
    "bio":fields.String,
}

post_field={
    "id":fields.Integer,
    "p_name":fields.String,
    "post":fields.String,
    "time":fields.String,
    "caption":fields.String,
    "post_id":fields.Integer
}
# follow_field={
#     "follow":fields.Integer
# }

create_user_parser=reqparse.RequestParser()
create_user_parser.add_argument('username')
create_user_parser.add_argument('email')
create_user_parser.add_argument('p_pic')
create_user_parser.add_argument('bio')

class SearchUserAPI(Resource):
#   @auth_required('token')
    #@marshal_with(output_field)
    def get(self,username=None):
        user=user_datastore.find_user(username=username)
        if user:
            useri={"id":user.id,"username":user.username,"email": user.email,"p_pic":user.p_pic,"bio":user.bio}
            followi=0
            # 1. Get the list of users that the current user follows
            #following = [f.follow_id for f in Follows.query.filter_by(follow_id=current_user.id).all()]

           # 2. Get all posts made by the current user and by the users they follow
            #posts = Posts.query.filter(Posts.post_id.in_([current_user.id] + following)).all()
            
            # 3. Combine the posts in a single list and sort them by time
            #all_posts = sorted(posts, key=lambda p: posts.post_id, reverse=True)
            mposts=Posts.query.filter(Posts.post_id.in_([user.id])).all()
            followers=Follows.query.filter_by(follows=user.username).first()
            if followers:
                followi+=1
            nfollows=len(Follows.query.filter_by(follow_id=user.id).all())
            nfollowers=len(Followers.query.filter_by(follower_id=user.id).all())    
            #serialized_posts = [marshal(p, post_field) for p in posts]  
            #serialized_posts = marshal(all_posts, post_field)
            
            result = {
                "user": marshal(useri, output_field),
                #"all_posts":[marshal(p, post_field) for p in posts],
                "myposts":[marshal(p, post_field) for p in mposts],
                "follows":{"follow":followi},
                "tfollows":{"nfollows":nfollows},
                "tfollowers":{"nfollowers":nfollowers}
            }
            
            return jsonify(result)
        else:
            abort(400,message="User does not exist")
        # else:
        # # #     raise NotFoundError(status_code=404)
        #     abort(400,message="You are not authorized.")