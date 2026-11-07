---
title: "Ataques conocidos contra escritorios Linux corporativos, y cómo detenerlos"
description: "Las formas documentadas en que los atacantes entran a escritorios Linux en las empresas: robo de credenciales, escalada de privilegios, persistencia y cadena de suministro. Qué detiene cada una, y cómo IbexWall lo valida."
slug: "attacks-against-corporate-linux-desktops"
date: 2026-11-06
updated: 2026-11-06
tags: [ataques, corporativo, endurecimiento, validación]
related_hardening: []
---

Los atacantes rara vez escriben un exploit nuevo para un escritorio Linux. Reutilizan una lista corta de técnicas conocidas, porque siguen funcionando. Este artículo lista las técnicas, qué detiene cada una, y cómo IbexWall convierte "creemos que lo detuvimos" en una verificación que lo afirma.

## Robo de credenciales y cuentas débiles

La entrada más común es una contraseña vacía, reutilizada, o en una máquina donde alguien se vuelve root sin contraseña. En un escritorio corporativo el riesgo se agrava con SSH dejado abierto y sudo configurado para no pedir contraseña.

Lo que lo detiene: ninguna contraseña vacía, ningún uid 0 extraviado, bloqueo de cuenta, sudo que exige contraseña y SSH endurecido. IbexWall verifica todo esto: `accounts.empty_passwords`, `accounts.uid0`, `accounts.lockout`, `posture.sudo_nopasswd` y `ssh.hardening`.

## Escalada de privilegios

Una vez dentro como usuario sin privilegios, el atacante escala. Rutas comunes son un archivo sensible escribible, un binario setuid, un kernel viejo con una falla conocida, o una sesión desbloqueada.

Lo que lo detiene: parchear con prontitud, permisos estrictos en `/etc/shadow`, `/etc/passwd` y `/etc/sudoers`, y bloqueo de pantalla automático. IbexWall verifica actualizaciones pendientes, permisos de archivos sensibles (`accounts.file_perms`), el registro de sudo y `session_lock.automatic`.

## Persistencia

Tras la escalada, el atacante quiere sobrevivir a un reinicio. Técnicas documentadas incluyen entradas de autostart, cron, archivos de arranque de shell y `LD_PRELOAD`. Un arranque limpio que recarga silenciosamente una puerta trasera es el objetivo.

Lo que lo detiene: vigilar esos lugares en busca de cambios. El `endpoint.persistence` de IbexWall calcula el hash de unidades, temporizadores, cron, autostart, arranque de shell y `LD_PRELOAD`, y reporta lo que es nuevo o cambió desde una línea base que aceptaste.

## Cadena de suministro y ejecutar lo desconocido

Un paquete comprometido, un repositorio clonado o un script de un foro pueden plantar código que luego llama a casa o lee el disco. Esto es menos sobre "escaneo de malware" y más sobre solo ejecutar lo que confías y vigilar qué alcanza.

Lo que lo detiene: firmas de paquete, un firewall que niega entrada por defecto y control de red por programa. IbexWall verifica que las firmas de paquete se exijan (`updates.signatures`), que el firewall niegue por defecto (`firewall.default_deny`), y pregunta la primera vez que un programa nuevo alcanza la red.

## El punto de la validación

Ninguna de estas defensas es nueva. Lo difícil es saber, en una máquina concreta, cuáles se cumplen de verdad. Una política que dice "cifra el disco y bloquea las cuentas" no es cifrado. IbexWall convierte cada defensa en una verificación que lee el estado real, reporta honestamente cuando no puede leerlo, y deja que la persona corrija lo que falló mediante un plan revisado y reversible. Una empresa gana una máquina que prueba su propia postura, en lugar de una a la que solo le dijeron que fuera segura.
