from flask import jsonify,request
from flask_restful import Resource, fields, marshal_with,reqparse,abort,marshal
from flask_security import auth_required
from flask_login import current_user
from datetime import datetime as dt
import json
from ..database import db
from flask_security.utils import hash_password,verify_password
from ..security import user_datastore
from ..models import Follows,Followers,User


output_field = {
    "id": fields.Integer,
    "username":fields.String,
    "email": fields.String,
    "p_pic":fields.String,
    "bio":fields.String,
}

create_follows_parser=reqparse.RequestParser()
create_follows_parser.add_argument('follows')

class FollowsAPI(Resource):
    def get(self,id=None):
        user=[f.follows for f in Follows.query.filter_by(follow_id=id).all()]
        users=User.query.filter(User.username.in_(user)).all()
        namei=User.query.filter_by(id=id).first()
        name=namei.username
        if len(user)>=1:
            result={
                "follows" :[marshal(f,output_field)for f in users],
                "name":name
            }
            return jsonify(result)
        else:
            abort(400,message="You don't follow anyone") 
    
    @marshal_with(output_field)
    def post(self):
        args=create_follows_parser.parse_args()
        follows = args.get("follows")
        follow=Follows(
            follows=follows,
            follow_id=current_user.id
        )
        db.session.add(follow)
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
        if useri:
            follower_to_delete=db.session.query(Followers).filter_by(followers=useri.username,follower_id=current_user.id).first()
            follows_to_delete=db.session.query(Follows).filter_by(follow_id=useri.id,follows=current_user.username).first()
            db.session.delete(follower_to_delete)
            db.session.delete(follows_to_delete)
            db.session.commit()
        else:
            abort(400,message="User not found")
        # else:
        #     abort(400,message="You are not authorized to delete this user")        