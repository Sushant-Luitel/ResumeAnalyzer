from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser,FileUpload,SavedJob
# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('date_joined',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(FileUpload)
admin.site.register(SavedJob)