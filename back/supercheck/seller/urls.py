from django.urls import path
from .views import sellers, delete_seller, create_seller, update_seller

urlpatterns = [
  path('sellers/', sellers, name='list_sellers'),
  path('sellers/create/', create_seller, name='create_seller'),
  path('sellers/<int:seller_id>/', update_seller, name='update_seller'),
  path('sellers/<int:seller_id>/delete/', delete_seller, name='delete_seller'),
]