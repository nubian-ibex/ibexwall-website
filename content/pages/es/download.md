---
title: "Obtener IbexWall"
description: "IbexWall 1.0 está en preparación. Mira cómo se publicarán y firmarán las versiones, cómo comprobar una descarga y cómo compilar desde el código fuente hoy."
updated: 2026-11-06
---

IbexWall 1.0 aún no se ha publicado. Esta página explica qué contendrá una versión, cómo comprobarla y cómo compilar el programa tú mismo mientras tanto.

## Qué contiene una versión

Cada versión es un conjunto de archivos en la [página de versiones de GitHub](https://github.com/nubian-ibex/ibexwall/releases):

- paquetes para Fedora (RPM), Ubuntu y Debian (DEB) y Arch Linux;
- el código fuente en el commit etiquetado;
- sumas de verificación, una firma para cada archivo, una lista de componentes del software y una declaración de procedencia que describe cómo se construyeron los archivos.

Los paquetes están divididos para que instales solo lo que necesitas: `ibexwall` (el demonio, la línea de comandos y los plugins), `ibexwall-desktop` (la ventana, el icono de la bandeja y el agente de sesión), `ibexwall-mcp` (el servidor para asistentes de IA) y un paquete de confinamiento para tu sistema: `ibexwall-apparmor` en Debian y Ubuntu, `ibexwall-selinux` en Fedora.

## Sistemas admitidos

Fedora, Ubuntu 24.04 y 26.04, Debian y Arch Linux. Antes de publicar cada versión, se instala, se usa, se actualiza, se elimina y se purga en una máquina virtual para cada uno de ellos.

## Comprueba lo que descargaste

Descarga los archivos de la versión en una sola carpeta y comprueba la firma de la lista de sumas de verificación, después cada suma y después cada firma:

```sh
git clone https://github.com/nubian-ibex/ibexwall
cd ibexwall
cargo xtask verify-release /path/to/the/folder /path/to/the/folder/ibexwall-release.pub
```

Los archivos usan el formato minisign, así que `minisign -V` también sirve para un solo archivo. La clave pública también se publica en la [página de seguridad](/es/security/); compara ambas antes de confiar en una firma. La [guía de versiones](https://docs.ibexwall.com/reference/release-verification/) explica cada archivo.

## Compilar desde el código fuente

Necesitas la cadena de herramientas de Rust indicada en `rust-toolchain.toml` y, para la ventana, las herramientas de Node.js y los paquetes de desarrollo de WebKitGTK.

```sh
git clone https://github.com/nubian-ibex/ibexwall
cd ibexwall
cargo build --release --workspace
```

Pruébalo sin cambiar tu sistema: `scripts/dev-sandbox.sh` inicia el demonio y la ventana en un entorno aislado que nunca toca tus archivos, servicios ni cortafuegos. La guía para desarrolladores está en [docs.ibexwall.com](https://docs.ibexwall.com/contributing/).

## Qué hace la instalación

Instalar crea los usuarios y directorios del sistema, activa los sockets que inician el demonio y los plugins cuando hacen falta, y los pone en marcha. No aplica ningún cambio de seguridad: cada cambio sigue siendo un plan que revisas. Al quitar los paquetes se deshace lo que IbexWall cambió, mediante la instantánea de cada cambio, y se conservan tus datos hasta que purgues.
