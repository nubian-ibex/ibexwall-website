---
title: "Refuerzo del kernel de Linux con sysctl, en palabras claras"
description: "Qué es el refuerzo con sysctl, qué ajustes son seguros para empezar, cuáles pueden romper Flatpak, VPN o IPv6, y cómo aplicarlos y deshacerlos con limpieza."
slug: "linux-kernel-hardening-sysctl-in-plain-words"
date: 2026-11-06
updated: 2026-11-06
tags: [sysctl, kernel, refuerzo]
related_hardening: [kernel.kptr-restrict, kernel.dmesg-restrict, net.tcp-syncookies, kernel.user-namespaces]
faq:
  - q: "¿Qué es el refuerzo con sysctl?"
    a: "El kernel tiene ajustes que puedes cambiar mientras funciona. Reforzar significa elegir valores más estrictos, como ocultar las direcciones del kernel a los programas normales, para que un fallo sea más difícil de explotar."
  - q: "¿Cómo deshago un cambio de sysctl?"
    a: "Borra el archivo que creaste en /etc/sysctl.d y luego pon el valor anterior con sysctl -w o reinicia. Mira antes el valor anterior y anótalo."
---

Sysctl es la lista de ajustes que el kernel de Linux en marcha te deja cambiar sin recompilarlo. Reforzar con sysctl significa elegir valores más estrictos para los que afectan a la seguridad. Cada ajuste es pequeño y la mayoría son seguros. Unos pocos pueden romper software que usas, así que lo sensato es empezar con los inofensivos y probar el resto de uno en uno.

## Cómo funciona

Lee un valor:

```sh
sysctl kernel.kptr_restrict
```

Cámbialo hasta el próximo reinicio:

```sh
sudo sysctl -w kernel.kptr_restrict=2
```

Consérvalo tras los reinicios poniéndolo en un archivo dentro de `/etc/sysctl.d/`, cuyos archivos terminan en `.conf` y se leen por orden de nombre:

```sh
echo 'kernel.kptr_restrict = 2' | sudo tee /etc/sysctl.d/90-example.conf
sudo sysctl --system
```

Funciona igual en Fedora, Ubuntu, Debian y Arch. No edites los archivos que trae tu distribución; añade los tuyos, para que una actualización no sobrescriba tu trabajo y puedas quitarlo después. Como los archivos se leen en orden, gana el nombre posterior cuando dos definen la misma clave.

## Ajustes seguros para empezar

Cambian poco en un escritorio y tienen un beneficio claro.

- [`kernel.kptr_restrict`](/es/hardening/kernel.kptr-restrict/) oculta las direcciones de memoria del kernel a los programas normales. Los atacantes usan esas direcciones para apuntar un exploit.
- [`kernel.dmesg_restrict`](/es/hardening/kernel.dmesg-restrict/) deja que solo un administrador lea el registro del kernel, que puede mostrar direcciones y detalles del hardware.
- [`net.ipv4.tcp_syncookies`](/es/hardening/net.tcp-syncookies/) mantiene el equipo respondiendo cuando alguien lo inunda con conexiones a medio abrir. Muchas distribuciones ya lo ponen en 1.
- `fs.protected_symlinks`, `fs.protected_hardlinks`, `fs.protected_fifos` y `fs.protected_regular` bloquean viejos trucos en los que un atacante deja un enlace o un archivo en una carpeta compartida como `/tmp` para que un programa con privilegios escriba donde él quiere. El catálogo los agrupa como [proteger las carpetas compartidas](/es/hardening/fs.protected-files/).

Es probable que algunos ya estén activos en tu sistema. Leer el valor primero te lo dirá.

## Los que pueden romper cosas

Un valor más estricto puede quitar algo que un programa necesita. Casos conocidos:

- [`user.max_user_namespaces=0`](/es/hardening/kernel.user-namespaces/) elimina una gran parte de la superficie de ataque del kernel, y también impide que funcionen Flatpak, los sandboxes de Chromium y Firefox, los contenedores sin root y muchos AppImage. Para la mayoría de los escritorios es demasiado caro.
- `kernel.yama.ptrace_scope` elevado a un nivel más estricto hace que un depurador como `gdb` o `strace` no pueda engancharse a un programa en marcha sin derechos adicionales. Los desarrolladores lo notan enseguida.
- `kernel.perf_event_paranoid` en un valor alto impide el análisis de rendimiento sin privilegios con `perf`.
- `net.ipv4.conf.all.rp_filter=1` descarta los paquetes que llegan por una interfaz que el kernel no usaría para responder. Eso puede romper algunas VPN y equipos con varias rutas de red.
- Ignorar los anuncios de router IPv6 puede dejar a IPv6 sin dirección en la mayoría de las redes domésticas.
- `kernel.sysrq=0` elimina las teclas de emergencia para un equipo bloqueado.
- Bloquear kexec no se puede deshacer hasta el próximo reinicio, y afecta a las herramientas de volcado de fallos.

La regla es sencilla: cambia uno, usa el equipo un día y deja el resto para más adelante.

## Cómo probar un cambio

Después de cada cambio, usa la máquina como lo haces normalmente. Abre tu navegador, inicia una aplicación Flatpak si las usas, conéctate a tu VPN, enchufa un dispositivo, compila algo. Si trabajas en remoto, mantén abierta una segunda sesión. Los problemas de los cambios de sysctl suelen mostrarse como un programa que falla con un error de "permission denied" o "operation not permitted" sin causa evidente, así que si eso ocurre justo después de un cambio, sospecha primero del cambio. Cambiar un valor cada vez hace obvio al culpable y deja el deshacer en una sola línea.

## Aplicar y deshacer

Anota los valores actuales antes de cambiar nada:

```sh
sysctl kernel.kptr_restrict kernel.dmesg_restrict
```

Para deshacer un cambio persistente, elimina el archivo y vuelve a poner el valor anterior, ya que borrar solo el archivo no cambia el kernel en marcha:

```sh
sudo rm /etc/sysctl.d/90-example.conf
sudo sysctl -w kernel.kptr_restrict=0
```

Un reinicio también vuelve a lo que digan los archivos restantes y el valor por defecto del kernel. Si un ajuste hace que algo deje de funcionar y no sabes cuál, busca por bisección: quita la mitad de tu archivo, ejecuta `sudo sysctl --system` y prueba.

## Compruébalo con IbexWall

La pantalla Refuerzo enumera 26 ajustes de kernel, red, sistema de archivos y módulos, cada uno con lo que puede romper, y tú marcas los que quieres. El plugin de refuerzo del kernel (system.sysctl) lee cada valor, lo compara con la referencia y aplica tu elección mediante un plan. El plan muestra el archivo exacto, que IbexWall escribe como `/etc/sysctl.d/90-ibexwall.conf`, y la diferencia antes de que ocurra nada. Antes se crea una instantánea, y el Historial lo deshace. La versión 1.0 está en preparación.
