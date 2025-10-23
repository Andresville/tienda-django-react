import json
from django.http import JsonResponse
from django.db.utils import IntegrityError
from django.views.decorators.http import require_http_methods
from decouple import config

from supercheck.common.exceptions import ValidationException
from supercheck.common.decorators import admin_required
from supercheck.common.decorators import admin_or_seller_required
from .models import Category

@require_http_methods(['POST'])
@admin_required
def create_category(request):
  try:
    data = json.loads(request.body)
    # Validaciones mínimas
    required_fields = ['name', 'ancestor']
    for field in required_fields:
      if field not in data:
        return JsonResponse({'error': f'Falta el campo {field}'}, status=400)
    
    ancestor = Category.objects.get(id=data['ancestor']) if data['ancestor'] else None

    # Crear category
    try:
      category = Category.objects.create(
        name=data['name'],
        ancestor=ancestor.id if ancestor else None
      )
    except IntegrityError:
      category = Category.objects.get(ancestor=ancestor.id if ancestor else None, name=data['name'])
      category.deleted_at = None
      category.available = True
      category.save()

    return JsonResponse({
      'id': category.id,
      'name': category.name,
      'ancestor': category.ancestor,
      'path': category.path,
      'path_ids': category.path_ids,
      'slug': category.slug
    }, status=201)

  except IntegrityError as e:
    print(str(e))
    return JsonResponse({'error': 'La categoria ya existe'}, status=409)
  except json.JSONDecodeError:
    return JsonResponse({'error': 'JSON inválido'}, status=400)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['PUT','PATCH'])
@admin_required
def update_category(request, category_id):
  try:
    data = json.loads(request.body)
    category = Category.objects.get(id=category_id, available=True)
    updatable_fields = ['name']

    for field in updatable_fields:
      if field in data:
        setattr(category, field, data[field])
    
    category.save()
    return JsonResponse({
      'id': category.id,
      'name': category.name,
      'ancestor': category.ancestor,
      'path': category.path,
      'path_ids': category.path_ids,
      'slug': category.slug
    }, status=201)
  
  except IntegrityError:
    return JsonResponse({'error': 'La categoria ya existe'}, status=409)
  except json.JSONDecodeError:
    return JsonResponse({'error': 'JSON inválido'}, status=400)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['DELETE'])
@admin_required
def delete_category(request, category_id):
  """
    Borra una categoria
  """
  try:
    category = Category.objects.get(id=category_id, available=True)
    category.soft_delete()
    return JsonResponse('Categoria eliminada exitosamente', safe=False, status=200)
  except Category.DoesNotExist:
    return JsonResponse({'error': "La categoría no existe"}, status=400)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['GET'])
@admin_or_seller_required
def categories(request):
  """
  Devuelve el listado de categorias disponibles (available = True)
  """
  try:
    categories = Category.objects.filter(available=True).values('id', 'name', 'slug', 'path', 'path_ids', "ancestor").order_by('path_ids')
    return JsonResponse(list(categories), safe=False, status=200)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)