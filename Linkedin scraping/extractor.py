from parameters import *
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
from parsel import Selector
from bs4 import BeautifulSoup
import time
from time import sleep

def search_in(n,field = None):
   driver.get('https://www.linkedin.com/search/results/people')
   links = []
   
   if field:
      S = driver.find_element(by=By.XPATH, value=searchPath)
      S.send_keys(field)
      S.send_keys(Keys.RETURN)

   for j in range(n):
      scroll()
      profiles = driver.find_elements(by=By.XPATH, value=profilePath)
      for i in range(len(profiles)):
         try:
            link = driver.find_element(by=By.XPATH, value=profilePath+'['+str(i+1)+']'+profileUrlPath).get_attribute('href')
            links.append(link)
         except:
            pass

      WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, nextPath)))
      next_button = driver.find_element(by=By.XPATH, value=nextPath) 
      next_button.click()
   
   return(links)
   
def Login():
   driver.get('https://www.linkedin.com/uas/login')

   try:
      log_in_button = driver.find_element(by=By.CLASS_NAME, value='login__form_action_container ')
   except:
      return

   username = driver.find_element(by=By.ID, value='username')
   username.send_keys(linkedin_username)

   password = driver.find_element(by=By.ID, value='password')
   password.send_keys(linkedin_password)

   log_in_button = driver.find_element(by=By.CLASS_NAME, value='login__form_action_container ')
   log_in_button.click()

def fieldExtract(path):
   try:
      WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, path)))
      value = driver.find_element(by=By.XPATH, value=path).text
      return (value)
   except:
      return(None)

def extractSkills(url):
   skills = []

   #skills page
   driver.get(url+"/details/skills/")

   #scroll to bottom
   scroll()

   #skill extraction loop
   try:
      WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, rawSkillPath)))
      rawSkills = driver.find_elements(by=By.XPATH, value=rawSkillPath)
   except:
      return(skills)
   
   for i in range(len(rawSkills)):
      try:
         skill = driver.find_element(by=By.XPATH, value=rawSkillPath+'['+str(i+1)+']'+skillPath).text
         skills.append(skill)
      except:
         pass

   return(skills)

def extractLangs(url):
   langs = []

   driver.get(url+"/details/languages/")

   scroll()

   try:
      WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, rawLangPath)))
      rawLangs = driver.find_elements(by=By.XPATH, value=rawLangPath)
   except:
      return(None)
   
   for i in range(len(rawLangs)):
      try:
         lang = driver.find_element(by=By.XPATH, value=rawLangPath+'['+str(i+1)+']'+langPath).text
         langs.append(lang)
      except:
         pass

   return(langs)

def extractExps(url):
   Exps = []
   Exp,temps,details = None,None,None

   #skills page
   driver.get(url+"/details/experience/")

   #scroll to bottom
   scroll()

   # skill extraction loop
   try:
      WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, rawExpPath)))
      rawExps = driver.find_elements(by=By.XPATH, value=rawExpPath)
   except:
      return(None)

   for i in range(len(rawExps)):
      try:
         Exp = driver.find_element(by=By.XPATH, value=rawExpPath+'['+str(i+1)+']'+expPath).text
         temps = driver.find_element(by=By.XPATH, value=rawExpPath+'['+str(i+1)+']'+tempsPath).text
         details = driver.find_element(by=By.XPATH, value=rawExpPath+'['+str(i+1)+']'+detailsPath).text
      except:
         pass
      Exps.append([Exp,temps,details])

   return(Exps)

def scroll():
   SCROLL_PAUSE_TIME = 0.5

   # Get scroll height
   sleep(SCROLL_PAUSE_TIME)
   last_height = driver.execute_script("return document.body.scrollHeight")

   while True:
      # Scroll down to bottom
      driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

      # Wait to load page
      time.sleep(SCROLL_PAUSE_TIME)

      # Calculate new scroll height and compare with last scroll height
      new_height = driver.execute_script("return document.body.scrollHeight")
      if new_height == last_height:
         break
      last_height = new_height

def extract(url):

   driver.get(url)
   scroll()

   # name extraction
   name = fieldExtract(namePath)

   # location extraction
   location = fieldExtract(locationPath)
   sleep(0.1)

   # about extraction
   school = fieldExtract(schoolPath)
   sleep(0.2)

   # about extraction
   company = fieldExtract(companyPath)
   sleep(0.3)

   driver.get(url+'overlay/contact-info/')

   # email extraction
   email = fieldExtract(emailPath)
   
   # phone extraction
   phone = fieldExtract(phonePath)

   #skills extraction
   skills = extractSkills(url)
   sleep(0.4)

   #Exps extraction
   exps = extractExps(url)
   sleep(0.5)

   #Languages extraction
   langs = extractLangs(url)
   sleep(0.6)

   resume = {
      "name": name,
      "location": location,
      "school": school,
      "company": company,
      "email": email,
      "phone": phone,
      "skills": skills,
      "langs": langs,
      "Exps": exps
   }
   
   print("name = " , name)
   print("location= ", location)
   print("school= ", school)
   print("company= ", company)
   print("email= ", email)
   print("phone= ", phone)
   print("skills = ", skills)
   print("langs = ", langs)
   print("Exps = ", exps)
   print("--------------------------------------------")

   return(resume)

try:
   options = webdriver.ChromeOptions()
   options.add_argument('--ignore-certificate-errors')
   options.add_argument('--ignore-ssl-errors')
   options.add_argument('log-level=3')
   options.add_argument('user-data-dir=/tmp/tarun')
   driver = webdriver.Chrome(options=options)
   Login()

   # print(search_in(2))

   # links = search_in(2)[0:2]
   # for l in links:
   #    try:
   #       extract(l)
   #       sleep(1)
   #    except:
   #       pass

   # extract('https://www.linkedin.com/in/peterbschmidt')
   # extract('https://www.linkedin.com/in/omar-chaabouni/')
   # extract('https://www.linkedin.com/in/benhamouda/')
   # extract('https://www.linkedin.com/in/sirine-ben-hamida/')
   # extract('https://www.linkedin.com/in/fatima-ezzahra-ismaili-alaoui-41b4a03a')

   driver.quit()

except Exception as e:
   driver.quit()
   print('-----------'+str(e))