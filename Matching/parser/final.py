import os
import multiprocessing as mp
import io
import spacy
import pprint
from spacy.matcher import Matcher
from spacy_langdetect import LanguageDetector
from langdetect import detect
from extractor import *


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
		name,email,mobile,skills,cust_ent,experience,education,url = None,None,None,None,None,None,None,None
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
			entities = extract_entity_sections_grad(self.text_raw)
		except:
			pass
		try:
			experience = extract_experience(self.text_raw)
		except:
			pass
		try:
			url = extract_url(self.text)
		except:
			pass
		try:
			education = entities['College Name']
		except:
			pass
		# print('name: ',name)
		# print('------------------------------')
		# print('email: ',email)
		# print('------------------------------')
		# print('mobile: ',mobile)
		# print('------------------------------')
		# print('skills: ',skills)
		# print('------------------------------')
		# print('exp: ',exp)
		# print('------------------------------')
		# print('entities: ',entities)
		# print('------------------------------')
		# print('cust_ent: ',cust_ent)
		# print('------------------------------')
		return({
					'name':name,
					'email':email,
					'mobile':mobile,
					'url':url,
					'skills':skills,
					'experience':experience,
					'education':education
					})

	def details(self):
		print(self.get_details())

	def leng(self):
		print(detect(self.text))