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

create_user_parser=reqparse.RequestParser()
create_user_parser.add_argument('users')

class FindUserAPI(Resource):
    def get(self,name=None):
        users = User.query.filter(User.username.like(f"{name}%")).all()
        #print("**********",users[0].username,"**************")
        if users:
            result={
                "users":[marshal(user,output_field)for user in users]
            }
            return jsonify(result)
        else:
            abort(400,message="No Matches found")