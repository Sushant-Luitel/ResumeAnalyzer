from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils import timezone
# Create your models here.
def validate_file_extension(value):
    if not value.name.endswith(('.pdf', '.docx')):
        raise ValidationError('Only PDF and DOCX files are allowed.')

#Changed to Customuser
class CustomUser(AbstractUser):  
    username=models.CharField(max_length=50,unique=True,blank=False,null=False)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    email=models.EmailField(max_length=100,blank=False,null=False)
    # profile=models.ImageField(upload_to='profile/')

class FileUpload(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    file=models.FileField(upload_to='documents/',validators=[validate_file_extension],blank=False,null=False)
    upload_time=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} has resume/cv {self.file.name}"
    
class SavedJob(models.Model):
    STATUS_CHOICES = [
        ("I", "In Review"),
        ("A", "Accepted"),
        ("R", "Rejected")
    ]
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    job_title=models.CharField(max_length=100)
    job_description = models.TextField()
    job_similarity=models.FloatField(default=0.0)
    job_company=models.CharField(max_length=100)
    applied_on=models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='I')
    def __str__(self):
        return f"{self.user } has applied to {self.job_title}"
    #For recruiter
class Recruiter(models.Model):
   
    recruiter_name = models.CharField(max_length=100, blank=False, null=False)
    recruiter_email = models.EmailField(blank=False)
    

    def __str__(self):
        return self.recruiter_name
    
class Job(models.Model):
    JOB_TYPES=[
        ("IN","Intern"),
        ("FT","Full-Time"),
        ("PT","Part-Time"),
        ("TP","Temporary"),("CT","Contract")
    ]
    recruiter=models.ForeignKey(Recruiter,on_delete=models.CASCADE)
    company_name=models.CharField(max_length=100,blank=False,null=False)
    location=models.CharField(max_length=100,blank=False,null=False)
    job_title=models.CharField(max_length=100,blank=False,null=False)
    salary=models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=False)
    job_type=models.CharField(max_length=100,choices=JOB_TYPES,default="FT")
    job_description=models.TextField()
    job_requirements=models.TextField()
    posted_at=models.DateTimeField(auto_now_add=True)
    expiry_time=models.DateField(null=False,blank=False)
    is_active=models.BooleanField(default=True)
    

    def __str__(self):
        return f"{self.job_title} has been posted by {self.company_name} by recruiter {self.recruiter}"
    
    class Meta:
        ordering=['expiry_time']

    def is_expired(self):
        if self.expiry_time:
            return timezone.now() > self.expiry_time
        return False