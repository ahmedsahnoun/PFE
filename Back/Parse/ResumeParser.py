import os
import multiprocessing as mp
import io
import spacy
import pprint
from spacy.matcher import Matcher
from spacy_langdetect import LanguageDetector
from langdetect import detect
from .extractor import *
import base64

class ResumeParser(object):

	def __init__(self,resume):
		self.resume = resume
		
		self.text_raw = extract_text(self.resume)
		self.text = ' '.join(self.text_raw.split())

		lang = detect(self.text)

		if lang == 'en':
			nlp = spacy.load('en_core_web_sm')
		elif lang == 'fr':
			nlp = spacy.load('fr_core_news_sm')

		# custom_nlp = spacy.load(os.path.dirname(os.path.abspath(__file__)))
		self.matcher = Matcher(nlp.vocab)

		self.nlp = nlp(self.text)
		# self.custom_nlp = custom_nlp(self.text_raw)
		self.noun_chunks = list(self.nlp.noun_chunks)

	def get_details(self):
		name,email,mobile,skills,experience,education,url = None,None,None,None,None,None,None

		entities = extract_entity_sections_grad(self.text_raw)

		try:
			name = extract_name(self.nlp, matcher=self.matcher)
		except:
			pass
		try:
			email = extract_email(self.text)
		except:
			pass
		try:
			mobile = extract_mobile_number(self.text)
		except:
			pass
		try:
			skills = extract_skills(self.nlp,self.noun_chunks)
		except:
			pass
		try:
			experience = entities['experience']
		except:
			pass
		try:
			url = extract_url(self.text)
		except:
			pass
		try:
			education = entities['education']
		except:
			pass
		return({
					'name':name,
					'email':email,
					'phone':mobile,
					'url':url,
					'skills':skills,
					'experience':experience,
					'school':education,
					})

	def details(self):
		print(self.get_details())

def DecodeExtract(req):
	with open("./Parse/temp.pdf", "wb") as f:
		f.write(base64.b64decode(req))

	info = ResumeParser("./Parse/temp.pdf").get_details()

	print(os.path)
	if os.path.exists("./Parse/temp.pdf"):
		os.remove("./Parse/temp.pdf")

	return(info)