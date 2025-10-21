from django.core.management.base import BaseCommand
from seller.models import Seller

class Command(BaseCommand):
  help = "Seed initial sellers"

  def handle(self, *args, **options):
    sellers_data = ["Marolio", "AC Eastway", "Megatone", "Radio Sapienza", "Farmacia Selma", "Fravega"]

    for seller_name in sellers_data:
      seller = Seller.objects.create(name=seller_name)
      self.stdout.write(self.style.SUCCESS(f"Seller creado: {seller.name} ({seller.id})"))
   
    print("Seeder de sellers finalizado.")

