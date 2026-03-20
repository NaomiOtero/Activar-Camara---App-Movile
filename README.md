# ExamenActivCamara

Aplicación móvil desarrollada con **Apache Cordova**, **HTML**, **CSS** y **JavaScript** como parte de un examen de la materia de Desarrollo de Aplicaciones Móviles.

## Descripción

La app simula una aplicación nativa de Android con 3 pantallas (Activities) que cubren bienvenida, registro con validaciones y captura de fotos usando la cámara del dispositivo.

## Pantallas

### Activity 1 — Bienvenida
Pantalla de presentación con datos personales de  y un botón para iniciar el registro.

### Activity 2 — Formulario de Registro
Captura y valida los siguientes campos:

| Campo | Validación |
|-------|-----------|
| Nombre completo | Solo letras, mínimo 3 caracteres |
| Correo electrónico | Formato válido con @ y dominio |
| Teléfono | Exactamente 10 dígitos numéricos |
| Contraseña | Ver reglas abajo |
| Fecha de nacimiento | Fecha válida, edad entre 10 y 120 años |
| Género | Selección obligatoria |

**Reglas de contraseña:**
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial 
- No se permiten secuencias consecutivas

**Botones:**
- **Salir** → muestra los datos capturados en un modal y regresa a Activity 1
- **Continuar** → muestra los datos capturados en un modal y avanza a Activity 3

### Activity 3 — Cámara
Usa `cordova-plugin-camera` para acceder a la cámara nativa del dispositivo.

- **Tomar Foto** → abre la cámara, captura la imagen y la guarda en `localStorage`
- **Salir** → regresa a Activity 1
- Las fotos tomadas se muestran como miniaturas en una galería dentro de la pantalla
- Al tomar una foto se muestra un preview en un modal


## Tecnologías

- Apache Cordova
- HTML5 / CSS3 / JavaScript 
- [`cordova-plugin-camera`] - acceso a cámara nativa
- `localStorage` — almacenamiento de fotos en base64
- Google Fonts — [DM Sans](https://fonts.google.com/specimen/DM+Sans)

---

Estructura del Proyecto

```
examenActivCamara/
├── www/
│   ├── index.html          # Estructura de las 3 Activities
│   ├── funciones.js        # Lógica: navegación, validaciones, cámara
│   ├── styles.css          # Estilos y diseño visual
│   └── img/
│       ├── buap.png        # Logo BUAP
│       └── fcc_logo.png    # Logo FCC
├── platforms/
│   └── android/            # Proyecto Android generado por Cordova
├── plugins/                # Plugins instalados
├── config.xml              # Configuración principal de Cordova
└── package.json
```

---

## ⚙️ Instalación y Configuración

### Prerrequisitos

- Node.js - v16 o superior
- Apache Cordova - instalado globalmente
- Android Studio con SDK de Android
- Java JDK 11 o superior

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/examenActivCamara.git
cd examenActivCamara
```

**2. Instalar dependencias y plugins**
```bash
npm install
cordova plugin add cordova-plugin-camera
```

**3. Verificar plugins instalados**
```bash
cordova plugin list
# Debe aparecer: cordova-plugin-camera
```

**4. Compilar para Android**
```bash
cordova build android
```

El APK generado se encuentra en:
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Instalación en el Dispositivo

### Opción A — Desde Android Studio
1. Abre Android Studio
2. Selecciona **Open** y navega a `platforms/android`
3. Espera que sincronice Gradle
4. Conecta tu dispositivo con USB y activa **Depuración USB**
5. Presiona ▶ **Run**

### Opción B — Instalar APK directo
1. Transfiere `app-debug.apk` al teléfono
2. En el teléfono: **Ajustes → Seguridad → Instalar apps desconocidas** → Activar
3. Abre el APK y acepta la instalación

---

##  Permisos de Android

La app requiere los siguientes permisos declarados en `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

El permiso de cámara se solicita al usuario en tiempo de ejecución la primera vez que presiona **Tomar Foto**.

## Solución de Problemas

**La cámara no se abre / no pide permiso**
- Verifica que `cordova-plugin-camera` esté instalado: `cordova plugin list`
- Confirma que los permisos están en `AndroidManifest.xml`
- Reinstala el plugin: `cordova plugin remove cordova-plugin-camera && cordova plugin add cordova-plugin-camera`
- Recompila: `cordova build android`

**La app no instala en el teléfono**
- Activa **Instalar apps de fuentes desconocidas** en Ajustes del teléfono
- Verifica que la versión mínima de Android sea compatible 

