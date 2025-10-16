class ValidationException(Exception):
  """
  Excepción global para errores de validación en la API.
  Puedes lanzarla desde cualquier parte del código.
  """
  def __init__(self, message, status_code=400):
    super().__init__(message)
    self.message = message
    self.status_code = status_code

  def to_response(self):
    from django.http import JsonResponse
    return JsonResponse({"error": self.message}, status=self.status_code)
