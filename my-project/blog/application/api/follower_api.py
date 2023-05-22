from flask import jsonify,request
from flask_restful import Resource, fields, marshal_with,reqparse,abort,marshal
from flask_security import auth_required
from flask_login import current_user
from datetime import datetime as dt
import json
from ..database import db
from flask_security.utils import hash_password,verify_password
from ..security import user_datastore
from ..models import User,Followers,Follows


output_field = {
    "id": fields.Integer,
    "username":fields.String,
    "email": fields.String,
    "p_pic":fields.String,
    "bio":fields.String,
}

create_follower_parser=reqparse.RequestParser()
create_follower_parser.add_argument('followers')
create_follower_parser.add_argument('follower_id')

class FollowerAPI(Resource):
    def get(self,id):
        user=[f.followers for f in Followers.query.filter_by(follower_id=id).all()]
        users=User.query.filter(User.username.in_(user)).all()
        namei=User.query.filter_by(id=id).first()
        name=namei.username
        if len(user)>=1:
            result={
                "followers" :[marshal(f,output_field)for f in users],
                "name":name
            }
            return jsonify(result)
        else:
            abort(400,message="No followers yet") 
    
    @auth_required('token')
    def post(self):
        args=create_follower_parser.parse_args()
        followers = current_user.username
        followersi=args.get("followers")
        follower_id=args.get("follower_id")
        follower=Followers(
            followers=followers,
            follower_id=follower_id
        )
        follows=Follows(
        follows=followersi,
        follow_id=current_user.id
        )
        db.session.add(follower)
        db.session.add(follows)
        db.session.commit()
        json.dumps({'success':True}), 200, {'ContentType':'application/json'}
        
    @auth_required('token')
    @marshal_with(output_field)
    def put(self):
        pass

    @auth_required('token')
    @marshal_with(output_field)    
    def delete(self,id=None):
        useri=User.query.filter_by(id=id).first()
        follower_to_delete=db.session.query(Followers).filter_by(followers=current_user.username,follower_id=id).first()
        follows_to_delete=db.session.query(Follows).filter_by(follow_id=current_user.id,follows=useri.username).first()
        db.session.delete(follower_to_delete)
        db.session.delete(follows_to_delete)
        db.session.commit()
        json.dumps({'success':True}), 200, {'ContentType':'application/json'}
        # else:
        #     abort(400,message="You are not authorized to delete this user")        