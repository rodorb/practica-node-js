# practica-node-js

Primero ir a la ruta \src\nodepop

Para inicializar la BBDD, ejecutar el script: npm run initdb

Para arrancar la aplicación, ejecutar el script: npm run start o npm start
Para arrancar la apicación en modo developer, ejecutar el script: npm run start:dev
Also you can use PM2 to run all services:

```sh
pm2 start ecosystem.config.js
```
Or run script 
```sh
npm run start:pm2
```
To kill processes
```sh
npm run kill-pm2
```

Lista de anuncios:
- localhost:3000/api/anuncios
Filtros:
- localhost:3000/api/anuncios?tag=mobile&forSale=false&name=ip&price=50-&start=0&limit=2&sort=price
Paginación:
- localhost:3000/api/anuncios?skip=2&limit=2
Filtro por tag: 
- localhost:3000/api/anuncios?tag=mobile
Filtro por producto en venta/búsqueda: 
- localhost:3000/api/anuncios?forSale=false
Filtro por nombre (por ejemplo productos que empiezan por ip): 
- localhost:3000/api/anuncios?&name=ip
Filtro por precio (con precio mayor o igual a 50):
- localhost:3000/api/anuncios?price=50-
Filtro por precio (con precio menor o igual a 50):
- localhost:3000/api/anuncios?price=-50
Filtro por precio (con precios entre 50 y 250):
- localhost:3000/api/anuncios?price=50-250
Filtro por precio (con precio igual a 50):
- localhost:3000/api/anuncios?price=50
Ordenación:
- localhost:3000/api/anuncios?sort=price


Crear un agente:
- /api/anuncios/createAd



Consultar documentación API (Swagger)
- /api/docs

Se añade la opción para subir un archivo de imágen al servidor, usando multer.
Se añade en la raíz del proyecto el archivo practica-nodejs.postman_collection.json para poder probar el post.
Se modifica la colección de Postman para que sea tipo form-data y se pueda añadir un archivo