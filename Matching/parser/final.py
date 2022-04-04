import os
import multiprocessing as mp
import io
import spacy
import pprint
from spacy.matcher import Matcher
from extractor import *


class ResumeParser(object):

	def __init__(self,resume):
		nlp = spacy.load('en_core_web_sm')
		self.matcher = Matcher(nlp.vocab)
		self.custom_nlp = spacy.load(os.path.dirname(os.path.abspath(__file__)))
		self.details = {
			'name': None,
			'email': None,
			'mobile_number': None,
			'skills': None,
			'college_name': None,
			'degree': None,
			'designation': None,
			'experience': None,
			'company_names': None,
			'no_of_pages': None,
			'total_experience': None,
		}

		self.resume = resume
		
		if not isinstance(self.resume, io.BytesIO):
			ext = os.path.splitext(self.resume)[1].split('.')[1]
		else:
			ext = self.resume.name.split('.')[1]
		
		self.text_raw = extract_text(self.resume, '.' + ext)[1]
		self.text = ' '.join(self.text_raw.split())

		self.nlp = nlp(self.text)
		self.custom_nlp = self.custom_nlp(self.text_raw)
		self.noun_chunks = list(self.nlp.noun_chunks)

	def get_details(self):
		cust_ent = extract_entities_wih_custom_model(self.custom_nlp)
		name = extract_name(self.nlp, matcher=self.matcher)
		email = extract_email(self.text)
		print(name,email)