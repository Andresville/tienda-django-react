from django.urls import path
from .views import categories, delete_category, create_category, update_category

urlpatterns = [
  path('categories/', categories, name='list_categories'),
  path('categories/create/', create_category, name='create_category'),
  path('categories/<int:category_id>/', update_category, name='update_category'),
  path('categories/<int:category_id>/delete/', delete_category, name='delete_category'),
]