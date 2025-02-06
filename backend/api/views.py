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
from collections import Counter
import pandas as pd
import pickle
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
        return Response({"token": token.key}, status=status.HTTP_200_OK)
    


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



def compute_tf(text):
    """Compute Term Frequency"""
    try:
        words = text.lower().split()
        tf_counter = Counter(words)
        total_words = len(words)
        if total_words == 0:
            return {}
        tf = {word: count / total_words for word, count in tf_counter.items()}
        return tf
    except Exception as e:
        print(f"Error in compute_tf: {str(e)}")
        return {}

def compute_idf(documents):
    """Compute Inverse Document Frequency"""
    try:
        total_docs = len(documents)
        if total_docs == 0:
            return {}
        
        idf = {}
        # Process documents to avoid memory issues
        word_doc_count = Counter()
        
        for doc in documents:
            words = set(doc.lower().split())
            word_doc_count.update(words)
        
        idf = {word: math.log(total_docs / (1 + count)) 
               for word, count in word_doc_count.items()}
        return idf
    except Exception as e:
        print(f"Error in compute_idf: {str(e)}")
        return {}

def compute_tfidf(documents):
    """Compute TF-IDF for documents"""
    try:
        if not documents:
            return []
            
        idf = compute_idf(documents)
        tfidf_documents = []
        
        for doc in documents:
            tf = compute_tf(doc)
            tfidf = {word: tf[word] * idf.get(word, 0) for word in tf}
            tfidf_documents.append(tfidf)
            
        return tfidf_documents
    except Exception as e:
        print(f"Error in compute_tfidf: {str(e)}")
        return []

def cosine_similarity(doc_vector1, doc_vector2):
    """Compute cosine similarity between two document vectors"""
    try:
        if not doc_vector1 or not doc_vector2:
            return 0.0
            
        intersection = set(doc_vector1.keys()) & set(doc_vector2.keys())
        numerator = sum([doc_vector1[x] * doc_vector2[x] for x in intersection])

        sum1 = sum([doc_vector1[x] ** 2 for x in doc_vector1])
        sum2 = sum([doc_vector2[x] ** 2 for x in doc_vector2])
        denominator = math.sqrt(sum1) * math.sqrt(sum2)

        if not denominator:
            return 0.0
        return float(numerator) / denominator
    except Exception as e:
        print(f"Error in cosine_similarity: {str(e)}")
        return 0.0

def process_pdf(file_path, max_pages=3):
    """Process PDF with page limit"""
    try:
        with open(file_path, 'rb') as f:
            reader = PdfReader(f)
            text = ""
            # Process only first few pages
            for page in reader.pages[:max_pages]:
                text += page.extract_text()
            # Limit text length to avoid memory issues
            return text[:50000]  # Limit to 50K characters
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        raise

@api_view(['GET', 'POST'])
def recommend_jobs(request, username):
    """Main job recommendation function"""
    try:
        # Input validation
        if not username:
            return Response({"error": "Username is required"}, status=400)

        # Retrieve user
        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        # Get latest file upload
        file = FileUpload.objects.filter(user=user).last()
        if not file:
            return Response({"error": "No resume found"}, status=404)

        # Process PDF
        try:
            text = process_pdf(file.file.path)
            user_skill = extract_skills(text, skills)
            user_education = extract_education(text, education)
            if not user_education:
                user_education = ""
        except Exception as e:
            print(f"Error processing resume: {str(e)}")
            return Response({"error": "Error processing resume"}, status=500)

        # Load job data
        try:
            print("Loading job data...")
            df = pd.read_csv('C:/Users/Asus/Desktop/dev/ResumeAnalyzer/backend/static/job_descriptions.csv')
            print(df.sample(2))
            with open('C:/Users/Asus/Desktop/dev/ResumeAnalyzer/backend/static/cleanded_df.pkl', 'rb') as fp:
                print("Loading cleaned job data...")
                cleaned_df = pickle.load(fp)
        except Exception as e:
            print(f"Error loading job data: {str(e)}")
            return Response({"error": "Error loading job data"}, status=500)

        # Combine user qualifications
        user_qualification = f"{user_skill} {user_education}".strip()
        if not user_qualification:
            return Response({"error": "No qualifications extracted from resume"}, status=400)

        # Compute TF-IDF
        job_descriptions = cleaned_df['skills'] + " " + cleaned_df['qualifications']
        tfidf_jobs = compute_tfidf(job_descriptions.tolist())
        user_tfidf = compute_tfidf([user_qualification])[0]

        # Calculate similarities
        similarities = []
        for job_tfidf in tfidf_jobs:
            try:
                similarity = cosine_similarity(user_tfidf, job_tfidf)
                similarities.append(similarity)
            except Exception as e:
                print(f"Error calculating similarity: {str(e)}")
                similarities.append(0.0)

        # Create recommendations
        df['Similarity'] = similarities
        rec = df.sort_values(by='Similarity', ascending=False)
        unique_rec = rec.drop_duplicates(subset=['Job Title'])
        top_jobs = unique_rec[['Job Title', 'Role', 'Similarity', 'Job Description', 'Work Type']].iloc[1:6]
        
        recommendations = top_jobs.to_dict(orient='records')
        
        return JsonResponse({
            'recommendations': recommendations,
            'status': 'success'
        })

    except Exception as e:
        print(f"Unexpected error in recommend_jobs: {str(e)}")
        return Response({
            "error": "An unexpected error occurred",
            "details": str(e)
        }, status=500)