---
title: "SELinux o AppArmor en un escritorio: lo que debes saber"
description: "El control de acceso obligatorio limita a un programa comprometido. Qué distribuciones usan SELinux o AppArmor, cómo comprobarlo y qué hacer si bloquea algo."
slug: "selinux-vs-apparmor-for-a-desktop-user"
date: 2026-11-06
updated: 2026-11-06
tags: [selinux, apparmor, mac]
related_hardening: []
faq:
  - q: "¿Cuál es la diferencia entre SELinux y AppArmor?"
    a: "Ambos limitan lo que un programa puede tocar aunque se ejecute con todos los derechos. SELinux etiqueta cada archivo y proceso y usa una política sobre etiquetas. AppArmor escribe reglas por ruta de archivo para cada programa."
  - q: "¿Debo desactivar SELinux o AppArmor cuando algo se bloquea?"
    a: "No. Lee la denegación en el registro y luego corrige la etiqueta o pon en modo permisivo solo ese programa. Desactivar todo el sistema quita la protección a todo."
---

Los permisos normales de Linux responden a una pregunta: ¿puede este usuario abrir este archivo? El control de acceso obligatorio (MAC) añade una segunda: ¿puede este programa en concreto, sea cual sea el usuario con el que se ejecute? Si un navegador o un servicio de red se ve comprometido, MAC limita hasta dónde llega el intruso. Linux tiene dos sistemas comunes para esto, SELinux y AppArmor, y casi seguro ya tienes uno de ellos.

## Qué distribución usa cuál

- Fedora usa SELinux, en modo enforcing por defecto.
- Ubuntu usa AppArmor, activo por defecto.
- Debian tiene AppArmor activado por defecto desde Debian 10, con un conjunto de perfiles más pequeño que el de Ubuntu.
- Arch Linux no activa ninguno por defecto. Puedes añadir cualquiera de los dos, y requiere trabajo manual.

Rara vez eliges. Usas lo que mantiene tu distribución, porque su política y sus perfiles están escritos y probados para los paquetes de ese sistema.

## En qué se diferencian

SELinux da a cada archivo, proceso y puerto una etiqueta y escribe una política sobre qué etiquetas pueden actuar sobre cuáles. Es exhaustivo y de grano fino, y las etiquetas viven con el archivo, así que mover o copiar un archivo puede dejarlo con la etiqueta equivocada. AppArmor asocia un perfil a un programa y enumera las rutas y capacidades que puede usar. Es más sencillo de leer y escribir, y sigue los nombres de archivo en lugar de las etiquetas. Ninguno es "más seguro" en general. Su fortaleza depende de la política de cada programa, y lo que importa en un escritorio es que esté activo el que trae tu distribución.

## Mira si está activado

SELinux (Fedora):

```sh
getenforce
sestatus
```

`Enforcing` es lo que quieres. `Permissive` registra los problemas sin detenerlos, y `Disabled` es apagado.

AppArmor (Ubuntu, Debian):

```sh
sudo aa-status
```

Muestra cuántos perfiles están cargados y en modo enforce o complain. En Debian puede que necesites instalar los paquetes `apparmor` y `apparmor-utils` y activar el módulo en el arranque; si `aa-status` dice que no está cargado, el kernel necesita `apparmor=1 security=apparmor` en su línea de comandos, y la wiki de Debian describe los pasos.

## Cuando bloquea algo

Un programa que funciona como root pero falla bajo MAC, o un servicio que falla después de mover su carpeta de datos, es la historia típica. El sistema está funcionando: detuvo algo que la política no esperaba. La respuesta es leer la denegación, no apagar la protección.

En SELinux, busca las denegaciones:

```sh
sudo ausearch -m AVC,USER_AVC -ts recent
```

En Fedora, la herramienta SETroubleshoot puede explicarlas con palabras si está instalada su alerta de escritorio o `sealert`. La causa más común es una etiqueta incorrecta en archivos que moviste, que `restorecon -Rv /path` corrige. Para un servicio que debe usar una carpeta no estándar, dale la etiqueta correcta con `semanage fcontext` y luego `restorecon`. Si necesitas comprobar si la causa es SELinux, `sudo setenforce 0` lo pone en modo permisivo hasta el próximo reinicio, y `sudo setenforce 1` lo vuelve a activar. No lo dejes así.

En AppArmor, las denegaciones aparecen en el registro del kernel:

```sh
sudo journalctl -k | grep -i 'apparmor="DENIED"'
```

Puedes poner un solo perfil en modo complain con `sudo aa-complain /path/to/program`, y devolverlo con `sudo aa-enforce /path/to/program`. O puedes añadir una anulación local en `/etc/apparmor.d/local/` para la ruta concreta que necesita el programa, y recargar el perfil con `sudo apparmor_parser -r` sobre su archivo.

## ¿Necesitas hacer algo?

Casi siempre no. Mantenlo activado, actualiza tu sistema y lee el registro cuando algo falle de forma rara. No lo desactives como primer paso, porque eso quita una protección a todos los programas a cambio de arreglar uno. Si ejecutas programas que no vienen de los paquetes de la distribución, como un binario de la web de un fabricante, espera que estén menos confinados que los empaquetados.

## Compruébalo con IbexWall

El resolvedor, el servidor MCP y los plugins de IbexWall están confinados por perfiles de AppArmor en Debian y Ubuntu y por un módulo de SELinux en Fedora, incluidos en paquetes aparte (`ibexwall-apparmor` o `ibexwall-selinux`). La pantalla Postura del sistema informa del estado de la protección de tu sistema, y en la pantalla Plugins puedes revisar qué puede leer y cambiar cada plugin. Cualquier cambio es un plan que revisas y deshaces desde el Historial. La versión 1.0 está en preparación.
