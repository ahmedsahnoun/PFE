from extractor import *
from spacy.matcher import Matcher

from final import *

# d=extract_text('C:\\Users\\Ahmed\\Desktop\\PFE\\Matching\\candidate_019.pdf', '.pdf')

# # model = spacy.load(os.path.dirname(os.path.abspath(__file__)))
# cust_ent = extract_entity_sections_grad(d[0])
# print(cust_ent)
# print('--------------------------------------------')
# cust_ent = extract_entity_sections_grad(d[1])
# print(cust_ent)


# nlp = spacy.load('en_core_web_sm')
# matcher = Matcher(nlp.vocab)
# print(extract_name(nlp(d[0]), matcher))
# print(extract_name(nlp(d[1]), matcher))

ResumeParser('C:\\Users\\Ahmed\\Desktop\\PFE\\Matching\\OmkarResume.pdf').get_details()