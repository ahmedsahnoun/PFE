from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize
from scipy.sparse import lil_matrix
from sklearn.metrics.pairwise import euclidean_distances, cosine_similarity
from utils import *

class matcher:
	
	vectorizer = TfidfVectorizer()
	matrix = None
	ids = None

	def train(self,Resumes,ids):
		self.vectorizer.fit(Resumes)
		self.matrix = self.vectorizer.transform(Resumes)
		self.ids = ids

	def top_matches(self,job_offer_description):
		job_offer = self.vectorizer.transform([job_offer_description])

		sparseMatrix = lil_matrix((self.matrix.shape[0], self.matrix.shape[1]))

		for i in job_offer.indices:
			sparseMatrix[:,i] = self.matrix[:,i]

		distances = cosine_similarity(job_offer,sparseMatrix)
		indices = (-distances[0]).argsort().tolist()
		result = [{'_id' : str(self.ids[i]), 'score': distances[0][i]*100} for i in indices]

		# normalize(sparseMatrix, axis=1)
		# indices = (-distances[0]).argsort().tolist()
		# distances = euclidean_distances(job_offer,sparseMatrix)
		# result = [{'_id' : str(self.ids[i]), 'score': score(distances[0][i])} for i in indices]

		return(result)