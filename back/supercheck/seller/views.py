import json
from django.http import JsonResponse
from django.db.utils import IntegrityError
from django.views.decorators.http import require_http_methods
from decouple import config

from supercheck.common.decorators import admin_or_seller_required
from .models import Seller

@require_http_methods(['POST'])
@admin_or_seller_required
def create_seller(request):
  try:
    data = json.loads(request.body)
    # Validaciones mínimas
    required_fields = ['name']
    for field in required_fields:
      if field not in data:
        return JsonResponse({'error': f'Falta el campo {field}'}, status=400)

    # Crear seller
    try:
      seller = Seller.objects.create(
        name=data['name']
      )
    except IntegrityError:
      seller = Seller.objects.get(name=data['name'])
      seller.deleted_at = None
      seller.available = True
      seller.save()

    return JsonResponse({
      'id': seller.id,
      'name': seller.name
    }, status=201)

  except json.JSONDecodeError:
    return JsonResponse({'error': 'JSON inválido'}, status=400)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['PUT','PATCH'])
@admin_or_seller_required
def update_seller(request, seller_id):
  try:
    data = json.loads(request.body)
    seller = Seller.objects.get(id=seller_id, available=True)
    updatable_fields = ['name']

    for field in updatable_fields:
      if field in data:
        setattr(seller, field, data[field])
    
    seller.save()
    return JsonResponse({
      'id': seller.id,
      'name': seller.name
    }, status=201)
  
  except IntegrityError:
    return JsonResponse({'error': 'El seller ya existe'}, status=409)
  except json.JSONDecodeError:
    return JsonResponse({'error': 'JSON inválido'}, status=400)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['DELETE'])
@admin_or_seller_required
def delete_seller(request, seller_id):
  """
    Borra un seller
  """
  try:
    seller = Seller.objects.get(id=seller_id, available=True)
    seller.soft_delete()
    return JsonResponse('Sellers eliminado exitosamente', safe=False, status=200)
  except Seller.DoesNotExist:
    return JsonResponse({'error': "El seller no existe"}, status=400)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['GET'])
@admin_or_seller_required
def sellers(request):
  """
  Devuelve el listado de categorias disponibles (available = True)
  """
  try:
    sellers = Seller.objects.filter(available=True).values('id', 'name').order_by('slug')
    return JsonResponse(list(sellers), safe=False, status=200)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)