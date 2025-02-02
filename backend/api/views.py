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
from django.http import JsonResponse
# import pypdf
from PyPDF2 import PdfReader

from .extract_skills import extract_skills,skills

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
        return Response({"token": token.key,'csrfToken': csrf_token,}, status=status.HTTP_200_OK)
    


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
def file_text(request, username):
    try:
        # Retrieve the user based on the username
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # Query the files uploaded by the user
    file = FileUpload.objects.filter(user=user).first()
    if not file:
        return Response({"error": "No files found for this user"}, status=404)

    try:
        # Open the file
        with open(file.file.path, 'rb') as f:  # Assuming 'file' is the file field in FileUpload
            reader = PdfReader(f)
            total_pages = len(reader.pages)

            # Extract text from the first page
            first_page = reader.pages[0]
            text = first_page.extract_text()
            skill=extract_skills(text,skills)

            return Response({"text": skill}, status=200)

    except Exception as e:
        return Response({"error": f"File processing error: {str(e)}"}, status=500)