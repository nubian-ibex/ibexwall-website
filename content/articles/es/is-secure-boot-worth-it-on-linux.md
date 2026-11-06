---
title: "¿Vale la pena Secure Boot en Linux? Qué cubre y qué no"
description: "Secure Boot comprueba que el código que inicia tu equipo está firmado. Qué protege, qué no, cómo funcionan shim y MOK, y cómo comprobar el tuyo."
slug: "is-secure-boot-worth-it-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [secure-boot, arranque, firmware]
related_hardening: [kernel.kexec]
faq:
  - q: "¿Vale la pena activar Secure Boot en Linux?"
    a: "Sí para la mayoría de las personas. Impide que se ejecute código de arranque sin firmar al iniciar y permite que el kernel active el bloqueo (lockdown). No protege los archivos una vez que el sistema está en marcha ni un disco robado sin cifrar."
  - q: "¿Cómo compruebo si Secure Boot está activado?"
    a: "Ejecuta mokutil --sb-state. Muestra SecureBoot enabled o disabled."
---

Para la mayoría de los usuarios de escritorio, sí: vale la pena activar Secure Boot, y las principales distribuciones de Linux funcionan con él. Cierra una puerta concreta, que es la del código sin firmar que se ejecuta antes de que arranque tu sistema operativo. No vuelve seguro el sistema en marcha ni protege los datos de un disco que no está cifrado.

## Qué hace

Cuando el equipo arranca, el firmware UEFI puede negarse a ejecutar cualquier cosa cuya firma no considere de confianza. Con Secure Boot activado, el firmware comprueba el cargador de arranque, el cargador comprueba el kernel y el kernel puede comprobar los módulos que carga. Una herramienta que se instala en la cadena de arranque (un bootkit) tiene que estar firmada por una clave en la que el firmware confíe, o no se ejecuta.

Hay otro efecto que importa más en el día a día. Con Secure Boot activado, el kernel puede iniciarse en modo lockdown, que cierra formas en que root puede modificar el kernel en marcha, como escribir en la memoria del kernel o cargar módulos sin firmar.

## Qué no hace

- No protege contra el malware que se ejecuta como tú después de iniciar el sistema.
- No cifra nada. Alguien con tu portátil todavía puede leer un disco sin cifrar. Mira [el cifrado de disco con LUKS y TPM2](/es/articles/disk-encryption-on-linux-luks-and-tpm2/).
- No comprueba tus propios archivos, scripts ni el contenido de tu carpeta personal.
- Depende del firmware. Una cadena de arranque firmada con un firmware desactualizado y vulnerable, o con un cargador de arranque antiguo revocado, es tan fuerte como su parte más débil.
- Confía en las claves de tu firmware, incluida la que firma el componente de arranque común, shim.

## Shim y MOK

La mayoría del firmware confía en una clave de Microsoft. Las distribuciones de Linux no pueden conseguir que firme cada kernel, así que incluyen un pequeño programa firmado llamado shim. El firmware confía en shim, y shim confía en la clave propia de la distribución y en una lista que controla el propietario llamada MOK (Machine Owner Key).

MOK es la forma de ejecutar módulos de kernel de terceros, como algunos controladores gráficos o de virtualización, con Secure Boot activado. Firmas el módulo (o dejas que lo haga la herramienta de tu distribución), registras la clave con `mokutil --import`, reinicias y confirmas el registro en la pantalla azul que aparece al arrancar, con la contraseña que elegiste. No se registra nada sin que estés delante de la consola, y ese es el objetivo.

Si un módulo no se carga y el registro menciona "required key not available", significa que no está firmado para esta cadena de claves.

## Lockdown

Comprueba en qué modo está el kernel:

```sh
cat /sys/kernel/security/lockdown
```

El modo activo aparece entre corchetes: `[none]`, `[integrity]` o `[confidentiality]`. Integrity bloquea lo que permitiría a root modificar el kernel. Confidentiality también bloquea la lectura de secretos del kernel. Muchos kernels de distribución eligen integrity cuando Secure Boot está activado, pero comprueba el tuyo en lugar de suponerlo. Lockdown es la razón por la que algunas herramientas antiguas, incluido el acceso directo a la memoria, dejan de funcionar con Secure Boot activado.

## Cómo comprobarlo

```sh
mokutil --sb-state
```

Instala antes `mokutil` si falta el comando. En sistemas con systemd, `bootctl status` también muestra el estado de Secure Boot y la configuración del firmware. Si el equipo no tiene UEFI (BIOS antigua o algunas máquinas virtuales), ninguno mostrará un resultado y no hay nada que activar.

Para activarlo, abre la configuración del firmware (normalmente Supr, F2 o F10 durante el arranque) y activa Secure Boot. En Arch Linux y en algunas otras configuraciones primero debes firmar tu propio cargador de arranque o usar una herramienta como `sbctl`, porque la instalación no incluye binarios firmados; sigue la página de Secure Boot de la Arch Wiki en lugar de adivinar el orden de los pasos.

## Si vale el esfuerzo

Donde tu distribución se encarga de la firma, el coste es un ajuste y un registro de clave ocasional, y ganas protección contra una clase de ataques persistentes y el modo lockdown. Si compilas kernels propios o dependes de módulos sin firmar, el trabajo es mayor y la ganancia menor. El cifrado de disco y las actualizaciones merecen atención primero.

## Compruébalo con IbexWall

La pantalla Postura del sistema cubre arranque, disco, cortafuegos y cuentas, y los ajustes de refuerzo del kernel del catálogo explican qué afecta cada cambio, como el que [prohíbe cargar otro kernel mientras el sistema está en marcha](/es/hardening/kernel.kexec/). IbexWall lee el estado y te dice qué corregir. Los cambios que hace son planes que revisas y puedes deshacer desde el Historial. La versión 1.0 está en preparación.
