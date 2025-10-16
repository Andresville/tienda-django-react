import re
from .exceptions import ValidationException

class Validation:

  @staticmethod
  def validate_email(email:str):
    if not email or not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
      raise ValidationException("Email inválido")
  
  @staticmethod
  def validate_password(password:str):
    if not password or len(password) < 6:
      raise ValidationException("La contraseña debe tener al menos 6 caracteres")
  
  @staticmethod
  def validate_name(name:str):
    if not re.match(r'^[a-zA-Z\s]{3,50}$', name):
      raise ValidationException(f"El nombre debe tener al menos 3 letras y no mas de 50")
  
  @staticmethod
  def validate_id(id):
    if not id or not str(id).isdigit():
      raise ValidationException("ID inválido")