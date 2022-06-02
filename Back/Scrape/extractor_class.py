from .parameters import *
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from os.path import exists
import time
import csv
from time import sleep

class extractor:

	driver = None

	def __init__(self):
		options = webdriver.ChromeOptions()
		options.add_argument('--ignore-certificate-errors')
		options.add_argument('--ignore-ssl-errors')
		options.add_argument('log-level=3')
		options.add_argument('user-data-dir=/tmp/tarun')
		self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),options=options)

	def __del__(self):
		try:
			self.driver.quit()
			print('exit 0')
		except Exception as e:
			print('exit 1')

	def search_in(self,n,field = None):
		self.driver.get('https://www.linkedin.com/search/results/people/?origin=SWITCH_SEARCH_VERTICAL&page=20')
		links = []
		
		if field:
			S = self.driver.find_element(by=By.XPATH, value=searchPath)
			S.send_keys(field)
			S.send_keys(Keys.RETURN)

		for j in range(n):
			WebDriverWait(self.driver, 5).until(EC.presence_of_element_located((By.XPATH, profilePath)))
			self.scroll()
			profiles = self.driver.find_elements(by=By.XPATH, value=profilePath)
			for i in range(len(profiles)):
				try:
					link = self.driver.find_element(by=By.XPATH, value=profilePath+'['+str(i+1)+']'+profileUrlPath).get_attribute('href')
					links.append(link)
				except:
					pass

			WebDriverWait(self.driver, 2).until(EC.presence_of_element_located((By.XPATH, nextPath)))
			next_button = self.driver.find_element(by=By.XPATH, value=nextPath) 
			next_button.click()
		
		return(links)
		
	def Login(self):
		self.driver.get('https://www.linkedin.com/uas/login')

		try:
			log_in_button = self.driver.find_element(by=By.CLASS_NAME, value='login__form_action_container ')
		except:
			return

		username = self.driver.find_element(by=By.ID, value='username')
		username.send_keys(linkedin_username)

		password = self.driver.find_element(by=By.ID, value='password')
		password.send_keys(linkedin_password)

		log_in_button = self.driver.find_element(by=By.CLASS_NAME, value='login__form_action_container ')
		log_in_button.click()

	def fieldExtract(self,path):
		try:
			WebDriverWait(self.driver, 1.5).until(EC.presence_of_element_located((By.XPATH, path)))
			value = self.driver.find_element(by=By.XPATH, value=path).text
			return (value)
		except:
			return(None)

	def extractSkills(self,url):
		skills = []

		#skills page
		self.driver.get(url+"/details/skills/")

		#scroll to bottom
		self.scroll()

		#skill extraction loop
		try:
			WebDriverWait(self.driver, 3).until(EC.presence_of_element_located((By.XPATH, rawSkillPath)))
			rawSkills = self.driver.find_elements(by=By.XPATH, value=rawSkillPath)
		except:
			return(skills)
		
		for i in range(len(rawSkills)):
			try:
				skill = self.driver.find_element(by=By.XPATH, value=rawSkillPath+'['+str(i+1)+']'+skillPath).text
				skills.append(skill)
			except:
				pass

		return(skills)

	def extractLangs(self,url):
		langs = []

		self.driver.get(url+"/details/languages/")

		self.scroll()

		try:
			WebDriverWait(self.driver, 3).until(EC.presence_of_element_located((By.XPATH, rawLangPath)))
			rawLangs = self.driver.find_elements(by=By.XPATH, value=rawLangPath)
		except:
			return(None)
		
		for i in range(len(rawLangs)):
			try:
				lang = self.driver.find_element(by=By.XPATH, value=rawLangPath+'['+str(i+1)+']'+langPath).text
				langs.append(lang)
			except:
				pass

		return(langs)

	def extractExps(self,url):
		Exps = []
		Exp,temps,details,comp = None,None,None,None

		#skills page
		self.driver.get(url+"/details/experience/")

		#scroll to bottom
		self.scroll()

		# skill extraction loop
		try:
			WebDriverWait(self.driver, 3).until(EC.presence_of_element_located((By.XPATH, rawExpPath)))
			rawExps = self.driver.find_elements(by=By.XPATH, value=rawExpPath)
		except:
			return(None)

		for i in range(len(rawExps)):
			try:
				Exp = self.driver.find_element(by=By.XPATH, value=rawExpPath+'['+str(i+1)+']'+expPath).text
				comp = self.driver.find_element(by=By.XPATH, value=rawExpPath+'['+str(i+1)+']'+compPath).text
				temps = self.driver.find_element(by=By.XPATH, value=rawExpPath+'['+str(i+1)+']'+tempsPath).text
				details = self.driver.find_element(by=By.XPATH, value=rawExpPath+'['+str(i+1)+']'+detailsPath).text
			except:
				pass
			Exps.append([Exp,comp,temps,details])

		return(Exps)

	def scroll(self):
		SCROLL_PAUSE_TIME = 0.5

		# Get scroll height
		sleep(SCROLL_PAUSE_TIME)
		last_height = self.driver.execute_script("return document.body.scrollHeight")

		while True:
			# Scroll down to bottom
			self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

			# Wait to load page
			time.sleep(SCROLL_PAUSE_TIME)

			# Calculate new scroll height and compare with last scroll height
			new_height = self.driver.execute_script("return document.body.scrollHeight")
			if new_height == last_height:
				break
			last_height = new_height

	def extract(self,url):

		self.driver.get(url)
		self.scroll()

		# name extraction
		name = self.fieldExtract(namePath)

		# location extraction
		location = self.fieldExtract(locationPath)
		sleep(0.1)

		# about extraction
		school = self.fieldExtract(schoolPath)
		sleep(0.2)

		# about extraction
		company = self.fieldExtract(companyPath)
		sleep(0.3)

		# email extraction
		self.driver.get(url+'/overlay/contact-info/')
		email = self.fieldExtract(emailPath)
		
		# phone extraction
		phone = self.fieldExtract(phonePath)

		#skills extraction
		skills = self.extractSkills(url)
		sleep(0.4)

		#Exps extraction
		exps = self.extractExps(url)
		sleep(0.5)

		#Languages extraction
		langs = self.extractLangs(url)
		sleep(0.6)
		
		resume = {
		"name": name,
		"email": email,
		"phone": phone,
		"url": url,
		"location": location,
		"school": school,
		"company": company,
		"skills": skills,
		"langs": langs,
		"experience": exps
		}

		return(resume)

	def extract_save(self,url, f=None):
		
		resume = self.extract(url)
		print(resume)

		if f:
			self.save(resume, f)
	
	def save(self,resume,f):
		if exists('./'+f):
			with open(f, 'a', newline='') as csvfile:
				fieldnames = ['name', 'email', 'phone', 'url', 'location', 'school', 'company', 'skills', 'langs', 'experience']
				writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
				writer.writerow(resume)
		else:
			with open(f, 'a', newline='') as csvfile:
				fieldnames = ['name', 'email', 'phone', 'url', 'location', 'school', 'company', 'skills', 'langs', 'experience']
				writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
				writer.writeheader()
				writer.writerow(resume) 