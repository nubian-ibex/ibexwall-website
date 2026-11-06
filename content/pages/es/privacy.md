---
title: "Privacidad"
description: "IbexWall no tiene telemetría, cuentas ni analíticas. Qué guarda en tu equipo, qué registra el resolvedor y cómo comprobar que no sale nada."
updated: 2026-11-06
---

IbexWall no recopila datos sobre ti ni sobre tu equipo. No hay telemetría, cuenta, analíticas ni comprobación de actualizaciones que avise a nadie. Este sitio web no usa cookies, analíticas ni peticiones a terceros; sus fuentes tipográficas e imágenes se sirven desde la misma dirección que las páginas.

## Qué se queda en tu equipo

- El estado del programa (planes, Historial, registro de auditoría) está en `/var/lib/ibexwall` y sus ajustes en `/etc/ibexwall`. Solo root puede leerlos donde corresponde.
- El registro de auditoría es una cadena: cada línea lleva el hash de la anterior, así que se detecta una línea eliminada o modificada.
- El resolvedor de DNS seguro cuenta las consultas y los bloqueos. Nunca registra los nombres que consultas.

## Qué sale de tu equipo, y solo cuando lo pides

IbexWall usa la red cuando se lo indicas: una consulta DNS que haces va al resolvedor que elegiste, por una conexión cifrada; una actualización de paquetes que ejecutas va a tu distribución. Un asistente de IA que conectes puede leer un estado con los datos sensibles ocultos, por una conexión que tú configuras y con una clave que puedes quitar.

## Compruébalo tú mismo

No tienes que creerlo sin más. Observa las conexiones con `ss -tup`, captura el tráfico con `tcpdump` o usa la vista de red por programa del propio programa para ver con qué contacta cada proceso. El artículo [Sin telemetría en una herramienta de seguridad](/es/articles/no-telemetry-in-a-security-tool/) explica cómo.

## Este sitio web

Las páginas son archivos estáticos. No hay cookies, ni scripts de otros sitios, ni seguimiento. Los enlaces a otros sitios, como GitHub y la documentación, son enlaces normales.
