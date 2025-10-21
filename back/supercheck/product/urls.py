from django.urls import path
from .views import products, delete_product, create_product, update_product

urlpatterns = [
  path('products/', products, name='list_products'),
  path('products/create/', create_product, name='create_product'),
  path('products/<int:product_id>/', update_product, name='update_product'),
  path('products/<int:product_id>/delete/', delete_product, name='delete_product'),
]