from flask import jsonify,request
from flask_restful import Resource, fields, marshal_with,reqparse,abort,marshal
from flask_security import auth_required
from flask_login import current_user
from datetime import datetime as dt
from pytz import timezone
import json
from ..database import db
from flask_security.utils import hash_password,verify_password
from ..security import user_datastore
from ..models import Posts

output_field = {
    "id": fields.Integer,
    "p_name":fields.String,
    "post": fields.String,
    "time":fields.String,
    "caption":fields.String,
    "post_id":fields.Integer
}

create_post_parser=reqparse.RequestParser()
create_post_parser.add_argument('post')
create_post_parser.add_argument('caption')

new_post_parser=reqparse.RequestParser()
new_post_parser.add_argument('post')
new_post_parser.add_argument('caption')

class PostAPI(Resource):
    @auth_required('token')
    @marshal_with(output_field)
    def get(self,id=None):
        posts=Posts.query.filter_by(post_id=id).all()
        if posts:
            all_posts = sorted(posts, key=lambda P: P.time, reverse=True)
            return all_posts
        else:
            abort(400,message="This post does not exist")
    
    @auth_required('token')
    @marshal_with(output_field)
    def post(self):
        args=create_post_parser.parse_args()
        post = args.get("post")
        now=dt.now(timezone("Asia/Kolkata")).strftime("%d %b %H:%M")

        post_id=current_user.id
        posts=Posts(
            p_name=current_user.username,
            post=post,
            time=now,
            caption=args.get("caption"),
            post_id=post_id
        )
        db.session.add(posts)
        db.session.commit()
        json.dumps({'success':True}), 200, {'ContentType':'application/json'}
        
    @auth_required('token')
    @marshal_with(output_field)
    def put(self,id=None):
        args=new_post_parser.parse_args()
        post = args.get("post")
        now=dt.now(timezone("Asia/Kolkata")).strftime("%d %b %H:%M")
        posti=Posts.query.filter_by(id=id).first()
        post_id=current_user.id
        posts=Posts(
            p_name=current_user.username,
            post=post,
            time=posti.time,
            caption=args.get("caption"),
            post_id=post_id
        )
        db.session.delete(posti)
        db.session.add(posts)
        db.session.commit()
        json.dumps({'success':True}), 200, {'ContentType':'application/json'}

    @auth_required('token')
    @marshal_with(output_field)    
    def delete(self,id=None):
        user=db.session.query(Posts).filter_by(post_id=current_user.id,id=id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            json.dumps({'success':True}), 200, {'ContentType':'application/json'}
        else:
            abort(400,message="Post not found")      