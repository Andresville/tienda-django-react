import jwt
from django.http import JsonResponse
from .models import User
from django.conf import settings
from datetime import datetime
from decouple import config

class JWTAuthenticationMiddleware:
    """
    Middleware que valida el JWT del header Authorization
    y deja el usuario en request.user
    """

    def __init__(self, get_response):
      self.get_response = get_response
      self.secret = getattr(settings, 'JWT_SECRET', config('JWT_SECRET'))
      self.algorithm = getattr(settings, 'JWT_ALGORITHM', config('JWT_ALGORITHM'))

    def __call__(self, request):
      auth_header = request.headers.get('Authorization', '')
      if auth_header.startswith('Bearer '):
        token = auth_header[7:]  # quitar "Bearer "
        try:
          payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
          user_id = payload.get('user_id')
          try:
            user = User.objects.get(id=user_id, available=True)
            request.user = user
          except User.DoesNotExist:
            return JsonResponse({'error': 'Usuario no existe'}, status=401)
        except jwt.ExpiredSignatureError:
          return JsonResponse({'error': 'Token expirado'}, status=401)
        except jwt.InvalidTokenError:
          return JsonResponse({'error': 'Token inválido'}, status=401)
      else:
        request.user = None  # usuario no autenticado

      response = self.get_response(request)
      return response
