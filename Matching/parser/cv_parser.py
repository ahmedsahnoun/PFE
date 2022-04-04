import os
import io
import spacy
import docx2txt
import constants as cs
from pdfminer.converter import TextConverter
from pdfminer.pdfinterp import PDFPageInterpreter
from pdfminer.pdfinterp import PDFResourceManager
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFSyntaxError
from tika import parser
import pandas as pd


def extract_text_from_pdf(pdf_path):
	# https://www.blog.pythonlibrary.org/2018/05/03/exporting-data-from-pdfs-with-python/
	if not isinstance(pdf_path, io.BytesIO):
		# extract text from local pdf file
		with open(pdf_path, 'rb') as fh:
			try:
				for page in PDFPage.get_pages(
								fh,
								caching=True,
								check_extractable=True
				):
					resource_manager = PDFResourceManager()
					fake_file_handle = io.StringIO()
					converter = TextConverter(
						resource_manager,
						fake_file_handle,
						codec='utf-8',
						laparams=LAParams()
					)
					page_interpreter = PDFPageInterpreter(
						resource_manager,
						converter
					)
					page_interpreter.process_page(page)

					text = fake_file_handle.getvalue()
					yield text

					# close open handles
					converter.close()
					fake_file_handle.close()
			except PDFSyntaxError:
				return
	else:
		# extract text from remote pdf file
		try:
			for page in PDFPage.get_pages(
				pdf_path,
				caching=True,
				check_extractable=True
			):
				resource_manager = PDFResourceManager()
				fake_file_handle = io.StringIO()
				converter = TextConverter(
					resource_manager,
					fake_file_handle,
					codec='utf-8',
					laparams=LAParams()
				)
				page_interpreter = PDFPageInterpreter(
					resource_manager,
					converter
				)
				page_interpreter.process_page(page)

				text = fake_file_handle.getvalue()
				yield text

				# close open handles
				converter.close()
				fake_file_handle.close()
		except PDFSyntaxError:
			return


def get_number_of_pages(file_name):
	try:
		if isinstance(file_name, io.BytesIO):
			# for remote pdf file
			count = 0
			for page in PDFPage.get_pages(
				file_name,
				caching=True,
				check_extractable=True
			):
				count += 1
			return count
		else:
			# for local pdf file
			if file_name.endswith('.pdf'):
				count = 0
				with open(file_name, 'rb') as fh:
					for page in PDFPage.get_pages(
						fh,
						caching=True,
						check_extractable=True
					):
						count += 1
				return count
			else:
				return None
	except PDFSyntaxError:
		return None


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

def extract_text(file_path, extension):
	text = ''
	text2= ''
	if extension == '.pdf':
		raw = parser.from_file(file_path)
		text2 = raw['content']
		for page in extract_text_from_pdf(file_path):
			text += ' ' + page
	elif extension == '.docx':
		text = extract_text_from_docx(file_path)
	elif extension == '.doc':
		text = extract_text_from_doc(file_path)
	elif extension == '.txt':
		text = extract_text_from_txt(file_path)
	return [text,text2]

def extract_entity_sections_grad(text):
	text_split = [i.strip() for i in text.split('\n')]
	# sections_in_resume = [i for i in text_split if i.lower() in sections]
	entities = {}
	key = False
	for phrase in text_split:
		if len(phrase) == 1:
			p_key = phrase
		else:
			p_key = set(phrase.lower().split()) & set(cs.RESUME_SECTIONS_GRAD)
		try:
			p_key = list(p_key)[0]
		except IndexError:
			pass
		if p_key in cs.RESUME_SECTIONS_GRAD:
			entities[p_key] = []
			key = p_key
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
		months_of_experience = (months_of_experience.years
								* 12 + months_of_experience.months)
	except ValueError:
		return 0
	return months_of_experience


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
	if email:
		try:
			return email[0].split()[0].strip(';')
		except IndexError:
			return None


def extract_name(nlp_text, matcher):
	pattern = [cs.NAME_PATTERN]

	matcher.add('NAME', None, *pattern)

	matches = matcher(nlp_text)

	for _, start, end in matches:
		span = nlp_text[start:end]
		if 'name' not in span.text.lower():
			return span.text


def extract_mobile_number(text, custom_regex=None):
	if not custom_regex:
		mob_num_regex = r'''(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)
						[-\.\s]*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})'''
		phone = re.findall(re.compile(mob_num_regex), text)
	else:
		phone = re.findall(re.compile(custom_regex), text)
	if phone:
		number = ''.join(phone[0])
		return number


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


def cleanup(token, lower=True):
	if lower:
		token = token.lower()
	return token.strip()


def extract_education(nlp_text):
	edu = {}
	# Extract education degree
	try:
		for index, text in enumerate(nlp_text):
			for tex in text.split():
				tex = re.sub(r'[?|$|.|!|,]', r'', tex)
				if tex.upper() in cs.EDUCATION and tex not in cs.STOPWORDS:
					edu[tex] = text + nlp_text[index + 1]
	except IndexError:
		pass

	# Extract year
	education = []
	for key in edu.keys():
		year = re.search(re.compile(cs.YEAR), edu[key])
		if year:
			education.append((key, ''.join(year.group(0))))
		else:
			education.append(key)
	return education


def extract_experience(resume_text):
	wordnet_lemmatizer = WordNetLemmatizer()
	stop_words = set(stopwords.words('english'))

	# word tokenization
	word_tokens = nltk.word_tokenize(resume_text)

	# remove stop words and lemmatize
	filtered_sentence = [
			w for w in word_tokens if w not
			in stop_words and wordnet_lemmatizer.lemmatize(w)
			not in stop_words
		]
	sent = nltk.pos_tag(filtered_sentence)

	# parse regex
	cp = nltk.RegexpParser('P: {<NNP>+}')
	cs = cp.parse(sent)

	# for i in cs.subtrees(filter=lambda x: x.label() == 'P'):
	#     print(i)

	test = []

	for vp in list(
		cs.subtrees(filter=lambda x: x.label() == 'P')
	):
		test.append(" ".join([
			i[0] for i in vp.leaves()
			if len(vp.leaves()) >= 2])
		)

	# Search the word 'experience' in the chunk and
	# then print out the text after it
	x = [
		x[x.lower().index('experience') + 10:]
		for i, x in enumerate(test)
		if x and 'experience' in x.lower()
	]
	return x
