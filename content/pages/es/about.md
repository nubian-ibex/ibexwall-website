---
title: "Acerca de IbexWall"
description: "IbexWall es un centro de seguridad libre y de código abierto para Linux, creado por el proyecto Nubian Ibex. Licencia, cómo está hecho y cómo participar."
updated: 2026-11-06
---

IbexWall es un centro de seguridad libre y de código abierto para escritorios Linux, publicado bajo la licencia GPL-3.0-or-later por el proyecto Nubian Ibex. Existe porque revisar un equipo Linux, entender el resultado y corregirlo con seguridad no debería exigir un día de lectura.

## Principios

- Primero mostrar, después cambiar: cada cambio es un plan que revisas y puedes deshacer.
- Decirlo con claridad: cada comprobación y cada ajuste se explican con palabras que una persona sin experiencia puede seguir, e indican qué pueden romper.
- Que siga siendo tuyo: sin telemetría, sin cuenta, sin dependencia de un proveedor. Los datos están en tu equipo y el código es abierto.
- Quedarse en su carril: IbexWall cambia solo sus propios archivos y deja en paz los de tu distribución.

## Cómo está hecho

El demonio, la línea de comandos, el resolvedor de DNS seguro y el servidor del asistente están escritos en Rust. El control de red por programa usa eBPF, el cortafuegos es nftables, las piezas se comunican entre sí por varlink y polkit decide quién puede hacer qué. La ventana es una interfaz Svelte 5 dentro de Tauri 2. Los plugins son un único binario firmado, que systemd inicia para cada plugin en su propio entorno aislado.

## Participa

- Lee la [documentación](https://docs.ibexwall.com) y el [código fuente](https://github.com/nubian-ibex/ibexwall).
- Traduce: la aplicación y este sitio están en inglés, portugués, español, francés y alemán, y añadir un idioma no requiere código. La [guía de traducción](https://docs.ibexwall.com/contributing/translating/) explica cómo.
- Revisa un ajuste de refuerzo: cada página enumera sus fuentes. Si algo es incorrecto o está desactualizado, abre una incidencia.

## Idiomas

El programa y este sitio siguen el idioma de tu sistema. Cada página tiene un selector de idioma; una página que aún no está traducida muestra el texto en inglés y lo indica.
