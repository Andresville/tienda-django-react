import json
import jwt
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from .models import User

# Clave secreta para firmar JWT (guardar segura en producción)
JWT_SECRET = 'u7G8!fR2x#9QvL$1zA6pD@wT5sE^cH3jK8mN0bY4oZ&lV*X?R+S!F%U'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_HOURS = 24

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
      'exp': datetime.utcnow() + timedelta(hours=JWT_EXP_DELTA_HOURS)
    }

    return JsonResponse({
      'token': jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM),
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

def create_user(request):
  ...

def update_user(request):
  ...

def delete_user(request):
  ...