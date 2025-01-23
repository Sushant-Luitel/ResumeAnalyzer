import re

skills = [
    'Python', 'Django', 'Machine Learning', 'JavaScript', 'React', 'SQL', 'Java', 'Node.js', 'HTML', 'CSS', 
    'Flask', 'Keras', 'TensorFlow', 'Ruby', 'C++', 'PHP', 'PostgreSQL', 'AWS', 'Azure', 'Git', 'Docker', 'Angular','MySql','PostgressSql',
]
def extract_skills(text, skills):
    found_skills = []
    for skill in skills:
        # Search for each skill in the text (case insensitive)
        if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
            found_skills.append(skill)
    return found_skills