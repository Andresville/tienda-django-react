from django.db import models, transaction
from django.utils import timezone
from django.core.validators import MinLengthValidator
from django.utils.text import slugify

class Category(models.Model):
  id = models.AutoField(primary_key=True)
  name = models.CharField(max_length=50, validators=[MinLengthValidator(3)])
  ancestor = models.PositiveIntegerField(null=True, blank=True)
  path = models.CharField(max_length=1024, blank=True, default="")
  path_ids = models.CharField(max_length=1024, blank=True, default="")
  slug = models.CharField(max_length=255, blank=True)
  available = models.BooleanField(default=True)
  # Fechas
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(null=True, blank=True)
  deleted_at = models.DateTimeField(null=True, blank=True)

  class Meta:
    constraints = [
      models.UniqueConstraint(fields=['path'], name='unique_path')
    ]

  def save(self, *args, **kwargs):
    with transaction.atomic():
      self.slug = slugify(self.name)
      self.name = self.name.capitalize() # Capitalizar nombre

      # Actualizar updated_at si es actualización o Guardar inicialmente para obtener ID si es nuevo
      if self.pk:
        self.updated_at = timezone.now()
      super().save(*args, **kwargs)

      # Actualizar path_ids y path según ancestor
      if self.ancestor:
        parent = Category.objects.get(id=self.ancestor)
        self.path_ids = f"{parent.path_ids}/{self.id}" if parent.ancestor else f"{parent.id}/{self.id}"
        self.path = f"{parent.path}/{self.name}" if parent.ancestor else f"{parent.name}/{self.name}"
      else:
        self.path_ids = str(self.id)
        self.path = self.name

      # Actualizar con path y path_ids actualizados
      super().save(update_fields=['path', 'path_ids'])
    
  def soft_delete(self):
    """En vez de borrar realmente, marca como no disponible y fija deleted_at."""
    self.available = False
    self.deleted_at = timezone.now()
    self.save()

  def __str__(self):
    return f"Category<{self.id}, {self.name}, {self.ancestor}, {self.active}>"