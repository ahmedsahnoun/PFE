from resume_parser import resumeparse
import pyresparser


def scan_resume(resume):
    data = resumeparse.read_file(resume)
    for i, j in data.items():
        print(f"{i}:>>{j}")
    
scan_resume("C:\\Users\\Ahmed\\Desktop\\PFE\\Matching\\candidate_004.pdf")