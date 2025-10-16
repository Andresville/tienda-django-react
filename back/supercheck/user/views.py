import json
import jwt
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.db.utils import IntegrityError
from django.views.decorators.http import require_http_methods
from decouple import config

from supercheck.common.exceptions import ValidationException
from supercheck.common.decorators import admin_required
from .models import User

@require_http_methods(['POST'])
def login_user(request):
  try:
    data = json.loads(request.body)
    user = User.login(data['email'], data['password'])

    # Crear payload con expiración
    payload = {
      'user_id': user.id,
      'role': user.role,
      'exp': datetime.utcnow() + timedelta(hours=int(config('JWT_EXP_DELTA_HOURS')))
    }

    return JsonResponse({
      'token': jwt.encode(payload, config('JWT_SECRET'), algorithm=config('JWT_ALGORITHM')),
      'user': {
        'id': user.id,
        'name': user.name,
        'surname': user.surname,
        'email': user.email,
        'role': user.role
      }
    })

  except ValidationException as e:
    return JsonResponse({'error': e.message}, status=e.status_code)
  except User.DoesNotExist:
    return JsonResponse({'error': 'Usuario o contraseña incorrectos'}, status=401)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=400)

@require_http_methods(['POST'])
@admin_required
def create_user(request):
  try:
    data = json.loads(request.body)
    # Validaciones mínimas
    required_fields = ['name', 'surname', 'email', 'password', 'role']
    for field in required_fields:
      if field not in data:
        return JsonResponse({'error': f'Falta el campo {field}'}, status=400)

    # Verificar rol válido
    if data['role'] not in [choice for choice, _ in User.Roles.choices]:
      return JsonResponse({'error': 'Rol inválido'}, status=400)

    # Verificar email único
    if User.objects.filter(email=data['email'], available=True).exists():
      return JsonResponse({'error': 'El email ya existe'}, status=400)

    # Crear usuario
    try:
      user = User.objects.create(
        name=data['name'],
        surname=data['surname'],
        email=data['email'],
        password=data['password'],
        role=data['role']
      )
    except IntegrityError:
      # Reactivo al usuario
      user = User.objects.get(email=data['email'])
      user.available = True
      user.deleted_at = None
      user.save()

    return JsonResponse({
      'id': user.id,
      'name': user.name,
      'surname': user.surname,
      'email': user.email,
      'role': user.role
    }, status=201)

  except json.JSONDecodeError:
    return JsonResponse({'error': 'JSON inválido'}, status=400)
  except Exception as e:
    print(f"class: {e.__class__.__name__}")
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['PUT','PATCH'])
@admin_required
def update_user(request):
  ...

@require_http_methods(['DELETE'])
@admin_required
def delete_user(request, user_id):
  """
    Borra un usuario
    - No se puede borrar el mismo usuario logueado
  """
  try:
    user = User.objects.get(id=user_id, available=True)
    if user.id == request.user.id:
      return JsonResponse({'error': 'No se puede borrar el mismo usuario que inicio sesión'}, status=400)
    
    user.soft_delete()
    return JsonResponse('Usuario eliminado exitosamente', safe=False, status=200)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(['GET'])
@admin_required
def users(request):
  """
  Devuelve el listado de usuarios disponibles (available = True)
  """
  try:
    users = User.objects.filter(available=True).values('id', 'name', 'surname', 'email', 'role', 'created_at', 'updated_at')
    return JsonResponse(list(users), safe=False, status=200)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=500)