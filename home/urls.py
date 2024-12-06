from django.urls import path
from django.views.generic import TemplateView

app_name = 'home'
urlpatterns = [
    path('', TemplateView.as_view(template_name='home/home.html'), name='home'),
    path('about', TemplateView.as_view(template_name='home/about.html'), name='about'),
    path('resume', TemplateView.as_view(template_name='home/resume.html'), name='resume'),
    path('services', TemplateView.as_view(template_name='home/services.html'), name='services'),
    path('portfolio', TemplateView.as_view(template_name='home/portfolio.html'), name='portfolio'),
    path('contact', TemplateView.as_view(template_name='home/contact.html'), name='contact'),
]
