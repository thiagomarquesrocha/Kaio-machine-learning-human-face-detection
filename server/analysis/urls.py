from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^predict/$', views.predict, name='predict'),
    url(r'^save/data/$', views.save_data, name='save_data'),
    url(r'^save/training/$', views.save_training, name='save_training'),
]