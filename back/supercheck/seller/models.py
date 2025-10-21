from django.db import models
from django.core.validators import MinLengthValidator

class Seller(models.Model):
  id = models.AutoField(primary_key=True)
  name = models.CharField(max_length=50, validators=[MinLengthValidator(3)])

  def __str__(self):
    return f"Seller<{self.id}, {self.name}>"