from django.db import models
from django.utils import timezone
from django.core.validators import MinLengthValidator
from django.utils.text import slugify

class Seller(models.Model):
  id = models.AutoField(primary_key=True)
  name = models.CharField(max_length=50, validators=[MinLengthValidator(3)])
  slug = models.CharField(max_length=50, blank=True)
  available = models.BooleanField(default=True)
  # Fechas
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(null=True, blank=True)
  deleted_at = models.DateTimeField(null=True, blank=True)
  
  class Meta:
    constraints = [
      models.UniqueConstraint(fields=['slug'], name='unique_slug')
    ]

  def save(self, *args, **kwargs):
    self.slug = slugify(self.name)
    # Actualizar updated_at si es actualización o Guardar inicialmente para obtener ID si es nuevo
    if self.pk:
      self.updated_at = timezone.now()
    super().save(*args, **kwargs)

    
  def soft_delete(self):
    """En vez de borrar realmente, marca como no disponible y fija deleted_at."""
    self.available = False
    self.deleted_at = timezone.now()
    self.save()

  def __str__(self):
    return f"Seller<{self.id}, {self.name}>"