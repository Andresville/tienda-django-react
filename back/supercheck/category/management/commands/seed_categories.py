from django.core.management.base import BaseCommand
from category.models import Category

class Command(BaseCommand):
  help = "Seed initial categories"

  def handle(self, *args, **options):
    # Categorías principales y sus subcategorías
    categories_data = {
        "Alimentos": ["Frutas y verduras", "Carnes y embutidos"],
        "Higiene y Cuidado Personal": ["Champú y jabón", "Pasta dental y desodorantes"],
        "Limpieza del Hogar": ["Detergentes y suavizantes", "Limpiadores multiusos"],
        "Bebés y Maternidad": ["Pañales", "Alimentos infantiles"],
        "Alimentos no perecederos": ["Enlatados", "Arroces, pastas y granos"],
    }

    # Primero creamos las categorías principales
    main_categories = {}
    for main_cat_name in categories_data.keys():
        cat = Category.objects.create(
            name=main_cat_name,
            ancestor=None
        )
        self.stdout.write(self.style.SUCCESS(f"Categoria creada: {cat.name} ({cat.id})"))
        main_categories[main_cat_name] = cat

    # Ahora creamos las subcategorías con ancestor apuntando a la principal
    for main_cat_name, subcats in categories_data.items():
        parent_cat = main_categories[main_cat_name]
        for subcat_name in subcats:
            subcat = Category.objects.create(
                name=subcat_name,
                ancestor=parent_cat.id
            )
            self.stdout.write(self.style.SUCCESS(f"Categoria creada: {subcat.name} ({subcat.id}) Dependiente de {parent_cat.name}"))

    print("Seeder de categorías finalizado.")

