---
title: "Configuración obligatoria para un escritorio Linux corporativo"
description: "La lista que una empresa debería aplicar en cada escritorio Linux antes de entregarlo a un empleado: cifrado de disco, Secure Boot, cuentas, firewall, actualizaciones y SSH, y cómo IbexWall demuestra que cada punto se cumple."
slug: "corporate-linux-desktop-mandatory-setup"
date: 2026-11-06
updated: 2026-11-06
tags: [corporativo, instalación, lista, cumplimiento]
related_hardening: []
---

Una empresa que despliega escritorios Linux suele escribir una política y luego confiar en que cada máquina la sigue. Este artículo convierte esa política en una lista concreta, y apunta a las comprobaciones de IbexWall que demuestran que cada punto se cumple de verdad en la máquina.

## Cifrado de disco, antes que nada

Cifra el disco y el swap, y desbloquea con una clave ligada al TPM2 donde el firmware lo permita, para que la máquina arranque sin una segunda contraseña pero aun así rechace un disco extraído. Sin cifrado, todo lo demás da igual: los datos salen por la puerta con el portátil.

Lo que valida IbexWall: `posture.disk_encryption` y `posture.swap_encryption` leen el estado real del disco y del swap, y dicen con honestidad cuando no pueden.

## Secure Boot y bloqueo del kernel

Activa Secure Boot y habilita el bloqueo del kernel. Juntos impiden que un atacante arranque un kernel manipulado o cargue un módulo sin firmar desde un sistema en marcha.

Lo que valida IbexWall: `posture.secure_boot` y `posture.lockdown`.

## Cuentas: sin contraseñas vacías, sin root extraviado, bloqueo activado

Un escritorio corporativo tiene exactamente una vía de administrador, y exige contraseña. Comprueba que ninguna cuenta tiene contraseña vacía, que solo las cuentas previstas tienen uid 0 y que los fallos de inicio de sesión bloquean la cuenta.

Lo que valida IbexWall: `accounts.empty_passwords`, `accounts.uid0` y `accounts.lockout`.

## sudo pide contraseña, y registra

Configura sudo para exigir la contraseña del usuario y para registrar lo que ejecuta. Un sudo sin contraseña convierte una sesión robada en root instantáneo; un sudo sin registro oculta lo que se hizo.

Lo que valida IbexWall: `posture.sudo_nopasswd` y `accounts.sudo_logging`.

## Un firewall que niega entrada por defecto

Nada debería escuchar conexiones nuevas salvo lo que la empresa abrió. En Fedora es firewalld, en Ubuntu ufw, e IbexWall trabaja a través del que esté presente.

Lo que valida IbexWall: `firewall.default_deny`, y la pantalla de firewall cierra lo que no debería escuchar.

## Actualizaciones que se instalan solas

Activa las actualizaciones de seguridad automáticas para que una falla conocida se cierre sin esperar a una persona. Es el control más barato que existe y el que los atacantes cuentan con que saltes.

Lo que valida IbexWall: `posture.updates_automatic`, `updates.automatic` y `cves.security_updates`.

## SSH, si está activo

Si un escritorio acepta SSH, endurécelo: sin login de root, sin login solo por contraseña y sin claves cortas. Si no necesita SSH, apágalo.

Lo que valida IbexWall: `ssh.hardening`.

## Copias de seguridad, probadas restaurando

Ninguna comprobación demuestra que una copia funciona. La regla es: una vez al mes, restaura un archivo de la copia más reciente a una carpeta temporal. El ransomware, un disco que falla y un `rm` mal escrito terminan en el mismo sitio.

## Demuéstralo, por máquina

Una política que dice "cifra el disco" no es cifrado. El valor de IbexWall en un despliegue corporativo es que cada máquina demuestra su propia postura, y un gestor de flota puede recoger un informe firmado (`ibexctl compliance export`) sin que IbexWall llame a casa. La pantalla de Cumplimiento compara la máquina con LGPD, NIST e ISO donde la empresa necesita evidencia para una auditoría.
