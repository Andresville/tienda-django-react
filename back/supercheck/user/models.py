from django.db import models
from django.core.validators import MinLengthValidator
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from supercheck.common.exceptions import ValidationException
from supercheck.common.models import Validation

class User(models.Model):
  class Roles(models.TextChoices):
    ADMIN = 'ADMIN'
    SELLER = 'SELLER'
    USER = 'USER'

  id = models.AutoField(primary_key=True)
  name = models.CharField(max_length=50, validators=[MinLengthValidator(3)])
  surname = models.CharField(max_length=50, validators=[MinLengthValidator(3)])
  email = models.CharField(max_length=100, unique=True)
  role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.USER)
  password = models.CharField(max_length=128)  # max_length aumentado para hash
  available = models.BooleanField(default=True)
  # Fechas
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(null=True, blank=True)
  deleted_at = models.DateTimeField(null=True, blank=True)

  def save(self, *args, **kwargs):
    # Si la contraseña no parece estar hasheada, la hasheamos
    if not self.password.startswith('pbkdf2_'):
      self.password = make_password(self.password)
    if self.pk:  # si ya existe, o sea update
      self.updated_at = timezone.now()
    super().save(*args, **kwargs)

  @staticmethod
  def login(email, password):
    Validation.validate_email(email)
    Validation.validate_password(password)
    user = User.objects.get(email=email, available=True)
    if not check_password(password, user.password):
      raise ValidationException('Usuario o contraseña incorrectos', 401)
    return user

  def soft_delete(self):
    """En vez de borrar realmente, marca como no disponible y fija deleted_at."""
    self.available = False
    self.deleted_at = timezone.now()
    self.save()

  def __str__(self):
    return f"User<{self.id}, {self.name}, {self.surname}, {self.email}, {self.role}>"
  
  #   @staticmethod
  # def validate_role(role:str):
  #   if role not in [choice[0] for choice in User.Roles.choices]:
  #     raise ValidationException("Rol inválido. Debe ser ADMIN, SELLER o USER")