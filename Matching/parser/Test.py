from cv_parser import *

d=extract_text('C:\\Users\\Ahmed\\Desktop\\PFE\\Matching\\candidate_019.pdf', '.pdf')

# model = spacy.load(os.path.dirname(os.path.abspath(__file__)))
cust_ent = extract_entity_sections_grad(d[0])
print(cust_ent)
print('--------------------------------------------')
cust_ent = extract_entity_sections_grad(d[1])
print(cust_ent)