---
title: "El sistema de plugins de IbexWall: 32 plugins, cada uno en su propio sandbox"
description: "Por qué IbexWall está hecho de plugins firmados, cómo un solo binario sirve a todos, y por qué cada uno corre en su propio sandbox donde solo puede lo que declara su manifiesto."
slug: "ibexwall-plugin-system"
date: 2026-11-06
updated: 2026-11-06
tags: [plugins, sandbox, arquitectura, firma]
related_hardening: []
---

Una herramienta de seguridad es tan confiable como su parte más débil. IbexWall divide el trabajo en 32 plugins, cada uno responsable de una cosa, y confina a cada uno. Este artículo explica el porqué y el cómo.

## Qué hacen los plugins

Los plugins se dividen en grupos aproximados. Los de sistema verifican y endurecen la propia máquina: postura, cuentas, SSH, sysctl, montajes, actualizaciones, el daemon de auditoría, volcados de núcleo y firmware. Los de red se ocupan de DNS, firewall, exposición, Wi-Fi, hora NTS y VPN. Los de endpoint corren antivirus, integridad y escaneos de rootkit, y aíslan la máquina en una emergencia. También hay plugins para aplicaciones, dispositivos USB, cámara y micrófono, y telemetría.

Algunos solo verifican, algunos solo controlan, muchos hacen ambas cosas. Una verificación lee el estado real y reporta hallazgos; un control propone operaciones, como un cambio de sysctl o una regla de firewall, y el core las aplica.

## Un binario, muchos plugins

Los plugins se distribuyen como un solo binario multicall en `/usr/libexec/ibexwall/ibexwall-plugins`, iniciado bajo un nombre distinto para cada plugin. El nombre dice qué manifiesto leer, así que hay un solo build que firmar y auditar, no treinta y dos.

## Firmados, y a prueba de manipulación

Cada plugin lleva un manifiesto: su id, su nombre y descripción en cinco idiomas y, sobre todo, sus privilegios, las claves de sysctl, las rutas de archivo y las capacidades que puede tocar. El manifiesto está firmado, y el daemon se compila con la clave pública de release incrustada. Un plugin cuyo manifiesto fue editado después de la firma se rechaza de inmediato. Eso es lo que permite a una instalación empaquetada confiar exactamente en los plugins con los que se envió, sin ninguna clave de desarrollo.

## Cada uno en su propio sandbox

Cada plugin corre bajo systemd en su propia unidad, con usuario dinámico, sin home, directorio temporal privado, y solo los archivos y claves de sysctl que su manifiesto declaró. No tiene shell: las operaciones que propone son valores tipados, no líneas de comando, así que un plugin no puede colar un comando arbitrario.

## Los plugins proponen, el core ejecuta

Esa es la regla que sostiene todo el diseño. Un plugin nunca cambia el sistema por sí solo. Propone operaciones tipadas, y el core valida cada una contra el manifiesto, toma una instantánea del estado, y solo entonces las aplica. El plugin pregunta; el core decide. Esa separación es la razón de que un bug o una intrusión en un solo plugin no pueda alcanzar silenciosamente la máquina entera.
