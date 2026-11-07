---
title: "Los ajustes que hay que acertar al instalar Linux"
description: "Las decisiones que se toman al instalar, cifrado de disco, Secure Boot, cuentas y particionado, que luego cuesta cambiar, y cómo IbexWall valida cada una después."
slug: "linux-installation-mandatory-settings"
date: 2026-11-06
updated: 2026-11-06
tags: [instalación, cifrado, secure-boot, cuentas]
related_hardening: []
---

La mayoría de las decisiones de seguridad de Linux se toman en la primera hora, durante la instalación, y luego es molesto cambiarlas. Este artículo lista las que conviene acertar de entrada, y cómo comprobarlas después con IbexWall.

## Cifra el disco durante la instalación

Cifrar después suele significar reinstalar. Durante la configuración, elige cifrado de disco completo (LUKS) y cifra también el swap, porque un portátil suspendido escribe la imagen de memoria en el swap en claro. Donde el firmware lo permita, liga el desbloqueo al TPM2 para que la máquina arranque sin una segunda contraseña pero rechace un disco extraído.

Compruébalo después: `posture.disk_encryption` y `posture.swap_encryption` de IbexWall.

## Activa Secure Boot

Secure Boot es un ajuste del firmware, no una casilla del instalador en todas las distribuciones, pero es durante la instalación cuando notas que está apagado. Actívalo y habilita el bloqueo del kernel para que un kernel manipulado o un módulo sin firmar sea rechazado.

Compruébalo después: `posture.secure_boot` y `posture.lockdown`.

## Elige bien las cuentas

El primer usuario es el administrador. Dale una contraseña real, nunca vacía, y asegúrate de que solo la cuenta prevista tiene uid 0. Activa el bloqueo de cuenta para frenar a un adivinador.

Compruébalo después: `accounts.empty_passwords`, `accounts.uid0` y `accounts.lockout`.

## Haz que sudo pida contraseña

Algunos instaladores ofrecen sudo sin contraseña por comodidad. Recházalo. Un sudo que pide contraseña es la diferencia entre "alguien leyó el disco" y "alguien es root". Configúralo para que registre lo que ejecuta.

Compruébalo después: `posture.sudo_nopasswd` y `accounts.sudo_logging`.

## Enciende el firewall desde el primer día

Un firewall que niega entrada por defecto no cuesta nada al instalar y evita sorpresas. Fedora trae firewalld, Ubuntu trae ufw; enciende el que esté antes de que la máquina vea la red.

Compruébalo después: `firewall.default_deny` y la pantalla de firewall.

## Deja que las actualizaciones corran solas

Activa las actualizaciones de seguridad automáticas en el instalador o justo después. Una máquina que se actualiza sola cierra fallas conocidas sin un humano de por medio, y es el control que los atacantes cuentan con que se salte.

Compruébalo después: `posture.updates_automatic` y `cves.security_updates`.

## Las decisiones difíciles de cambiar

El cifrado de disco, Secure Boot y el esquema de particiones son decisiones del momento de la instalación. Todo lo demás, firewall, cuentas, sudo y actualizaciones, se puede corregir después, pero no debería hacer falta. Acertar las difíciles de entrada significa que solo quedan las fáciles.

## Compruébalo todo con IbexWall

Después de la instalación, la pantalla Visión general de IbexWall muestra una puntuación y los hallazgos detrás de ella, y la Postura del sistema lista cada comprobación: disco, arranque, firewall, cuentas, actualizaciones y puertos abiertos. Cada corrección es un plan que revisas antes, con los archivos exactos y lo que puede romper, y se puede deshacer desde el Historial.
