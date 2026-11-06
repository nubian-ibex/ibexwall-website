---
title: "Cifrado de disco en Linux: LUKS, TPM2, swap e hibernación"
description: "De qué protege el cifrado de disco LUKS, cómo el desbloqueo automático con LUKS2 y TPM2 cambia comodidad por seguridad, el hueco de swap e hibernación y cómo comprobarlo."
slug: "disk-encryption-on-linux-luks-and-tpm2"
date: 2026-11-06
updated: 2026-11-06
tags: [cifrado, luks, tpm2]
related_hardening: []
faq:
  - q: "¿De qué protege el cifrado de disco LUKS?"
    a: "Protege los datos en reposo. Si tu portátil se pierde, te lo roban o lo apagan y lo desmontan, el contenido del disco es ilegible sin la frase de contraseña o la clave."
  - q: "¿Es el desbloqueo automático con TPM2 tan seguro como escribir una contraseña?"
    a: "Cambia algo de seguridad por comodidad. El disco se abre sin frase de contraseña cuando la cadena de arranque coincide, así que quien consiga el equipo apagado en ese estado llega más lejos. Añadir un PIN lo reduce."
---

El cifrado de disco protege tus archivos cuando alguien tiene el equipo pero no a ti. En Linux se hace con LUKS, un formato estándar que va debajo del sistema de archivos. Escribes una frase de contraseña al arrancar, el disco se desbloquea y el sistema funciona con normalidad. Es la protección más útil para un portátil que se puede perder.

## De qué protege y de qué no

Protege contra:

- Un portátil o una unidad perdidos o robados.
- Alguien que saca el disco y lo lee en otro equipo.
- Datos olvidados en un disco que reciclas o vendes.

No protege contra:

- Malware que se ejecuta mientras tienes la sesión abierta. El disco ya está desbloqueado.
- Alguien que consiga tu frase de contraseña.
- Un equipo en marcha incautado mientras está desbloqueado, o una persona hostil con acceso al equipo y tiempo para manipular la partición de arranque sin cifrar.

Por eso va de la mano con [Secure Boot](/es/articles/is-secure-boot-worth-it-on-linux/): uno cubre los datos almacenados y el otro el código de arranque.

## LUKS2

LUKS tiene dos versiones. LUKS2 es la que crean los instaladores actuales. Guarda más metadatos, usa la función de derivación de claves Argon2id, que es deliberadamente costosa de adivinar, y permite varias ranuras de clave a la vez, de modo que una frase de contraseña, una clave de recuperación y un token TPM2 pueden desbloquear el mismo disco.

Comprueba qué tienes:

```sh
lsblk -f
sudo cryptsetup luksDump /dev/nvme0n1p3
```

Sustituye el dispositivo por el que `lsblk` muestra como `crypto_LUKS`. Busca `Version: 2` y las ranuras de clave. Las instalaciones antiguas pueden usar LUKS1; se puede convertir, pero antes hace falta una copia de seguridad, así que lee `man cryptsetup` antes de intentarlo.

## Desbloqueo con TPM2

Un TPM2 es un chip presente en la mayoría de los equipos modernos que puede guardar un secreto y liberarlo solo cuando el estado medido del equipo coincide. Con `systemd-cryptenroll` puedes sellar una clave de disco en él, de modo que el equipo arranca sin pedir la frase de contraseña:

```sh
sudo systemd-cryptenroll --tpm2-device=auto --tpm2-pcrs=7 /dev/nvme0n1p3
```

El PCR 7 refleja la configuración de Secure Boot. Tu initramfs debe poder usar el TPM2 (necesita desbloqueo basado en systemd) y la entrada de crypttab necesita la opción `tpm2-device=auto`. Los pasos exactos varían entre distribuciones, así que sigue la documentación de la tuya.

La contrapartida es real. El disco se abre solo para cualquiera que encienda el equipo en el estado esperado, así que la petición de contraseña pasa a la pantalla de inicio de sesión. Una contraseña de usuario débil pasa a custodiar los datos. Añadir un PIN con `--tpm2-with-pin=yes` devuelve un secreto que escribes tú. Guarda la frase de contraseña original o una clave de recuperación en un lugar seguro: una actualización de firmware o un cambio en la configuración de arranque pueden alterar las mediciones, y el TPM dejará de liberar la clave.

## Swap e hibernación

La memoria puede llegar al disco de dos formas, y ambas pueden filtrar claves y documentos si no están protegidas.

- El espacio de swap. Si es una partición normal, todo lo que se envía a swap se puede leer. Pon el swap dentro del volumen cifrado o usa zram, que mantiene las páginas en memoria.
- La hibernación. La imagen completa de la memoria se escribe en el swap y se vuelve a leer al reanudar, incluida la clave del disco. La hibernación solo es tan segura como el swap que usa, así que el swap debe estar en el volumen cifrado y el ajuste de reanudación lo debes configurar tú o el instalador.

Muchas instalaciones por defecto de Fedora y Ubuntu ponen el swap en un almacenamiento cifrado o en zram, pero "muchas" no es "la tuya". Comprueba:

```sh
swapon --show
```

Si aparece un dispositivo, confirma en `lsblk -f` que cuelga de un padre `crypto_LUKS`.

## Volcados de memoria

Cuando un programa falla, el sistema puede escribir su memoria en el disco, y esa memoria puede contener contraseñas o claves. Incluso en un disco cifrado, esos archivos se pueden leer una vez que has iniciado sesión, así que guardarlos solo donde tú quieras es una buena costumbre.

## Cómo empezar

Si tu disco no está cifrado, la solución limpia es reinstalar eligiendo el cifrado en el instalador. Cifrar sobre la marcha es posible con herramientas como `cryptsetup-reencrypt`, pero es arriesgado; haz antes una copia de seguridad completa.

## Compruébalo con IbexWall

La postura del sistema indica si el disco está cifrado, y la comprobación de volcados de memoria (system.coredump) puede desactivar el almacenamiento de volcados mediante un plan. IbexWall no cifra un disco por ti ni cambia las claves de LUKS; señala el hueco. Todo cambio que sí hace es un plan que revisas, con una instantánea que puedes deshacer desde el Historial. La versión 1.0 está en preparación.
