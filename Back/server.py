from flask import Flask, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/PFE'
CORS(app, support_credentials=True)
mongo = PyMongo(app)

@app.route("/")
def home_page():
	online_users = mongo.db.Resumes.find()[0]
	return(str(online_users))

@app.route("/NewProject", methods=["POST"])
def NewProject():
	print('post app')
	req = request.json
	print(req)
	# doc = mongo.db.Projects.insert_one(req)
	return req

@app.route("/NewJob", methods=["POST"])
def NewJob():
	print('post app')
	req = request.json
	for x in req:
		print(x)
	# doc = mongo.db.Projects.insert_one(req)
	return "Inserted"

@app.route("/Project/<id>")
def Project(id):
	print(id)
	result=''
	try:
		result = mongo.db.Resumes.find_one({"_id": ObjectId(id)})
		result.pop("_id")
	except:
		print('oops')
	print(result)
	return result

if __name__=='__main__':
	app.run(debug=True)