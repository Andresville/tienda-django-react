from django.core.management.base import BaseCommand
from user.models import User

class Command(BaseCommand):
  help = "Seed initial users (admin y seller)"

  def handle(self, *args, **options):
    # Lista de usuarios a crear
    seed_users = [
      {
        'name': 'Admin',
        'surname': 'Principal',
        'email': 'admin@example.com',
        'password': 'admin1234',
        'role': User.Roles.ADMIN
      },
      {
        'name': 'Seller',
        'surname': 'Uno',
        'email': 'seller1@example.com',
        'password': 'seller1234',
        'role': User.Roles.SELLER
      }
    ]

    for u in seed_users:
      user, created = User.objects.get_or_create(email=u['email'], defaults=u)
      if created:
        self.stdout.write(self.style.SUCCESS(f"Usuario creado: {user.email} ({user.role})"))
      else:
        self.stdout.write(self.style.WARNING(f"Usuario ya existe: {user.email}"))
