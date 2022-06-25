from Scrape.extractor_class import * 
from Parse.ResumeParser import *

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

index, index_talan = [], []

def webscrape(number,search = ''):
	ex = extractor()
	ex.Login()
	links = ex.search_in(number//10+1,search)[:number]
	result = []
	for cv in links:
		try:
			Resume = ex.extract(cv)
			Resume['source'] = 'linkedin'
			result.append(Resume)
		except:
			pass
	return(result)


def match_all(par=''):
	projects = mongo.db.Projects.find(par)

	for p in projects:

		matched_jobs = []

		try:
			for job in p['jobs']:
				try:
					job.pop('matches')
					job.pop('matches_talan')
				except:
					pass
				description = [str(i) for i in job.values()]
				top = tfidf.top_matches(str(description))
				matches = [match for match in top if match['_id'] in index][:50]
				matches_talan = [match for match in top if match['_id'] in index_talan][:50]

				matched_job = job
				matched_job['matches'] = matches
				matched_job['matches_talan'] = matches_talan
				matched_jobs.append(matched_job)
		except:
			pass

		mongo.db.Projects.find_one_and_update({"_id" : p['_id']},{ "$set": { "jobs": matched_jobs } })


def refresh_model():
	Resumes = mongo.db.Resumes.find()
	
	ids,cv=[],[]
	
	for R in Resumes:
		# document = coef(str(R['skills']),3)+coef(str(R['experience']),3)+coef(str(R['langs']),1)+coef(str(R['location']),1)
		document = str(R['skills'])+' '+str(R['experience'])+' '+str(R['langs'])+' '+str(R['location'])
		cv.append(document)
		ids.append(str(R['_id']))
		if R['source'] == 'TALAN':
			index_talan.append(str(R['_id']))
		else:
			index.append(str(R['_id']))

	tfidf.train(cv,ids)

refresh_model()
match_all()

@app.route("/TotalResumes", methods=["POST"])
def TotalResumes():
	n = mongo.db.Resumes.count_documents({})
	return {'result':n}

@app.route("/Parse", methods=["POST"])
def Parse():
	try:
		req = request.json
		result = DecodeExtract(req)
		result['langs'] = ''
		result['company'] = ''
		result['location'] = ''
		result['source'] = 'pdf'
		result['school'] = result['school'][0] or ''
		result['experience'] = ' '.join(result['experience'])
		result['document'] = req
		mongo.db.Resumes.find_one_and_update({"url": result['url']}, {"$set":result}, upsert = True)
		return {'result': result}
	except:
		return {'result': 'fail'}

@app.route("/URLScraping", methods=["POST"])
def URLScraping():
	try:
		url = request.json
		ex = extractor()
		ex.Login()
		resume = ex.extract(url)
		if resume['experience']!='':
			fields = ['position','company','duration','details']
			try:
				experience = resume['experience']
				resume['experience'] = [{fields[i]: e[i] for i in range(4)} for e in experience]
			except:
				pass
		resume['source']='linkedin'
		mongo.db.Resumes.find_one_and_update({"url": resume['url']}, {"$set":resume}, upsert = True)
		
		refresh_model()
		match_all()

		return {'result': resume}
	except:
		return {'result': 'fail'}

@app.route("/WebScraping", methods=["POST"])
def WebScraping():
	req = request.json
	search = req['search']
	number = int(req['number'])
	try:
		result = webscrape(number,search)
		for resume in result:
			if resume['experience']!='':
				fields = ['position','company','duration','details']
				try:
					experience = resume['experience']
					resume['experience'] = [{fields[i]: e[i] for i in range(4)} for e in experience]
				except:
					pass
			resume['source']='linkedin'
			mongo.db.Resumes.find_one_and_update({"url": resume['url']}, {"$set":resume}, upsert = True)

			refresh_model()
			match_all()

		return {'result': result}
	except:
		return {'result': 'fail'}

@app.route("/NewProject", methods=["POST"])
def NewProject():
	try:
		req = request.json
		doc = mongo.db.Projects.insert_one(req)
		doc_id = str(doc.inserted_id)
		match_all({"_id": ObjectId(doc_id)})
		return {'result': doc_id}
	except:
		return {'result': 'fail'}

@app.route("/Update/<id>", methods=["POST"])
def Update(id):
	try:
		req = request.json
		result = mongo.db.Projects.update_one({"_id": ObjectId(id)},{"$set":req})
		match_all({"_id": ObjectId(id)})
		return {'result': 'success'}
	except:
		return {'result': 'fail'}

@app.route("/NewJob", methods=["POST"])
def NewJob():
	req = request.json
	doc = mongo.db.Jobs.insert_one(req)
	doc_id = str(doc.inserted_id)
	return {'result': doc_id}

@app.route("/Matching/<id>", methods=["POST"])
def Matching(id):
	Project = mongo.db.Projects.find_one({"_id": ObjectId(id)})

	result = []
	for job in Project['jobs']:
		matches = []
		matches_talan = []
		for m in job['matches']:
			score = m['score']
			Resume = mongo.db.Resumes.find_one({"_id": ObjectId(m['_id'])})
			m = { i:Resume[i] for i in ['name','source','_id']}
			m['_id'] = str(m['_id'])
			m['score'] = score
			matches.append(m)
		for m in job['matches_talan']:
			score = m['score']
			Resume = mongo.db.Resumes.find_one({"_id": ObjectId(m['_id'])})
			m = { i:Resume[i] for i in ['name','_id']}
			m['_id'] = str(m['_id'])
			m['score'] = score
			matches_talan.append(m)
		
		result.append({'matches':matches, 'matches_talan':matches_talan})

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
				resume.pop('')
				if resume['source'] in ['xing','linkedin','indeed','pjf']:
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

@app.route("/Resumes", methods=["POST"])
def Resumes():
	result=[]
	try:
		resumes = mongo.db.Resumes.find()
		for r in resumes:
			r['_id']=str(r['_id'])
			r = dict((key,r[key]) for key in ['_id','name','email','url','source'])
			result.append(r)
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