from extractor_class import extractor

#extractor object
ex = extractor()

#fonction log in sur linked in
ex.Login()

#recherche des URL des profile avec mots clés 'data science'
#search_in(nombre des pages,mots clés)
sample = ex.search_in(2,'data science')
print(sample)

#extraction du CV à partir d'un URL de profile
#extract(url,output_csv)
ex.extract(sample[2],'Resumes.csv')