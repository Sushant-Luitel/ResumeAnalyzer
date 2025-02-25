import re

# List of skills and education keywords
skills = [
    'Python', 'Django', 'Machine Learning', 'JavaScript', 'React', 'SQL', 'Java', 'Node.js', 'HTML', 'CSS', 'Microsoft office'
    'Flask', 'Keras', 'TensorFlow', 'Ruby', 'C++', 'PHP', 'PostgreSQL', 'AWS', 'Azure', 'Git', 'Docker', 'Angular',
    'MySql','PostgressSql', 'frontend framework','backend framework','Django rest framework',
    'DjangoRestFramework','ReactJs','ReactNative','React Native', 'git',
    'Python', 'Java', 'JavaScript', 'SQL', 'NoSQL', 'HTML', 'CSS', 'React',
    'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring', 'Docker',
    'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'REST API', 'GraphQL',
    'Machine Learning', 'Data Analysis', 'Data Science', 'Tensorflow',
    'PyTorch', 'NLP', 'Computer Vision', 'Agile', 'Scrum', 'DevOps',
    'CI/CD', 'Testing', 'Automation', 'Leadership', 'Communication','Rust'
        ]

education = [
    'MBA', 'Bsc.CSIT', 'BIM', 'Btech', 'Phd', 'Msc', 'Bsc', 'BBA', 'BBS', 'Bsc.IT', 'Bsc.CS', 'Bsc.CSIT',
    'Bachelors in Computer Science and Information Technology', 'bachelor in Information Technology',
    'Bachelors in Information Technology', 'Bachelors in Computer Science', 
    'Bachelors in Computer Engineering', 'Bachelors in Computer Application', 
    'Bachelors in Computer Science and Engineering', 'Bachelor in CSIT',
    'Bachelor', 'Master', 'PhD', 'Associate', 'Diploma', 'Certificate',
    'Computer Science', 'Information Technology', 'Engineering', 
    'Business Administration', 'Data Science', 'Statistics', 'Mathematics',
    'Artificial Intelligence', 'Machine Learning', 'Computer Engineering'
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
