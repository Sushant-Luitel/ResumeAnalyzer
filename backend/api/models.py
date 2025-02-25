from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
# Create your models here.
def validate_file_extension(value):
    if not value.name.endswith(('.pdf', '.docx')):
        raise ValidationError('Only PDF and DOCX files are allowed.')
    
class CustomUser(AbstractUser):
    username=models.CharField(max_length=50,unique=True,blank=False,null=False)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    email=models.EmailField(max_length=100,blank=False,null=False)
    profile=models.ImageField(upload_to='profile/')

class FileUpload(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    file=models.FileField(upload_to='documents/',validators=[validate_file_extension],blank=False,null=False)
    upload_time=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} has resume/cv {self.file.name}"
    

class SavedJob(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    job_title=models.CharField(max_length=100)
    job_description = models.TextField()
    job_similarity=models.FloatField(default=0.0)
    applied_on=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user } has applied to {self.job_title}"