import os
import io
import re
import spacy
import docx2txt
from . import constants as cs
import nltk
from datetime import datetime
from dateutil import relativedelta
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from tika import parser
import pandas as pd

def extract_text_from_docx(doc_path):
	try:
		temp = docx2txt.process(doc_path)
		text = [line.replace('\t', ' ') for line in temp.split('\n') if line]
		return ' '.join(text)
	except KeyError:
		return ' '

def extract_text_from_doc(doc_path):
	try:
		try:
			import textract
		except ImportError:
			return ' '
		temp = textract.process(doc_path).decode('utf-8')
		text = [line.replace('\t', ' ') for line in temp.split('\n') if line]
		return ' '.join(text)
	except KeyError:
		return ' '

def extract_text(file_path):

	if not isinstance(file_path, io.BytesIO):
		extension = os.path.splitext(file_path)[1].split('.')[1]
	else:
		extension = file_path.name.split('.')[1]
	text = ''
	if extension == 'pdf':
		raw = parser.from_file(file_path)
		text = raw['content']
	elif extension == 'docx':
		text = extract_text_from_docx(file_path)
	elif extension == 'doc':
		text = extract_text_from_doc(file_path)
	elif extension == 'txt':
		text = extract_text_from_txt(file_path)
	return text

def extract_entity_sections_grad(text):
	text_split = [i.strip() for i in text.split('\n')]
	entities ={}
	key = False
	for phrase in text_split:
		if len(phrase) == 1:
			p_key = phrase.lower()
		else:
			p_key = set(phrase.lower().split()) & set(cs.SECTIONS)
		try:
			p_key = list(p_key)[0]
		except IndexError:
			pass
		if p_key in cs.SECTIONS:
			if p_key in cs.ED:
				key = 'education'
			elif p_key in cs.EXP:
				key = 'experience'
			else:
				key = p_key
			entities[key] = []
		elif key and phrase.strip():
			entities[key].append(phrase)
	return entities

def extract_entities_wih_custom_model(custom_nlp_text):
	entities = {}
	for ent in custom_nlp_text.ents:
		if ent.label_ not in entities.keys():
			entities[ent.label_] = [ent.text]
		else:
			entities[ent.label_].append(ent.text)
	for key in entities.keys():
		entities[key] = list(set(entities[key]))
	return entities


def get_total_experience(experience_list):
	exp_ = []
	for line in experience_list:
		experience = re.search(
			r'(?P<fmonth>\w+.\d+)\s*(\D|to)\s*(?P<smonth>\w+.\d+|present)',
			line,
			re.I
		)
		if experience:
			exp_.append(experience.groups())
	total_exp = sum(
		[get_number_of_months_from_dates(i[0], i[2]) for i in exp_]
	)
	total_experience_in_months = total_exp
	return total_experience_in_months


def get_number_of_months_from_dates(date1, date2):
	if date2.lower() == 'present':
		date2 = datetime.now().strftime('%b %Y')
	try:
		if len(date1.split()[0]) > 3:
			date1 = date1.split()
			date1 = date1[0][:3] + ' ' + date1[1]
		if len(date2.split()[0]) > 3:
			date2 = date2.split()
			date2 = date2[0][:3] + ' ' + date2[1]
	except IndexError:
		return 0
	try:
		date1 = datetime.strptime(str(date1), '%b %Y')
		date2 = datetime.strptime(str(date2), '%b %Y')
		months_of_experience = relativedelta.relativedelta(date2, date1)
		months_of_experience = (months_of_experience.years * 12 + months_of_experience.months) + 1
	except ValueError:
		return 0
	return months_of_experience

def get_experience_time_linkedin(dates):
	total_experience_in_months = 0
	i = dates.split(' ')
	if i[3].lower() == 'present':
		total_experience_in_months = get_number_of_months_from_dates(i[0]+' '+i[1], i[3])
	else:
		total_experience_in_months = get_number_of_months_from_dates(i[0]+' '+i[1], i[3]+' '+i[4])
	return total_experience_in_months

def extract_entity_sections_professional(text):
	text_split = [i.strip() for i in text.split('\n')]
	entities = {}
	key = False
	for phrase in text_split:
		if len(phrase) == 1:
			p_key = phrase
		else:
			p_key = set(phrase.lower().split()) \
					& set(cs.RESUME_SECTIONS_PROFESSIONAL)
		try:
			p_key = list(p_key)[0]
		except IndexError:
			pass
		if p_key in cs.RESUME_SECTIONS_PROFESSIONAL:
			entities[p_key] = []
			key = p_key
		elif key and phrase.strip():
			entities[key].append(phrase)
	return entities


def extract_email(text):
	email = re.findall(r"([^@|\s]+@[^@]+\.[^@|\s]+)", text)
	return email[0].split()[0]

def extract_url(text):
	urls = re.findall(r"(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^\s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^\s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^\s]{2,}|www.[a-zA-Z0-9]+.[^\s]{2,})", text)
	for url in urls:
		if 'linkedin' in url:
			return url

def extract_name(nlp_text, matcher):
	pattern = [cs.NAME_PATTERN]

	matcher.add('NAME', None, *pattern)

	matches = matcher(nlp_text)
	
	for _, start, end in matches:
		span = nlp_text[start:end]
		if 'name' not in span.text.lower():
			return span.text


def extract_mobile_number(text):
	numbers = re.findall(r"(?:[0-9]\s?){8}(?:[0-9]\s?)*", text)
	return numbers[0].strip()


def extract_skills(nlp_text, noun_chunks, skills_file=None):
	tokens = [token.text for token in nlp_text if not token.is_stop]
	if not skills_file:
		data = pd.read_csv(
			os.path.join(os.path.dirname(__file__), 'skills.csv')
		)
	else:
		data = pd.read_csv(skills_file)
	skills = list(data.columns.values)
	skillset = []
	# check for one-grams
	for token in tokens:
		if token.lower() in skills:
			skillset.append(token)

	# check for bi-grams and tri-grams
	for token in noun_chunks:
		token = token.text.lower().strip()
		if token in skills:
			skillset.append(token)
	return [i.capitalize() for i in set([i.lower() for i in skillset])]