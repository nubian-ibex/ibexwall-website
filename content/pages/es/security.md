---
title: "Seguridad"
description: "Cómo está construido IbexWall para ganarse la confianza: planes e instantáneas, plugins y versiones firmados, plugins aislados, servicios confinados y cómo informar de una vulnerabilidad."
updated: 2026-11-06
---

Una herramienta de seguridad tiene que ser más segura que el equipo que protege. Esta página enumera lo que IbexWall hace al respecto y lo que no afirma.

## Cambios que puedes ver y deshacer

No se cambia nada sin un plan. Un plan enumera los archivos, servicios y reglas de cortafuegos exactos, con una vista previa de la diferencia y una nota sobre lo que podría romperse. Antes de aplicarlo se crea una instantánea. Un cambio que podría cortar tu red espera tu confirmación y se deshace solo si no la das. El Historial enumera cada cambio y permite deshacer cualquiera de ellos.

## Los plugins proponen, el núcleo ejecuta

Un plugin lee el sistema y describe un cambio. No puede hacerlo. Solo el núcleo aplica cambios, como root, mediante el plan, la instantánea y tu aprobación. IbexWall edita únicamente sus propios archivos (drop-ins con `ibexwall` en el nombre y su propia tabla de cortafuegos) y nunca los que pertenecen a tu distribución o a otro programa.

## Firmado, aislado, confinado

- Los manifiestos de los plugins están firmados. El demonio se compila con la clave pública de la versión y rechaza un manifiesto que no se verifique.
- Cada uno de los 32 plugins se ejecuta en su propia unidad de systemd: un usuario dinámico, sin capacidades salvo las que declare, con el sistema en solo lectura. La puntuación de `systemd-analyze security` de la unidad se publica para cada plugin.
- En Debian y Ubuntu, perfiles de AppArmor confinan el resolvedor, el servidor del asistente y los plugins. En Fedora lo hace un módulo de SELinux. Ambos se prueban con la aplicación forzosa activada.

## Versiones que puedes comprobar

Cada versión tiene sumas de verificación, una firma para cada archivo, una lista de componentes del software (CycloneDX) y una declaración de procedencia. La compilación es reproducible: compilar el mismo commit dos veces, en carpetas distintas, da archivos idénticos.

## Lo que no hace

IbexWall no protege un equipo de alguien que ya tiene root en él, y no puede hacer seguro un programa inseguro. Reduce la superficie de ataque y te dice qué está expuesto. Su modelo de amenazas es público en la [documentación](https://docs.ibexwall.com/concepts/security-model/).

## La clave de las versiones

La clave que firma las versiones se publicará aquí y en el repositorio antes de que salga la versión 1.0. Hasta entonces, los paquetes creados por las pruebas del proyecto se firman con una clave de desarrollo que no es válida para una versión.

## Informar de una vulnerabilidad

Usa el sistema de informes privados de vulnerabilidades de GitHub en el [repositorio](https://github.com/nubian-ibex/ibexwall/security). No abras una incidencia pública por un problema de seguridad y no incluyas secretos en un informe. Procuramos responder en unos pocos días.
