---
title: "Firewalls de Linux: netfilter, nftables, firewalld y ufw"
description: "Todo firewall de Linux se asienta sobre el mismo marco del kernel, netfilter. Qué son iptables, nftables, firewalld y ufw, en qué difieren sus interfaces, y qué comparten."
slug: "linux-firewalls-netfilter-nftables-firewalld-ufw"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, netfilter, nftables, firewalld, ufw]
related_hardening: []
---

Pregunta qué firewall usa Linux y la respuesta cambia por distribución: firewalld en Fedora, ufw en Ubuntu, nftables puro en otros sitios. Por debajo, todos son lo mismo. Este artículo separa las capas.

## El punto en común: netfilter

Netfilter es el marco de filtrado de paquetes dentro del kernel de Linux. Todo firewall en Linux es una interfaz que escribe reglas en netfilter. Ese es el único punto que todos comparten: sea cual sea la herramienta, la decisión ocurre en los mismos ganchos del kernel, para cada paquete que pasa.

## La capa de comando

- iptables es la herramienta de espacio de usuario antigua. Es anterior al marco actual y está en modo mantenimiento en la mayoría de las distribuciones.
- nftables es su sustituto moderno. Une lo que antes eran varias herramientas (IPv4, IPv6, ARP, bridging) en una sola, con un único comando `nft` y una sola sintaxis de reglas.

La mayoría de la gente no escribe reglas de iptables o nftables a mano. Usa una interfaz, y es ahí donde las interfaces divergen.

## Las interfaces y sus UIs

- firewalld es el demonio en Fedora, RHEL y openSUSE. Piensa en zonas (casa, público, trabajo) y servicios, y aplica cambios en tiempo de ejecución sin tirar conexiones existentes. Sus interfaces son `firewall-cmd` en la línea de comandos y el gráfico `firewall-config`.
- ufw, el Uncomplicated Firewall, es el predeterminado en Debian y Ubuntu. Es una capa fina sobre iptables o nftables con una sintaxis mucho más simple: `ufw allow 22/tcp`, `ufw enable`. Su interfaz gráfica es `gufw`.
- nftables puro es la elección en Arch y en contenedores, donde la distribución no impone una interfaz y el administrador escribe la tabla directamente.

O sea, los "firewalls distintos" son, en su mayoría, interfaces distintas sobre un mismo motor. La confusión es real porque la sintaxis, los archivos de configuración y el modelo mental difieren, pero la propiedad de seguridad, un paquete es permitido o descartado por una regla de netfilter, es idéntica.

## Qué tienen las UIs en común

Toda interfaz de firewall, gráfica o no, responde las mismas tres preguntas: qué puede entrar, qué puede salir, y está activo. firewalld pregunta por zona y servicio; ufw pregunta como una lista de reglas de permiso; una tabla nftables pura pregunta como cadenas de reglas. Todas comparten también el mismo modo de fallo: un error de regla puede dejarte fuera de una máquina remota, porque el firewall hace exactamente lo que se le ordenó.

## Qué añade IbexWall

IbexWall trabaja a través de lo que ya existe. En una máquina con firewalld o ufw, conduce esa interfaz y deja intactas las reglas de la propia distribución; en una máquina sin ninguno, gestiona su propia tabla nftables `inet ibexwall`. En ambos casos, solo escribe en su propia tabla, nunca en la tabla de otro programa.

Dos cosas cambian para la persona:

- Revisar antes de aplicar. Ves las reglas exactas que un cambio añadirá, qué afectarán y qué puede romper, antes de que se escriba nada. Un cambio que podría cortar tu red espera tu confirmación.
- Control por programa. Encima del firewall, IbexWall usa eBPF para decidir qué programas pueden alcanzar la red, y pregunta la primera vez que uno nuevo lo intenta.

El firewall sigue siendo el mismo netfilter de siempre. Lo que IbexWall cambia es que se convierte en un plan que revisas y puedes deshacer, en lugar de un comando que ejecutas y esperas.
