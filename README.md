# BACKEND  
## Instalación  
```bash
cd back
python3 -m venv .venv
source .venv/bin/activate
pip install django djangorestframework
pip install pyjwt
pip install django-extensions
pip install python-decouple

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

## URLs
```bash
python manage.py show_urls
``` 

## Migraciones  
```bash
python3 manage.py makemigrations user
python3 manage.py makemigrations category
python3 manage.py migrate
```

## Seeders (Opcional)
```bash
python3 manage.py seed_users
python3 manage.py seed_categories
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
#### Create
```bash
curl --location 'http://localhost:3000/api/admin/users/create/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3NjA2NjgzODN9.L7hXJIlQ6sV3STvBWPMTE6pa8p9ZJm26K19CtILdUxo' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Juan",
  "surname": "Pérez",
  "email": "juan.perez@example.com",
  "password": "MiClaveSegura123",
  "role": "USER"
}'
```
#### Listar 
```bash
curl --location 'http://localhost:3000/api/admin/users/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3NjA2NjgzODN9.L7hXJIlQ6sV3STvBWPMTE6pa8p9ZJm26K19CtILdUxo'
```  
#### Borrar
```bash
curl --location --request DELETE 'http://localhost:3000/api/admin/users/3/delete/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3NjA2NjgzODN9.L7hXJIlQ6sV3STvBWPMTE6pa8p9ZJm26K19CtILdUxo'
```  
#### Update
```bash
curl --location --request PUT 'http://localhost:3000/api/admin/users/3/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3NjA2NjgzODN9.L7hXJIlQ6sV3STvBWPMTE6pa8p9ZJm26K19CtILdUxo' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Juan Ernesto",
  "surname": "Pérez",
  "email": "juan.perez@example.com",
  "role": "USER"
}'
```  
### Categories  
#### Listar
```bash
curl --location 'http://localhost:3000/api/admin/categories/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3NjEwODU1NDR9.3AWcLcFElU8zLuJ8YPQ-cZXEce9NiBZ5XHsTWx_gdcI'
```  
### Crear  
```bash
curl --location 'http://localhost:3000/api/admin/categories/create/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3NjEwODU1NDR9.3AWcLcFElU8zLuJ8YPQ-cZXEce9NiBZ5XHsTWx_gdcI' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Frutas",
    "ancestor": 6
}'
```
#### Update
```bash
curl --location --request PUT 'http://localhost:3000/api/admin/categories/16/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3NjEwODU1NDR9.3AWcLcFElU8zLuJ8YPQ-cZXEce9NiBZ5XHsTWx_gdcI' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Frutas de estación"
}'
```  
#### Borrar
```bash
curl --location --request DELETE 'http://localhost:3000/api/admin/categories/16/delete/' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiQURNSU4iLCJleHAiOjE3NjEwODU1NDR9.3AWcLcFElU8zLuJ8YPQ-cZXEce9NiBZ5XHsTWx_gdcI'
```  