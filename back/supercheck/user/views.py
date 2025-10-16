import json
import jwt
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from .decorators import admin_required
from .models import User
from decouple import config

@csrf_exempt
def login_user(request):
  if request.method != 'POST':
    return JsonResponse({'error': 'Método no permitido'}, status=405)

  try:
    data = json.loads(request.body)
    email = data['email']
    password = data['password']

    user = User.objects.get(email=email, available=True)

    if not check_password(password, user.password):
      return JsonResponse({'error': 'Usuario o contraseña incorrectos'}, status=401)

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

  except User.DoesNotExist:
    return JsonResponse({'error': 'Usuario o contraseña incorrectos'}, status=401)
  except Exception as e:
    return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@admin_required
def create_user(request):
  return JsonResponse({"msg": "Usuario creado."})

def update_user(request):
  ...

def delete_user(request):
  ...