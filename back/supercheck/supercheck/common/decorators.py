from django.http import JsonResponse
from functools import wraps

def admin_required(view_func):
  """
  Decorador para verificar que el request.user exista y sea ADMIN.
  """
  @wraps(view_func)
  def _wrapped_view(request, *args, **kwargs):
    from user.models import User
    user = getattr(request, 'user', None)
    if not user:
      return JsonResponse({'error': 'Autenticación requerida'}, status=401)
    if user.role != User.Roles.ADMIN:
      return JsonResponse({'error': 'Acceso denegado: solo administradores'}, status=403)
    return view_func(request, *args, **kwargs)
  return _wrapped_view

def admin_or_seller_required(view_func):
  """
  Decorador para verificar que el request.user exista y sea ADMIN o SELLER.
  """
  @wraps(view_func)
  def _wrapped_view(request, *args, **kwargs):
    from user.models import User
    user = getattr(request, 'user', None)
    if not user:
      return JsonResponse({'error': 'Autenticación requerida'}, status=401)
    if user.role != User.Roles.ADMIN and user.role != User.Roles.SELLER:
      return JsonResponse({'error': 'Acceso denegado: solo administradores'}, status=403)
    return view_func(request, *args, **kwargs)
  return _wrapped_view