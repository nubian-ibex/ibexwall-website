---
title: "¿Qué tan seguro es mi equipo Linux? Revisión en 10 minutos"
description: "Revisa actualizaciones, cifrado de disco, cortafuegos, Secure Boot, puertos abiertos, SSH, usuarios y copias de seguridad en diez minutos, y qué significa una puntuación."
slug: "how-secure-is-my-linux-computer"
date: 2026-11-06
updated: 2026-11-06
tags: [lista-de-comprobación, básicos, postura]
related_hardening: [mounts.tmp-noexec, fs.protected-files]
faq:
  - q: "¿Cómo puedo comprobar rápido qué tan seguro es mi equipo Linux?"
    a: "Mira ocho cosas: actualizaciones pendientes, cifrado de disco, estado del cortafuegos, Secure Boot, puertos en escucha, el servidor SSH, las cuentas de usuario y las copias de seguridad. Cada una lleva uno o dos minutos con un solo comando."
  - q: "¿Una puntuación de seguridad alta significa que mi equipo está a salvo?"
    a: "No. Una puntuación cuenta los ajustes que se comprobaron. No puede ver contraseñas débiles, una página de phishing en la que hiciste clic ni el software que instalaste a propósito."
---

Tu equipo Linux probablemente está en buen estado si instala actualizaciones, tiene el disco cifrado, usa un cortafuegos que sabes explicar y no ofrece a la red nada que no hayas elegido. Puedes comprobar todo eso en unos diez minutos con los comandos de abajo. Donde un comando cambia entre distribuciones, el texto lo indica.

## Las ocho comprobaciones

### 1. Actualizaciones

La mayoría de los ataques con éxito usan un fallo que ya tiene corrección. Mira si hay correcciones esperando:

```sh
# Fedora
sudo dnf check-upgrade
# Ubuntu and Debian
sudo apt update && apt list --upgradable
# Arch
checkupdates   # from the pacman-contrib package
```

Si la lista es larga, actualiza ahora. Después mira si las actualizaciones de seguridad se instalan solas: Ubuntu y Debian usan `unattended-upgrades`, Fedora usa `dnf-automatic` (dnf5 tiene su propio plugin automático) y Arch no tiene una herramienta así porque es una distribución de actualización continua que actualizas a mano.

### 2. Cifrado de disco

Si alguien se lleva tu portátil, un disco sin cifrar se puede leer conectándolo a otra máquina. Mira la disposición:

```sh
lsblk -f
```

Una línea `crypto_LUKS` sobre tu sistema de archivos raíz significa que el disco está cifrado. Nuestro artículo sobre [LUKS y TPM2](/es/articles/disk-encryption-on-linux-luks-and-tpm2/) explica qué protege y qué no.

### 3. Cortafuegos

Comprueba cuál usa tu sistema:

```sh
sudo nft list ruleset | head -40
sudo ufw status            # Ubuntu, if ufw is installed
sudo firewall-cmd --state  # Fedora, if firewalld is installed
```

Una salida vacía del primero e "inactive" de los otros significa que no hay ningún filtrado. Si necesitas uno es el tema de [otro artículo](/es/articles/do-you-need-a-firewall-on-linux-desktop/).

### 4. Secure Boot

```sh
mokutil --sb-state
```

"SecureBoot enabled" significa que el firmware solo inicia software de arranque firmado. El comando está en el paquete `mokutil` de las cuatro familias. Mira [¿Vale la pena Secure Boot en Linux?](/es/articles/is-secure-boot-worth-it-on-linux/) para conocer sus límites.

### 5. Puertos abiertos

Un puerto es una puerta que un programa mantiene abierta. Enumera los que esperan conexiones:

```sh
sudo ss -tulpn
```

Todo lo que escucha en `127.0.0.1` o `::1` solo es accesible desde tu propia máquina. Las líneas con `0.0.0.0`, `[::]` o `*` aceptan conexiones desde la red. Para cada una, pregúntate si conoces el programa y si quieres que esté ahí. Si no, detén su servicio.

### 6. SSH

Si nunca inicias sesión en este equipo desde otro sitio, el servidor SSH no debería estar en marcha:

```sh
systemctl is-active sshd   # Fedora, Arch
systemctl is-active ssh    # Debian, Ubuntu
```

Si lo usas, comprueba los ajustes efectivos con `sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication'`. El acceso de root debería ser `no`, y las claves son mejores que las contraseñas.

### 7. Usuarios

```sh
getent group sudo wheel
sudo awk -F: '$2 == "" {print $1}' /etc/shadow
```

El primero enumera quién puede convertirse en administrador (el grupo es `sudo` en Debian y Ubuntu, `wheel` en Fedora y Arch). El segundo muestra las cuentas con el campo de contraseña vacío, y no debería mostrar nada.

### 8. Copias de seguridad

Ningún comando puede decirte que tu copia de seguridad funciona. Abre la más reciente y restaura un solo archivo en una carpeta de pruebas. Si falla, has encontrado tu problema más importante. El ransomware, un disco que falla y un `rm` mal escrito terminan en el mismo sitio.

## Por dónde empezar cuando la lista es larga

No intentes corregirlo todo en una tarde. Actualiza primero, porque no cuesta nada y cierra fallos conocidos. Después ocúpate de todo lo que escuche en la red y no reconozcas, y luego de SSH y las cuentas. El cifrado de disco y Secure Boot suelen requerir una reinstalación o una visita a los ajustes del firmware, así que planéalos para un fin de semana. Configura las copias de seguridad antes de cualquier cambio arriesgado, no después.

## Qué significa una puntuación

Una puntuación sobre 100 es un resumen de los ajustes que un programa pudo leer: si el cortafuegos está activado, si el disco está cifrado, si hay actualizaciones pendientes. Sirve para encontrar huecos y para ver el progreso después de cambiar algo. No es un veredicto. No sabe que tu contraseña es `hunter2`, que la reutilizas o que ejecutaste un script de un foro. Trata una puntuación baja como una lista de tareas y una alta como "lo básico está cubierto", no como "no puede pasar nada".

## Compruébalo con IbexWall

La pantalla Resumen de IbexWall muestra una puntuación y una lista de qué corregir, y la postura del sistema enumera cada comprobación que hay detrás (arranque, disco, cortafuegos, cuentas, actualizaciones, puertos abiertos). Cada corrección es un plan que revisas primero, con los archivos exactos y lo que podría romperse, y puedes deshacerla desde el Historial. La versión 1.0 está en preparación, así que aún no hay descarga; consulta la documentación en docs.ibexwall.com para ver el avance.
