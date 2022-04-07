from extractor import *
from spacy.matcher import Matcher

from final import *


# print('--------------------------------------------')
# cust_ent = extract_entity_sections_grad(d)
# print(cust_ent)


# nlp = spacy.load('en_core_web_sm')
# matcher = Matcher(nlp.vocab)
# print(extract_name(nlp(d), matcher))
# print(extract_name(nlp(d), matcher))

resume = 'C:\\Users\\Ahmed\\Desktop\\PFE\\Matching\\FR.pdf'

# d=extract_text(resume)

# print(extract_entities_wih_custom_model(nlp(d)))

ResumeParser(resume).details()