from django.http import JsonResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomUserSerializer,FileSerializer
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from .models import CustomUser, FileUpload , SavedJob
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
import pickle
import pandas as pd
import math
from PyPDF2 import PdfReader
from collections import Counter
from rest_framework.response import Response
from django.http import JsonResponse
import re
import nltk
from nltk.corpus import stopwords as StopWords
from nltk.stem import PorterStemmer

from nltk.corpus import stopwords

# import pypdf
from PyPDF2 import PdfReader
from .extract_skills import extract_skills,extract_education,skills,education
@api_view(['GET','POST'])
def home(request):
    return Response("hpa", status=status.HTTP_200_OK)


@api_view(['POST'])
def register_user(request):
    if request.method == "POST":
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def login(request):
    if request.method == "POST":
        username = request.data.get('username')
        password = request.data.get('password')
        print(username)
        csrf_token = get_token(request)
        # Ensure username and password are provided
        if not username or not password:
            return Response({"error": "Username and Password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate user
        user = authenticate(username=username, password=password)

        # Check if authentication failed
        if user is None:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

        # If user is authenticated, create or get the token
        token, created = Token.objects.get_or_create(user=user)
        print(token.key)
        return Response({"token": token.key,'csrfToken': csrf_token,'username':user.username,'password':user.password}, status=status.HTTP_200_OK)
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try :
        print(request.user)
        token=Token.objects.get(user=request.user)
        if token:
            token.delete()
            return Response({"message":"Logout Success"},status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error":f"Error: {str(e)}"},status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def file_upload(request):
    print(request.headers.get('Authorization'))
    if request.user.is_authenticated:
        try:
            print(request.user)
            token=Token.objects.get(user=request.user).key
            print(token)
            if 'file' not in request.FILES:
                return Response({'error': 'No file was submitted.'}, status=status.HTTP_400_BAD_REQUEST)
            serializer = FileSerializer(data=request.data, context={'user': request.user})
            if serializer.is_valid():
                serializer.save()
                token=Token.objects.get(user=request.user).key
                print(Token.objects.get(user=request.user).key)
                return JsonResponse({'message': 'File uploaded successfully!'}, status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response({'error': 'Token does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'POST'])
def file_upload(request):
    print(request.user)
    try:
        if 'file' not in request.FILES:
            return Response({'error': 'No file was submitted.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Pass the user context to the serializer
        serializer = FileSerializer(data=request.data, context={'user': request.user})
        
        if serializer.is_valid():
            serializer.save()
            # Get the token for the user
            token = Token.objects.get(user=request.user).key
            print(token)
            return Response({'message': 'File uploaded successfully!'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ObjectDoesNotExist:
        return Response({'error': 'Token does not exist'}, status=status.HTTP_400_BAD_REQUEST)



nltk.download("stopwords")

stemmer = PorterStemmer()
stop_words = set(stopwords.words("english"))

def preprocess_text(text):
    """Preprocess text by lowercasing, removing non-alphanumeric characters, stemming, and filtering stopwords."""
    if not text or not isinstance(text, str):
        return ""
    
    cleaned_text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    tokens = nltk.word_tokenize(cleaned_text.lower())
    
    words = []
    for token in tokens:
        # Only process words that are at least 2 characters
        if len(token) > 1:
            stemmed_word = stemmer.stem(token)
            # Check if the stemmed word is not a stopword
            if stemmed_word not in stop_words:
                words.append(stemmed_word)
    
    return " ".join(words)

def compute_tf(text):
    """Compute Term Frequency"""
    processed_text = preprocess_text(text)
    if not processed_text:
        return {}
        
    tokens = processed_text.split()
    tf_counter = Counter(tokens)
    total_words = len(tokens)
    
    # Avoid division by zero
    if total_words == 0:
        return {}
        
    return {word: count / total_words for word, count in tf_counter.items()}

def compute_idf(documents):
    """Compute Inverse Document Frequency (IDF)"""
    # Handle empty document list
    if not documents:
        return {}
        
    total_docs = len(documents)
    word_doc_count = Counter()

    # Count documents containing each word
    for doc in documents:
        # Process each document and get unique words
        processed_doc = preprocess_text(doc)
        if processed_doc:
            unique_words = set(processed_doc.split())
            word_doc_count.update(unique_words)

    # Calculate IDF for each word with smoothing (add 1 to prevent division by zero)
    idf = {}
    for word, count in word_doc_count.items():
        # Improved IDF formula with smoothing
        idf[word] = math.log((total_docs + 1) / (count + 1)) + 1
        
    return idf

def compute_tfidf_vector(text, idf_values):
    """Compute TF-IDF vector for a single document"""
    if not text or not idf_values:
        return {}
        
    tf_values = compute_tf(text)
    
    # Return TF-IDF for each word
    tfidf = {}
    for word in tf_values:
        tfidf[word] = tf_values[word] * idf_values.get(word, 0)
    
    return tfidf

def compute_tfidf(documents):
    """Compute TF-IDF for a list of documents"""
    # Get IDF values for corpus
    idf = compute_idf(documents)
    
    # Compute TF-IDF for each document
    tfidf_documents = []
    for doc in documents:
        tfidf = compute_tfidf_vector(doc, idf)
        tfidf_documents.append(tfidf)
    
    return tfidf_documents, idf

def cosine_similarity(vec1, vec2):
    """Compute cosine similarity between two vectors"""
    # Handle empty vectors
    if not vec1 or not vec2:
        return 0.0
        
    # Find common terms
    intersection = set(vec1.keys()) & set(vec2.keys())
    
    # If no common terms, similarity is 0
    if not intersection:
        return 0.0
        
    # Calculate dot product
    numerator = sum(vec1[x] * vec2[x] for x in intersection)
    
    # Calculate magnitudes
    sum1 = sum(value ** 2 for value in vec1.values())
    sum2 = sum(value ** 2 for value in vec2.values())
    
    # Calculate denominator (product of magnitudes)
    denominator = math.sqrt(sum1) * math.sqrt(sum2)
    
    # Avoid division by zero
    if denominator == 0:
        return 0.0
        
    return numerator / denominator

def process_pdf(file_path, max_pages=3):
    """Extract text from a PDF file."""
    try:
        with open(file_path, "rb") as f:
            reader = PdfReader(f)
            text = "".join(page.extract_text() or "" for page in reader.pages[:max_pages])
            return text[:50000]  # Limit to 50K characters
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        return ""

@api_view(["GET", "POST"])
def recommend_jobs(request, username):

    skills = [
            "Python", "Java", "JavaScript", "SQL", "NoSQL", "HTML", "CSS", "React",
            "Angular", "Vue", "Node.js", "Django", "Flask", "Spring", "Docker",
            "Kubernetes", "AWS", "Azure", "GCP", "Git", "REST API", "GraphQL",
            "Machine Learning", "Data Analysis", "Data Science", "Tensorflow",
            "PyTorch", "NLP", "Computer Vision", "Agile", "Scrum", "DevOps",
            "CI/CD", "Testing", "Automation", "Leadership", "Communication"
        ]
        
    education = [
            "Bachelor", "Master", "PhD", "Associate", "Diploma", "Certificate",
            "Computer Science", "Information Technology", "Engineering", 
            "Business Administration", "Data Science", "Statistics", "Mathematics",
            "Artificial Intelligence", "Machine Learning", "Computer Engineering"
        ]
    
    """Recommend jobs based on resume content using TF-IDF and cosine similarity."""
    try:
        if not username:
            return Response({"error": "Username is required"}, status=400)

        # Retrieve user and uploaded resume
        user = CustomUser.objects.filter(username=username).first()
        print(user)
        if not user:
            return Response({"error": "User not found"}, status=404)

        file = FileUpload.objects.filter(user=user).last()
        if not file:
            return Response({"error": "No resume found"}, status=404)

        # Extract resume content
        text = process_pdf(file.file.path)
        print(text)
        if not text:
            return Response({"error": "Error processing resume"}, status=500)

        # Extract skills and education from resume
        user_skill = extract_skills(text, skills)
        user_education = extract_education(text, education)
        user_qualification = f"{user_skill} {user_education}".strip()
        print(user_qualification+ "qualifications")

        if not user_qualification:
            return Response({"error": "No qualifications extracted from resume"}, status=400)

        # Load job data
        try:
            df = pd.read_csv("static/job_descriptions.csv")
            # Limit sample size for better performance if needed
            if len(df) > 10000:
                df = df.sample(100000, random_state=42)
                
            if df.empty:
                return Response({"error": "Job descriptions dataset is empty"}, status=500)

            # Load cleaned job descriptions
            cleaned_df = pd.read_csv("static/cleaned_data.csv")
            # Ensure same sample size and order as original dataframe
            if len(cleaned_df) > 10000:
                cleaned_df = cleaned_df.sample(100000, random_state=42)
                
            if cleaned_df.empty:
                return Response({"error": "Cleaned job descriptions dataset is empty"}, status=500)

            # Combine skills and qualifications into a single list
            job_descriptions = []
            for _, row in cleaned_df.iterrows():
                skills = str(row.get("skills", "")) if not pd.isna(row.get("skills", "")) else ""
                quals = str(row.get("qualifications", "")) if not pd.isna(row.get("qualifications", "")) else ""
                job_descriptions.append(f"{skills} {quals}".strip())

        except Exception as e:
            return Response({"error": f"Error loading job data: {str(e)}"}, status=500)

        # Compute TF-IDF for job descriptions
        job_tfidf_vectors, idf_values = compute_tfidf(job_descriptions)
        job_tfidf_vectors, idf_values = compute_tfidf(job_descriptions)
        # Compute TF-IDF for user qualification
        user_tfidf = compute_tfidf_vector(user_qualification, idf_values)
        print(user_tfidf)
        
        # Compute similarities
        similarities = []
        for job_tfidf in job_tfidf_vectors:
            sim = cosine_similarity(user_tfidf, job_tfidf)
            similarities.append(sim)
        
        # Add similarity scores to the dataframe
        df["Similarity"] = similarities
        
        # Remove duplicates and sort by similarity
        top_jobs = df.sort_values(by="Similarity", ascending=False)
        top_jobs = top_jobs.drop_duplicates(subset=['Job Title'])
        
        # Log some information for debugging
        print(f"User qualification length: {len(user_qualification.split())}")
        print(f"User TF-IDF terms: {len(user_tfidf)}")
        print(f"Number of job descriptions: {len(job_descriptions)}")
        print(f"Top similarity score: {top_jobs['Similarity'].max()}")
        
        # Return top jobs (limited to 10)
        return JsonResponse({
            "recommendations": top_jobs.head(10).to_dict(orient="records"), 
            "status": "success"
        })

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return Response({"error": "An unexpected error occurred", "details": str(e)}, status=500)


def ats_score_computation(request):
    """Compute ATS score based on job description and resume similarity."""
    if request.method == "POST":
        try:
            user = CustomUser.objects.get(username=request.user.username)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        file = FileUpload.objects.filter(user=user).last()
        if not file:
            return Response({"error": "No resume found"}, status=404)

        text = process_pdf(file.file.path)
        if not text:
            return Response({"error": "Error processing resume"}, status=500)

        user_skill = extract_skills(text,skills)
        if not user_skill:
            return Response({"error": "No skills extracted from resume"}, status=400)

        job_description = request.data.get("job_description", " ")
        if not job_description:
            return Response({"error": "No job description provided"}, status=400)

         # Extract skills and education from job desc
        jobs_skill = extract_skills(job_description, skills)
        jobs_education = extract_education(job_description, education)
        jobs_qualification = f"{jobs_skill} {jobs_education}".strip()
        print("line 293", jobs_qualification)

        # Clean job description
        cleaned_job_description = preprocess_text(jobs_qualification)

        # Compute TF-IDF
        job_tf = compute_tf(cleaned_job_description)

        user_tf = compute_tf(user_skill)

        vocabulary = set(job_tf.keys()).union(set(user_tf.keys()))
  
        idf_jobs = compute_idf_ats([jobs_qualification, user_skill])
    

        job_tfidf = {word: job_tf[word] * idf_jobs.get(word, 0) for word in job_tf}
        user_tfidf = {word: user_tf[word] * idf_jobs.get(word, 0) for word in user_tf}


        similarity = cosine_similarity(user_tfidf, job_tfidf)

        return Response({"similarity_score": similarity, "status": "success"}, status=200)

    return Response({"error": "Invalid request method"}, status=400)

@api_view(['POST'])
def save_job(request):
    if request.method == "POST":
        try:
            user = CustomUser.objects.get(username=request.user.username)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
    else:
        return Response({'error':"Only Post method is allowed"})
    job_title = request.data.get("job_title")
    job_description = request.data.get("job_description")
    job_similarity = request.data.get("job_similarity", 0.0)  # Optional

    if not job_title or not job_description:
        return Response(
            {"error": "Job title and job description are required."},
            status=400)
    try:
        # Create a new SavedJob entry for the user.
        saved_job = SavedJob.objects.create(
            user=user,
            job_title=job_title,
            job_description=job_description,
            job_similarity=job_similarity
        )
        message = f"{user.username} has successfully saved the job: {job_title}"
    except Exception as e:
        return Response(
            {"error": "Could not save job", "details": str(e)},
            status=500
        )

    print(message)
    return Response({"message": message}, status=201)
@api_view(['GET'])
def applied_job(request):
    try:
        user = CustomUser.objects.get(username=request.user.username)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    save_job = SavedJob.objects.filter(user=user) 
    print(save_job)
    if not save_job:
        return Response({"message": f"{user.username} has no saved jobs"})
    job_titles = [job.job_title for job in save_job]
    job_descriptions=[job.job_description for job in save_job]
    job_company_name=[job.job_company for job in save_job]
    
    return Response({"username": user.username,
        "job_title": job_titles,
        "job_company":job_company_name,
        "job_description":job_descriptions})