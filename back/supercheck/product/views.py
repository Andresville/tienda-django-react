import json
from django.http import JsonResponse
from django.db.utils import IntegrityError
from django.views.decorators.http import require_http_methods
from decouple import config
from supercheck.common.decorators import admin_required
from supercheck.common.decorators import admin_or_seller_required
from .models import Product
from seller.models import Seller
from category.models import Category

@require_http_methods(['POST'])
@admin_required
def create_product(request):
  try:
    data = json.loads(request.body)
    # Validaciones mínimas
    required_fields = ['name','description','available_stock','price','price_without_taxes','seller_id','category_ids']
    for field in required_fields:
      if field not in data:
        return JsonResponse({'error': f'Falta el campo {field}'}, status=400)
      
    # Crear product
    try:
      product = Product.objects.create(
        name=data['name'],
        description=data['description'],
        available_stock=int(data['available_stock']),
        price=int(data['price']),
        price_without_taxes=int(data['price_without_taxes']),
        seller=Seller.objects.get(id=int(data['seller_id']))
      )
    except IntegrityError:
      product = Product.objects.get(name=data['name'])
      product.deleted_at = None
      product.available = True
      product.save()

    # Asigno las categorias
    path_ids_list = Category.objects.filter(id__in=data['category_ids']).values_list('path_ids', flat=True)
    unique_ids = sorted(set(
        int(id_str)
        for path in path_ids_list
        for id_str in path.split('/')
    ))
    product.categories.set(Category.objects.filter(id__in=unique_ids))

    return JsonResponse({
      "id": product.id,
      "name": product.name,
      "price": product.price,
      "price_without_taxes": product.price_without_taxes,
      "available_stock": product.available_stock,
      "seller": product.seller.id,
      "categories": list(product.categories.values_list('id', flat=True))
    }, status=201)

  except json.JSONDecodeError:
    return JsonResponse({'error': 'JSON inválido'}, status=400)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['PUT','PATCH'])
@admin_required
def update_product(request, product_id):
  try:
    data = json.loads(request.body)
    product = Product.objects.get(id=product_id, available=True)
    updatable_fields = ['name','description','available_stock','price','price_without_taxes']

    for field in updatable_fields:
      if field in data:
        setattr(product, field, data[field])
    
    # Actualizo el seller
    seller_id = data.get('seller_id')
    if seller_id is not None:
      seller_instance = Seller.objects.get(id=seller_id)
      product.seller = seller_instance

    # Actualizo las categorias
    category_ids = data.get('category_ids')
    if category_ids is not None:
      path_ids_list = Category.objects.filter(id__in=data['category_ids']).values_list('path_ids', flat=True)
      unique_ids = sorted(set(
          int(id_str)
          for path in path_ids_list
          for id_str in path.split('/')
      ))
      product.categories.set(Category.objects.filter(id__in=unique_ids))

    product.save()
    return JsonResponse({
      'id': product.id,
      'name': product.name,
      'description': product.description,
      'price': product.price,
      'price_without_taxes': product.price_without_taxes,
      'slug': product.slug,
      'seller': {
          'id': product.seller.id,
          'name': product.seller.name
      },
      'categories': list(product.categories.values('id', 'name'))
    }, status=201)
  
  except IntegrityError:
    return JsonResponse({'error': 'El seller ya existe'}, status=409)
  except json.JSONDecodeError:
    return JsonResponse({'error': 'JSON inválido'}, status=400)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['DELETE'])
@admin_required
def delete_product(request, product_id):
  """
    Borra un producto
  """
  try:
    product = Product.objects.get(id=product_id, available=True)
    product.soft_delete()
    return JsonResponse('Producto eliminado exitosamente', safe=False, status=200)
  except Product.DoesNotExist:
    return JsonResponse({'error': "El producto no existe"}, status=400)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['GET'])
@admin_or_seller_required
def products(request):
  """
  Devuelve el listado de productos disponibles (available = True)
  """
  try:
    products = Product.objects.filter(available=True)\
      .select_related('seller')\
      .prefetch_related('categories')\
      .order_by('slug')

    result = []

    for product in products:
        result.append({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'price_without_taxes': product.price_without_taxes,
            'slug': product.slug,
            'available_stock': product.available_stock,
            'seller': {
                'id': product.seller.id,
                'name': product.seller.name
            },
            'categories': list(product.categories.values('id', 'name'))
        })

    return JsonResponse(result, safe=False)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)