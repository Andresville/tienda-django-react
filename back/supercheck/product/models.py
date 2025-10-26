from django.db import models
from django.core.validators import MinLengthValidator
from django.utils.text import slugify
from seller.models import Seller
from django.utils import timezone

class Product(models.Model):
  id = models.AutoField(primary_key=True)
  name = models.CharField(max_length=255, validators=[MinLengthValidator(3)])
  description = models.TextField(blank=True, validators=[MinLengthValidator(3)])
  slug = models.CharField(max_length=255, blank=True)
  available_stock = models.PositiveIntegerField(default=0)
  active = models.BooleanField(default=True)
  available = models.BooleanField(default=True)
  # Precios almacenados como enteros (ej: 10.50 -> 1050)
  price = models.BigIntegerField() # requerido
  price_without_taxes = models.BigIntegerField()
  discount = models.PositiveIntegerField(default=0)
  # Relaciones
  seller = models.ForeignKey(Seller, on_delete=models.CASCADE, related_name='products')
  categories = models.ManyToManyField('category.Category', related_name='products', blank=True)
  # Fechas
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(null=True, blank=True)
  deleted_at = models.DateTimeField(null=True, blank=True)

  class Meta:
    unique_together = ('slug', 'seller')

  @property
  def active_variants_count(self):
    return 0
    # return self.variants.filter(available=True).count()

  def save(self, *args, **kwargs):
    if self.pk:  # si ya existe, o sea update
      self.updated_at = timezone.now()
    self.slug = slugify(self.name)
    super().save(*args, **kwargs)

  # def get_available_stock(self):
  #   # suma el stock de variantes activas asociadas
  #   return self.variants.filter(active=True).aggregate(total=models.Sum('stock'))['total'] or 0
  
  def soft_delete(self):
    """En vez de borrar realmente, marca como no disponible y fija deleted_at."""
    self.available = False
    self.active = False
    self.deleted_at = timezone.now()
    self.save()
  
  def __str__(self):
    return f"Product<{self.id}, {self.name}, ${self.price:.2f}, {self.available_stock}, {self.active}, {self.available}> Variants: {self.active_variants_count()}"