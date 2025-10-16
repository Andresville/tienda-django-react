# BACKEND  
## Instalación  
```bash
cd back
python3 -m venv .venv
source .venv/bin/activate
pip install django djangorestframework
pip install pyjwt
pip install django-extensions

* Si el proyecto ya está creado ignorar esto *  
  django-admin startproject supercheck
  cd supercheck
  python3 manage.py startapp user
  python3 manage.py startapp seller
  python3 manage.py startapp category
  python3 manage.py startapp product
  python3 manage.py startapp variant

python3 manage.py runserver 0.0.0.0:3000
```

## Migraciones  
```bash
python3 manage.py makemigrations user
python3 manage.py migrate
python3 manage.py makemigrations category
```

## Seeders (Opcional)
```bash
python3 manage.py seed_users
```

### Usuario para pruebas
- Rol ADMIN: email='admin@example.com', password='admin123'
- Rol SELLER: email='seller@example.com', password='seller123'

## Curls  
### Users  
#### Login  
```bash
curl --location 'http://localhost:3000/api/users/login/' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "admin@example.com",
  "password": "admin1234"
}'
```
