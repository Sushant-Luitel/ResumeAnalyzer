from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser,FileUpload,SavedJob,Recruiter,Job
# Register your models here.
# class CustomUserAdmin(UserAdmin):
#     model = CustomUser
#     list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
#     list_filter = ('is_staff', 'is_active')
#     search_fields = ('username', 'email')
#     ordering = ('date_joined',)

# admin.site.register(CustomUser, CustomUserAdmin)
# admin.site.register(FileUpload)
@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    # verbose_name="Job Application"
    list_display = ('user', 'job', 'status')
    list_filter = ('status',)
    list_editable = ('status',)
    

# Job Admin
@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('job_title', 'company_name', 'location', 'job_type', 'posted_at','get_recruiter_name')
    list_filter = ('job_type', 'posted_at', 'location')
    search_fields = ('job_title', 'company_name', 'location')
    ordering = ('-posted_at',)

    def get_recruiter_name(self,obj):
        return obj.recruiter.username
    get_recruiter_name.short_description = 'Recruiter Name'

# Recruiter Admin
# @admin.register(Recruiter)
# class RecruiterAdmin(admin.ModelAdmin):
#     model = Recruiter
#     list_display = ('username', 'email', )
#     search_fields = ('username', 'email', )
