#Justificación

La justificación de este proyecto se radica en la necesidad de mejorar el módulo de Transparencia de la Universidad Tecnológica de la Costa. La página actual del panel de Transparencia, debido a su diseño anticuado y su falta de funcionalidad, no ofrece una experiencia de usuario satisfactoria. La información crucial sobre la gestión administrativa y el uso de recursos públicos se encuentra en este módulo, y su accesibilidad es vital para asegurar la transparencia y la confianza del público. Mejorar el diseño y la usabilidad del módulo permitirá a los usuarios acceder a la información de manera más eficiente y agradable, cumpliendo así con los principios de transparencia y buena gestión pública.

# Transparencia UT - Frontend

Este repositorio contiene el código fuente del frontend para el proyecto de transparencia de la Universidad Tecnológica de la Costa. La aplicación frontend está desarrollada en Angular y utiliza Tailwind CSS para el diseño.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Instalación

Para instalar y ejecutar este proyecto en tu entorno local, sigue estos pasos:

1. **Clona el repositorio:**
    ```sh
    git clone https://github.com/DemonHulk/Transparencia-Frontend
    cd transparencia-frontend
    ```

2. **Instala las dependencias:**
    ```sh
    npm install
    ```

3. **Ejecuta la aplicación:**
    ```sh
    ng serve
    ```
   La aplicación estará disponible en `http://localhost:4200`.

## Uso

### Scripts Disponibles

- `ng serve`: Ejecuta la aplicación en modo de desarrollo.
- `ng build`: Compila la aplicación para producción.
- `ng test`: Ejecuta los tests unitarios.

## Estructura del Proyecto

- **src/app/components**: Componentes principales de la aplicación.
  - `navbar`: Barra de navegación.
  - `sidebar`: Barra lateral de navegación.
  - `footer`: Pie de página.
  - `document-list`: Lista de documentos.
  - `document-upload`: Formulario para cargar documentos.
  - `document-detail`: Detalles de documentos.

- **src/app/services**: Servicios para interactuar con la API del backend.
  - `user.service.ts`
  - `document.service.ts`
  - `category.service.ts`

- **src/app/models**: Modelos de datos utilizados en la aplicación.

- **src/app/pages**: Páginas principales de la aplicación.
  - `login`
  - `register`
  - `dashboard`
  - `admin`

## Contribuciones

Las contribuciones son bienvenidas. Para contribuir, por favor sigue estos pasos:

1. Realiza un fork del proyecto.
2. Crea una rama con tu nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza un commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`).
4. Empuja la rama (`git push origin feature/nueva-funcionalidad`).
5. Crea un nuevo Pull Request.

#Roles

Branko Jaziel Lomelí Ríos:
Frontend (Principal)
FullStack (Apoyo)
UI

Marco Fabián Gómez Bautista:
Frontend (Principal)
FullStack (Apoyo)
UI

Alexis Guadalupe Rivera Cabrera:
Tester (Principal)
Quality Assurance
UX

Daniel Contreras Zamarripa:
Backend (Principal)
Analista
DBA
UX

Ernesto Ibarra Villanueva:
Backend (Principal)
Analista
DBA

Marco Antonio Núñez Andrade:
Scrum Master


