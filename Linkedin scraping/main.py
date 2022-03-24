from extractor_class import extractor
from time import sleep

#extractor object
ex = extractor()

#fonction log in sur linked in
ex.Login()

#recherche des URL des profile avec mots clés 'data science'
#search_in(nombre des pages,mots clés)
sample = ex.search_in(10)
with open('somefile.txt', 'a') as the_file:
	for cv in sample:
		the_file.write(cv+'\n')

#extraction du CV à partir d'un URL de profile
#extract(url)
for cv in sample:
	try:
		ex.extract(cv,'Data.csv')
		sleep(1.4)
	except:
		pass