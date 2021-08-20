"""pib URL Configuration for the API

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.conf.urls import include


urlpatterns = [
    url(r'^curricula/', include('curricula.urls_api')), # TODO remove
    url(r'^editor/', include('editor.urls_api')), # TODO remove
    url(r'^profiles/', include('profiles.urls_api')),
    url(r'^classroom/', include('classroom.urls_api')),
    url(r'^resources/', include('resources.urls_api')),
    url(r'^djeddit/', include('djeddit.urls_api')), # TODO remove
    url(r'^react-comments/', include('react_comments_django.urls_api')),
    url(r'^notifications/', include('notifications.urls_api')),
    url(r'^reputation/', include('user_reputation.urls_api')),
    # new api
    url(r'^courses/', include('courses.urls_api')),
    url(r'^studio/', include('studio.urls_api')),  # was editor
]
