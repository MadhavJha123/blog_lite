from flask import jsonify,request,send_file,Response,make_response
from flask_restful import Resource, fields, marshal_with,reqparse,abort,marshal
from flask_login import current_user
from datetime import datetime as dt
from ..task import send_email,generate_csv
from flask_security import auth_required
import json
import os
from ..database import db
from sqlalchemy import or_
from ..security import user_datastore
from ..task import generate_csv,download_alert
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

class ExportApi(Resource):
    # @auth_required("token")
    def get(self,id=None):
        user=user_datastore.find_user(id=id)
        if user:
            csv_file=generate_csv.delay(id)
            try:
                file_path=csv_file.get()
                if file_path:
                    download_alert.delay(receiver_email=user.email)
                    # return send_file(file_path)
                    # return Response(generate(file_path), mimetype='text/csv', headers={
                    #     'Content-Disposition': 'attachment; filename=tracker.csv'
                    # })
                    with open(file_path, 'r') as csvfile:
                        csv_contents = csvfile.read()
                    os.remove(file_path)
                    response = make_response(csv_contents)
                    response.headers.set('Content-Type', 'text/csv')
                    response.headers.set('Content-Disposition', 'attachment', filename='tracker.csv')
                    response.headers.set('Content-Length', len(csv_contents))
                    return response
            except:
                return "Error is coming from export_api"    
        else:
            abort(400,message="User does not exist")