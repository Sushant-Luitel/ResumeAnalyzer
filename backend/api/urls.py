from django.urls import path
from . import views
urlpatterns = [
    path('home/',views.home,name="home"),
    path('register/',views.register_user,name="register"),
    path('login/',views.login,name="login"),
    path('logout/',views.logout,name="logout"),
    path('file/',views.file_upload,name="file_upload"),
    path('recommend/<str:username>/',views.recommend_jobs,name='recommend'),
    path('ats/',views.ats_score_computation,name='ats'),
    path('save_job/',views.save_job,name='save'),
    path('applied_jobs/',views.applied_job,name='applied'),
    #for recruiter
    path('recruiter_login/',views.recruiter_login,name='recruiterLogin'),
    path('recruiter_logout/',views.recruiter_logout,name='recruiterLogout'),
    path('recruiter_register/',views.recruiter_register,name='recruiterRegister'),
    path('job/',views.job,name='job'),
    path('job/<int:id>/',views.get_job,name="getjob")
]
