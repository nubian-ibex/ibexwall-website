---
title: "Cómo deshacer un cambio de seguridad en Linux y salir de un bloqueo"
description: "Haz una instantánea antes de cada cambio, revierte desde el Historial, entiende por qué los cambios de red esperan confirmación y recupera el acceso tras un bloqueo."
slug: "undo-a-security-change"
date: 2026-11-06
updated: 2026-11-06
tags: [reversión, recuperación, seguridad]
related_hardening: [kernel.kexec, net.rp-filter]
faq:
  - q: "¿Cómo deshago un cambio de cortafuegos o de DNS que rompió mi red?"
    a: "Desde un terminal o consola local, enumera los cambios recientes y revierte el último. Si lo hiciste con IbexWall y no lo confirmaste a tiempo, se revierte solo."
  - q: "¿Y si me quedo sin acceso a una máquina remota?"
    a: "Un cambio que podría cortar la red espera confirmación y se revierte si no la das. Con otras herramientas, usa la consola del proveedor o un arranque de recuperación para quitar la regla."
---

La mejor protección contra un mal cambio es poder echarlo atrás. Antes de editar un cortafuegos, un ajuste de DNS o un parámetro del kernel, guarda lo que hay ahora, cambia una sola cosa, pruébala y conserva un camino de vuelta que no dependa de lo que estás cambiando. Este artículo cuenta ese hábito y cómo lo hace IbexWall por ti.

## Por qué primero una instantánea

La mayoría de los cambios de seguridad son pequeñas ediciones de archivos: una línea en `/etc/sysctl.d`, un drop-in para SSH, un conjunto de reglas de nftables. Si antes copias el archivo antiguo, deshacer es copiarlo de vuelta. Cuando el cambio toca varias cosas a la vez, un error en una hace difícil recordar cómo estaban las otras.

A mano, lo mínimo es:

```sh
sudo cp -a /etc/ssh/sshd_config.d /root/sshd_config.d.bak
```

Edita, prueba y solo entonces cierra tu sesión anterior. Para los cambios de cortafuegos, el orden seguro es abrir un segundo terminal, aplicar la regla, comprobar que aún puedes conectarte con una conexión nueva y mantener abierto el primer terminal hasta entonces.

## Cambios que pueden dejarte fuera

Algunos cambios te quitan el camino por el que llegaste a la máquina: una regla de cortafuegos que bloquea el puerto SSH, un ajuste de DNS que apunta a un resolvedor al que no llegas, un kill switch de VPN, una regla que aísla el equipo. El peligro no es el cambio, es que no puedes arreglarlo desde donde estás.

IbexWall los trata de otra forma. Un cambio marcado como riesgo de red espera a que lo confirmes, por defecto en 60 segundos. Si no lo confirmas, porque perdiste la conexión o la página dejó de responder, se revierte solo. Ese es el punto: deshacerlo no te necesita. Si el propio demonio se detiene a medias, cuando vuelve a arrancar revierte un cambio que se estaba aplicando o esperaba confirmación.

Confirmas desde la interfaz o en la línea de comandos:

```sh
ibexctl confirm <transaction-id>
```

## Deshacer desde el Historial

Cada cambio que aplica IbexWall crea antes una instantánea. La pantalla Historial los enumera todos, y deshacer uno restaura lo que había. Lo mismo desde un terminal:

```sh
ibexctl history
ibexctl rollback <transaction-id>
```

Algunos cambios no son totalmente reversibles, e IbexWall lo dice antes de que los apliques. Por ejemplo, [prohibir que se cargue otro kernel](/es/hardening/kernel.kexec/) no se puede deshacer hasta el próximo reinicio. Otros pueden romper una configuración concreta, como [descartar paquetes con una dirección de origen falsificada](/es/hardening/net.rp-filter/), que puede no encajar con algunas VPN y equipos con varias rutas. El plan muestra estas advertencias primero.

## Recuperarte cuando te quedas fuera

Si usaste otras herramientas, o la reversión automática no ayudó, trabaja desde el lugar más cercano donde todavía tengas control.

1. Máquina local: cambia a una consola de texto con Ctrl+Alt+F3, o usa el escritorio con la red apagada. No necesitas la red para ejecutar un comando local.
2. Servidor virtual: usa la consola web del proveedor, que no pasa por la red que rompiste.
3. Elimina la causa. Para las reglas de cortafuegos de IbexWall, `ibexctl rollback` es el camino. Como último recurso, se puede borrar su tabla, porque es una tabla aparte que solo contiene sus propias reglas: `sudo nft delete table inet ibexwall`. No borres tablas que no creaste.
4. Para un archivo de sysctl, quítalo de `/etc/sysctl.d/` y pon el valor anterior con `sysctl -w`.
5. Si nada arranca, inicia un sistema live o la entrada de recuperación, monta el sistema de archivos raíz y restaura tu copia del archivo.

Después, averigua por qué falló antes de intentarlo de nuevo. A menudo fue un detalle inesperado, como una segunda interfaz de red.

## Lleva un registro

Una regla práctica que sirve para personas y para herramientas: anota qué cambiaste, por qué y cómo revertirlo. El Historial de IbexWall lo guarda, y cada entrada se escribe en un registro de auditoría cuyas líneas están encadenadas para que se puedan detectar las ediciones de líneas antiguas (`ibexctl audit verify`).

## Compruébalo con IbexWall

La pantalla Historial enumera los cambios y los deshace, y `ibexctl history` y `ibexctl rollback` hacen lo mismo desde un terminal. Cada cambio es un plan que revisas primero, con una instantánea que puedes restaurar, y los cambios con riesgo de red esperan tu confirmación o vuelven atrás solos. El modo de emergencia (endpoint.isolate), que corta la red salvo las direcciones que indiques, también se deshace desde el Historial. La versión 1.0 está en preparación.
