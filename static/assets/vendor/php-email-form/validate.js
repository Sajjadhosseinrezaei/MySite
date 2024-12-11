(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action || !action.trim()) {
        displayError(thisForm, 'خطا: فرم یک آدرس معتبر ندارد.');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      // گرفتن CSRF Token از کوکی‌ها
      const csrftoken = getCookie('csrftoken');

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
                .then(token => {
                  formData.set('recaptcha-response', token);
                  php_email_form_submit(thisForm, action, formData, csrftoken);
                });
            } catch (error) {
              displayError(thisForm, `خطا در اجرای reCaptcha: ${error.message}`);
            }
          });
        } else {
          displayError(thisForm, 'خطا: API جاوااسکریپت reCaptcha لود نشده است.');
        }
      } else {
        php_email_form_submit(thisForm, action, formData, csrftoken);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData, csrftoken) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': csrftoken // اضافه کردن CSRF Token به هدر
      }
    })
      .then(response => response.json())
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.status === 'success') {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(data.message || 'خطا در ارسال فرم');
        }
      })
      .catch(error => {
        displayError(thisForm, `خطا: ${error.message}`);
      });
  }

  function displayError(thisForm, error) {
    console.error(error); // برای دیباگ در کنسول
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
})();
