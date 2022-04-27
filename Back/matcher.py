from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import lil_matrix
from sklearn.metrics.pairwise import euclidean_distances
from math import log

class matcher:
	
	vectorizer = TfidfVectorizer()
	matrix = None

	def train(self,Resumes):
		self.vectorizer.fit(Resumes)
		self.matrix = self.vectorizer.transform(Resumes)


	def top_matches(self,job_offer_description,n):
		job_offer = self.vectorizer.transform([job_offer_description])

		sparseMatrix = lil_matrix((self.matrix.shape[0], self.matrix.shape[1]))

		for i in job_offer.indices:
			sparseMatrix[:,i] = self.matrix[:,i]

		sparseMatrix

		matches = euclidean_distances(job_offer,sparseMatrix)

		indices = (matches[0]).argsort()[:n].tolist()
		distances = [matches[0][i] for i in indices]
		scores = [1/(1+log(1+matches[0][i]))*100 for i in indices]

		result = {'indices':indices, 'distances':distances, 'scores':scores, }

		return(result)

# Resumes = []

# import csv
# with open('C:\\Users\\Ahmed\\Desktop\\PFE\\Linkedin scraping\\Data.csv', 'r', encoding="ISO-8859-1") as f:
# 	ereader = csv.DictReader(f)
# 	for row in ereader:
# 		Resumes.append(row['skills'])

# tfidf = matcher()

# tfidf.train(Resumes)
# job_offer_description = "'Java', 'JEE', 'SQL', 'Python', 'machine learning', 'Raspberry Pi', 'c', 'Spring Boot', 'MongoDB', 'Leadership', 'Raspberry', 'Pi'"
# print(tfidf.top_matches(job_offer_description,5))