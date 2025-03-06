from django.urls import path
from . import views
urlpatterns = [
    path('home/',views.home,name="home"),
    path('register/',views.register_user,name="register"),
    path('login/',views.login,name="login"),
    path('logout/',views.logout,name="logout"),
    path('file/',views.file_upload,name="file_upload"),
    path('recommend/<int:job_id>/',views.recommend_jobs,name='recommend'),
    path('ats/',views.ats_score_computation,name='ats'),
    path('save_job/',views.save_job,name='save'),
    path('applied_jobs/',views.applied_job,name='applied'),
]
