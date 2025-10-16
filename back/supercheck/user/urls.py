from django.urls import path
from .views import login_user, users, delete_user, create_user, update_user

urlpatterns = [
  path('admin/users/', users, name='list_user'),
  path('admin/users/create/', create_user, name='create_user'),
  path('users/login/', login_user, name='login_user'),
  path('admin/users/<int:user_id>/', update_user, name='update_user'),
  path('admin/users/<int:user_id>/delete/', delete_user, name='delete_user'),
]
