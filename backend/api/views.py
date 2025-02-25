from django.http import JsonResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomUserSerializer,FileSerializer
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from .models import CustomUser, FileUpload
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



# Download stopwords if not available
nltk.download("stopwords")

stemmer = PorterStemmer()
stop_words = set(stopwords.words("english"))

def preprocess_text(text):
    """Preprocess text by lowercasing, removing non-alphanumeric characters, stemming, and filtering stopwords."""
    if isinstance(text, list):  
        text = " ".join(text)  # Convert list to string
    text = re.sub(r"[^a-z0-9\s]", "", text.lower())  # Clean and lowercase text
    words = [word for word in text.split() if len(word) > 1 and word not in stop_words]  # Remove short words and stopwords
    return [stemmer.stem(word) for word in words]  # Apply stemming

def compute_tf(text):
    """Compute Term Frequency (TF)"""
    words = preprocess_text(text)
    total_words = len(words)
    tf_counter = Counter(words)
    return {word: count / total_words for word, count in tf_counter.items()} if total_words > 0 else {}

def compute_idf(documents):
    """Compute Inverse Document Frequency (IDF)"""
    total_docs = len(documents)
    word_doc_count = Counter()

    for doc in documents:
        word_doc_count.update(set(preprocess_text(doc)))  # Ensure unique words per document

    return {word: math.log((total_docs + 1) / (1 + count)) for word, count in word_doc_count.items()}


def compute_idf_ats(documents):
    """Compute Inverse Document Frequency (IDF)"""
    total_docs = len(documents)
    word_doc_count = Counter()

    for doc in documents:
        tokens = set(preprocess_text(doc))
        for token in tokens:
            word_doc_count[token] = word_doc_count.get(token, 0) + 1

    return {word: math.log((total_docs + 1) / (1 + count)) + 1 for word, count in word_doc_count.items()}

def cosine_similarity(vec1, vec2):
    """Compute cosine similarity between two TF-IDF vectors"""
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum(vec1[x] * vec2[x] for x in intersection)
    sum1 = sum(value ** 2 for value in vec1.values())
    sum2 = sum(value ** 2 for value in vec2.values())
    denominator = math.sqrt(sum1) * math.sqrt(sum2)
    return float(numerator) / denominator if denominator else 0.0

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
    """Recommend jobs based on resume content using TF-IDF and cosine similarity."""
    try:
        if not username:
            return Response({"error": "Username is required"}, status=400)

        # Retrieve user and uploaded resume
        user = CustomUser.objects.filter(username=username).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        file = FileUpload.objects.filter(user=user).last()
        if not file:
            return Response({"error": "No resume found"}, status=404)

        # Extract resume content
        text = process_pdf(file.file.path)
        if not text:
            return Response({"error": "Error processing resume"}, status=500)

        # Extract skills and education from resume
        user_skill = extract_skills(text, skills)
        user_education = extract_education(text, education)
        user_qualification = f"{user_skill} {user_education}".strip()
        print(user_qualification+ "qualifications")

        if not user_qualification:
            return Response({"error": "No qualifications extracted from resume"}, status=400)

        # Load job data (only once)
        try:
            df = pd.read_csv("static/job_descriptions.csv")
            df=df.sample(10000)
            if df.empty:
                return Response({"error": "Job descriptions dataset is empty"}, status=500)

            # Load cleaned job descriptions from pickle file
            # with open(, "rb") as fp:
            #     cleaned_df = pickle.load(fp)
            cleaned_df = pd.read_csv("static/cleaned_data.csv")   
            cleaned_df=cleaned_df.sample(10000)
            # Ensure the cleaned data is not empty
            if cleaned_df.empty:
                return Response({"error": "Cleaned job descriptions dataset is empty"}, status=500)

            # Combine skills and qualifications into a single list
            job_descriptions = (cleaned_df["skills"] + " " + cleaned_df["qualifications"]).tolist()
            print(job_descriptions[0])
            

        except Exception as e:
            return Response({"error": f"Error loading job data: {str(e)}"}, status=500)

        # Compute TF-IDF for job descriptions and user qualifications
        idf_jobs = compute_idf(job_descriptions)
        tfidf_jobs = [compute_tf(doc) for doc in job_descriptions]
        user_tf = compute_tf(user_qualification)

        # Compute TF-IDF for user and calculate cosine similarity
        user_tfidf = {word: user_tf[word] * idf_jobs.get(word, 0) for word in user_tf}
        similarities = [cosine_similarity(user_tfidf, {word: tf[word] * idf_jobs.get(word, 0) for word in tf}) for tf in tfidf_jobs]

        # Add similarity scores to the job dataframe and get top 5 jobs
        df["Similarity"] = similarities
        top_jobs = df.sort_values(by="Similarity", ascending=False).drop_duplicates(subset=["Job Title"]).iloc[:5]
       
       

        return JsonResponse({"recommendations": top_jobs.to_dict(orient="records"), "status": "success"})

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return Response({"error": "An unexpected error occurred", "details": str(e)}, status=500)


@api_view(["POST"])
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
        print("line281", job_tf)
        user_tf = compute_tf(user_skill)
        print("line283", user_tf)
        vocabulary = set(job_tf.keys()).union(set(user_tf.keys()))
        print("line 285", vocabulary)
        idf_jobs = compute_idf_ats([jobs_qualification, user_skill])
        print("line 287", idf_jobs)

        job_tfidf = {word: job_tf[word] * idf_jobs.get(word, 0) for word in job_tf}
        print("line 290", job_tfidf)
        user_tfidf = {word: user_tf[word] * idf_jobs.get(word, 0) for word in user_tf}
        print("line 292", user_tfidf)

        similarity = cosine_similarity(user_tfidf, job_tfidf)

        return Response({"similarity_score": similarity, "status": "success"}, status=200)

    return Response({"error": "Invalid request method"}, status=400)

