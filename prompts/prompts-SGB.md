# IDE utilizado

Cursor con Claude 3.7 Sonnet Thinking (Agent)

# Prompts utilizados

```
Se requiere añadir tests E2E para la vista de detalle de una posición, la cual es accesible desde la página principal, pulsando el botón "Ir a Posiciones" y a continuación pulsando el botón "Ver proceso" de la posición a consultar.

Concretamente, es necesario verificar los siguientes escenarios:

1. Vista de detalle de posición

   1.1. Verifica que el título de la posición se muestra correctamente en la parte superior de la vista.

   1.2. Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación de la posición.

   1.3. Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual.

2. Cambio de fase de un candidato

   2.1. Simula el arrastre de una tarjeta de candidato de una columna a otra.

   2.2. Verifica que la tarjeta del candidato se mueve a la nueva columna.

   2.3. Verifica que se realiza la correspondiente llamada al backend mediante el endpoint `PUT /candidate/:id`.

Los requisitos técnicos son los siguientes:

1. Utiliza Cypress para los tests E2E.
2. Todos los tests deben incluirse en un único archivo `/cypress/integration/position.spec.js`.
```

Fue necesario arreglar un error del test de arrastre:
```
Sale el siguiente error en el test de arrastre (captura adjuntada)
```