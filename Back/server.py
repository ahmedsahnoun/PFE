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

def match(job_offer_description,n):
	job = job_offer_description

	top = tfidf.top_matches(job,n)
	top_id = [ids[i] for i in top['indices']]
	scores = top['scores']

	result = []
	for i in range(n):
		m = mongo.db.Resumes.find_one({"_id" : top_id[i] })
		m["_id"] = str(m["_id"])
		m['score'] = scores[i]
		result.append(m)

	return(result)

def refresh_model():
	Resumes = mongo.db.Resumes.find()

	for R in Resumes:
		document = coef(str(R['skills']),3)+coef(str(R['experience']),3)+coef(str(R['langs']),1)+coef(str(R['location']),1)
		cv.append(document)
		ids.append(R['_id'])

	tfidf.train(cv)

refresh_model()

@app.route("/NewProject", methods=["POST"])
def NewProject():
	try:
		req = request.json
		doc = mongo.db.Projects.insert_one(req)
		doc_id = str(doc.inserted_id)
		return {'result': doc_id}
	except:
		return {'result': 'fail'}

@app.route("/NewJob", methods=["POST"])
def NewJob():
	req = request.json
	doc = mongo.db.Jobs.insert_one(req)
	doc_id = str(doc.inserted_id)
	return {'result': doc_id}

@app.route("/Matching", methods=["POST"])
def Matching():
	req = request.json

	n,job_offer_description = req['n'], req['job']

	result = match(job_offer_description,n)

	return {'result': result}

@app.route("/RefreshDB", methods=["POST"])
def RefreshDB():
	mongo.db.Resumes.drop()
	with open('C:\\Users\\Ahmed\\Desktop\\PFE\\Linkedin scraping\\Data_out.csv', 'r', encoding="ISO-8859-1") as f:
		ereader = csv.DictReader(f, delimiter=";")
		fieldnames = ereader.fieldnames
		for resume in ereader:
			for x in ['skills','langs']:
				if resume[x]!='':
					try:
						resume[x] = literal_eval(resume[x])
					except:
						pass

			if resume['source'] in ['linkedin','indeed']:
				if resume['experience']!='':
					fields = ['position','company','duration','details']
					try:
						experience = literal_eval(resume['experience'])
						resume['experience'] = [{fields[i]: e[i] for i in range(4)} for e in experience]
					except:
						pass
			
			if resume['source'] == 'xing':
				if resume['experience']!='':
					fields = ['position','duration','company']
					try:
						experience = literal_eval(resume['experience'])
						resume['experience'] = [{fields[i]: e[i] for i in range(3)} for e in experience]
					except:
						pass
			try:
				mongo.db.Resumes.insert_one(resume)
			except:
				pass

	return {'result':'done'}

@app.route("/Project/<id>", methods=["POST","GET"])
def Project(id):
	result=''
	try:
		result = mongo.db.Projects.find_one({"_id": ObjectId(id)})
		result.pop("_id")
	except:
		result= 'not found'
	return {'result': result}

@app.route("/Resume/<id>", methods=["POST"])
def Resume(id):
	result=''
	try:
		result = mongo.db.Resumes.find_one({"_id": ObjectId(id)})
		result.pop("_id")
	except:
		result= 'not found'
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