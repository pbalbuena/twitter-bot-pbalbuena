# twitter-bot-pbalbuena
Twitter bot to test: Oauth 2.0, OpenAI and Firebase

## Pasos para ejecutar el proyecto
Ejecutar este proyecto puede llevar algo de tiempo, ya que se necesitan ciertas claves públicas y privadas.

## Prerrequisitos
Tener node, git y firebase instalados en el ordenador

### Paso 1
Ir a la página oficial de [Twitter developers](https://developer.twitter.com/) y activar tus credenciales de developer. 
Desde allí:
1. Crear nuevo proyecto.
2. Crear nueva app.
3. Acceder a keys and tokens y copiar los dos valores.

### Paso 2
Ir a la página oficial de [OpenAI](https://openai.com/) y crearse una cuenta de forma totalmente gratuita.
1. Una vez logueados vamos a nuestro perfil.
2. Entramos en una sección llamada: View API Keys
3. Copiamos las claves pública y privadas ya que las necesitaremos más adelante.

### Paso 3
Clonar este proyeecto con el comando:
```
git clone https://github.com/pbalbuena/twitter-bot-pbalbuena.git
```
Después navegar hasta dentro del directorio functions e isntalar las dependencias
```
cd /functions
npm install 
```
Crear un archivo .env e introducir las claves que hemos copiado antes con este formato:
```
OPENAI_USER=xxxxxxxxxxxxxxx
OPENAI_SECRET=sk-xxxxxxxxxx
TWITTER_USER=xxxxxxxxxxxxxx
TWITTER_SECRET=xxxxxxxxxxxx
```

Volver al directorio raíz y lanzar el proyecto en el servidor local mediante:
```
cd .
firebase serve
``` 

### Paso 4
Ahora podremos acceder desde neustro navegador a unas url como:
- http://127.0.0.1:5000/twitter-bot-pbalbuena/us-central1/auth que nos loguearía en nuestra cuenta.
- 'http://127.0.0.1:5000/twitter-bot-pbalbuena/us-central1/tweet que tuitearía por nosotros lo que le pidamos.


### Nota final importante
Debido a las políticas de twitter no está permitido realizar bots automatizados con OpenAI, así que este proyecto es meramente informativo y su ejecución se realiza manualmente.
