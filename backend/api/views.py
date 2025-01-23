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

        return Response({"token": token.key}, status=status.HTTP_200_OK)
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    if request.method=="POST":
        try:
            request.user.auth_token.delete()
            return Response({'message':'You have been logged out.'},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([IsAuthenticated])
def file_upload(request):
    if request.user:
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'File uploaded successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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