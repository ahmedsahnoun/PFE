from flask import Flask, request
from utils import *
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
from ast import literal_eval
import csv
from matcher import matcher

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/PFE'
mongo = PyMongo(app)
CORS(app, support_credentials=True)

tfidf = matcher()
ids,cv=[],[]

def refresh_model():
	Resumes = mongo.db.Resumes.find()

	for R in Resumes:
		document = coef(str(R['skills']),3)+coef(str(R['experience']),3)+coef(str(R['langs']),1)
		cv.append(document)
		ids.append(R['_id'])

	tfidf.train(cv)

refresh_model()

@app.route("/NewProject", methods=["POST"])
def NewProject():
	req = request.json
	doc = mongo.db.Projects.insert_one(req)
	doc_id = str(doc.inserted_id)
	return {'result': doc_id}

@app.route("/NewJob", methods=["POST"])
def NewJob():
	req = request.json
	doc = mongo.db.Jobs.insert_one(req)
	doc_id = str(doc.inserted_id)
	return {'result': doc_id}

@app.route("/Matching", methods=["POST"])
def Matching():

	job_offer_description = "'Java', 'JEE', 'SQL', 'Python', 'machine learning', 'Raspberry Pi', 'c', 'Spring Boot', 'MongoDB', 'Leadership', 'Raspberry', 'Pi'"
	job = (job_offer_description+" ")*10

	top = tfidf.top_matches(job,5)
	top_id = [ids[i] for i in top['indices']]

	matches = mongo.db.Resumes.find({"_id" : {"$in":top_id }})

	result = []
	for m in matches:
		m.pop("_id")
		result.append(m)

	return {'result': result}

@app.route("/RefreshDB", methods=["POST"])
def RefreshDB():
	with open('C:\\Users\\Ahmed\\Desktop\\PFE\\Linkedin scraping\\Data.csv', 'r', encoding="ISO-8859-1") as f:
		ereader = csv.DictReader(f)
		fieldnames = ereader.fieldnames
		for row in ereader:

			resume = row

			for x in ['skills','langs']:
				resume[x] = literal_eval(resume[x])

			experience = literal_eval(resume['experience'])
			fields = ['position','company','duration','details']
			resume['experience'] = [{fields[i]: e[i] for i in range(4)} for e in experience]

			mongo.db.Resumes.insert_one(resume)
	# mongo.db.Resumes.drop()
	return {'result':'done'}

@app.route("/Project/<id>", methods=["POST"])
def Project(id):
	result=''
	try:
		result = mongo.db.Projects.find_one({"_id": ObjectId(id)})
		result.pop("_id")
	except:
		return('not found')
	return {'result': result}

@app.route("/Projects", methods=["POST"])
def Projects():
	result=[]
	try:
		projects = mongo.db.Projects.find()
		for p in projects:
			p['_id']=str(p['_id'])
			result.append(p)
	except:
		return([])
	return {'result':result}

@app.route("/DeleteProjects", methods=["POST"])
def DeleteProjects():
	req = request.json
	deleted_ids = [ObjectId(x) for x in req]
	mongo.db.Projects.delete_many({"_id" : {"$in":deleted_ids }})
	return {'result': 'success'}

if __name__=='__main__':
	app.run(debug=True)