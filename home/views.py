from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.conf import settings
from .forms import ContactForm
from django.views import View
from django.core.mail import send_mail
from django.contrib import messages


# Create your views here.
class SendMessageForm(View):
    def get(self, request):
        form = ContactForm()
        return render(request, 'home/contact.html', {'form': form})

    def post(self, request):
        form = ContactForm(request.POST)
        if form.is_valid():
            subject = form.cleaned_data['subject'] + ' from ' + form.cleaned_data['name']
            message = form.cleaned_data['message'] + '\n' + "Email: " + form.cleaned_data['email']
            from_email = settings.EMAIL_HOST_USER
            recipient_list = ['sajjadhosseinrezaei@yahoo.com']

            try:
                send_mail(subject, message, from_email, recipient_list)
                return JsonResponse({'status': 'success', 'message': 'Your message has been sent!'})
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': f'Error sending email: {str(e)}'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Please fill out the form correctly.'})

