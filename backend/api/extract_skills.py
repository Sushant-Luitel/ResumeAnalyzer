import re

# List of skills and education keywords
skills = [
    'Python', 'Django', 'Machine Learning', 'JavaScript', 'React', 'SQL', 'Java', 'Node.js', 'HTML', 'CSS', 
    'Flask', 'Keras', 'TensorFlow', 'Ruby', 'C++', 'PHP', 'PostgreSQL', 'AWS', 'Azure', 'Git', 'Docker', 'Angular',
    'MySql','PostgressSql', 'frontend framework','backend framework','Django rest framework',
    'DjangoRestFramework','ReactJs','ReactNative','React Native', "git"
]

education = [
    'MBA', 'Bsc.CSIT', 'BIM', 'Btech', 'Phd', 'Msc', 'Bsc', 'BBA', 'BBS', 'Bsc.IT', 'Bsc.CS', 'Bsc.CSIT',
    'Bachelors in Computer Science and Information Technology', 'bachelor in Information Technology',
    'Bachelors in Information Technology', 'Bachelors in Computer Science', 
    'Bachelors in Computer Engineering', 'Bachelors in Computer Application', 
    'Bachelors in Computer Science and Engineering', 'Bachelor in CSIT'
]

def extract_skills(text, skills):
    found_skills = []
    for skill in skills:
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
            found_skills.append(skill)
        #recommend garne bela input string ma xa
    res_skills = " ".join(found_skills)
    return res_skills

def extract_education(text, education):
    found_education = []
    for edu in education:
        if re.search(r'\b' + re.escape(edu) + r'\b', text, re.IGNORECASE):
            found_education.append(edu)
    res_education = " ".join(found_education)
    return res_education
