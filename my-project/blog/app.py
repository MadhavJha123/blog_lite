from flask import Flask,render_template
from flask_restful import Api,Resource
from flask_cors import CORS
from application.database import db
from application import workers
from application.models import User
from application.security import user_datastore,sec
from application.api.user_api import UserAPI
from application.api.follow_api import FollowsAPI
from application.api.follower_api import FollowerAPI
from application.api.post_api import PostAPI
from application.api.search_user_api import SearchUserAPI
from application.api.follower_api import FollowerAPI
from application.api.find_user import FindUserAPI
from application.api.export_api import ExportApi
app=Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.sql'
app.config['SECRET_KEY']='asecretkey'
app.config['SECURITY_PASSWORD_SALT']='salt'
app.config['WTF_CSRF_ENABLED']=False
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER']="Authentication-Token"
app.config['SECURITY_PASSWORD_HASH']='bcrypt'
app.config['CACHE_TYPE']="RedisCache"
app.config["CACHE_REDIS_HOST"]="localhost"
app.config['CACHE_REDIS_PORT']=6379

api=Api(app)
db.init_app(app)
celery=None
CORS(app)

sec.init_app(app,user_datastore)
app.app_context().push()

celery=workers.celery
celery.conf.update(
        broker_url = "redis://localhost:6379/1",
        result_backend = "redis://localhost:6379/2",
        timezone = 'Asia/Kolkata'
    )
celery.Task = workers.ContextTask

@app.before_first_request
def create_db():
    db.create_all()

@app.route('/')
def test():
    return render_template("index.html")


api.add_resource(UserAPI,"/user","/user/<int:id>")
api.add_resource(FollowsAPI,"/follows","/follows/<int:id>")
api.add_resource(FollowerAPI,"/follower","/follower/<int:id>")
api.add_resource(PostAPI,"/post","/post/<int:id>")
api.add_resource(SearchUserAPI,"/search/<username>")
api.add_resource(FindUserAPI,"/find/<name>")
api.add_resource(ExportApi,"/export/<int:id>")

if __name__ == "__main__":
    app.run(debug=True)