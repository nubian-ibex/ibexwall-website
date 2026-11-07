---
title: "Cómo funciona el firewall de IbexWall: nftables más control por programa"
description: "IbexWall usa dos capas: nftables para las reglas de entrada y eBPF para decidir qué programas pueden alcanzar la red. Cómo encajan, y cómo un cambio sigue siendo revisable."
slug: "how-ibexwall-firewall-works"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, eBPF, nftables, por-aplicación]
related_hardening: []
---

Un firewall responde dos preguntas distintas: qué puede llegar a esta máquina desde fuera, y qué puede salir de ella. La mayoría de los firewalls de Linux solo responden la primera. IbexWall responde las dos con dos capas, y convierte cada cambio en un plan que revisas antes.

## Capa uno: entrada, a través de la distribución

Para el tráfico de entrada, IbexWall no reemplaza tu firewall. En una máquina con firewalld o ufw conduce esa interfaz; en una máquina sin ninguno de los dos gestiona su propia tabla nftables `inet ibexwall`. En ambos casos solo escribe en su propia tabla, nunca en la tabla de otro programa.

Lo primero que se habilita es negar-entrada por defecto: nada puede escuchar conexiones nuevas salvo que lo hayas abierto. A partir de ahí, la pantalla de firewall muestra qué es alcanzable, qué abriste, y deja cerrarlo. Un cambio es un plan que lista las reglas exactas, y el Historial puede devolverlas.

## Capa dos: salida, por programa

La segunda pregunta, qué puede salir de la máquina, es donde vive el control de verdad. IbexWall carga un pequeño programa eBPF que observa cada conexión que un programa intenta abrir. La primera vez que un programa nuevo alcanza la red, IbexWall pregunta: permitir, bloquear o permitir siempre. Tu respuesta se recuerda por programa y por destino.

Esto es más fuerte que un firewall por puerto, que solo ve puertos. Un navegador y un keylogger usan ambos HTTPS en el puerto 443; el puerto no los distingue. La capa por programa sí, y funciona sobre TCP, UDP y QUIC.

## Modo Preguntar y la válvula de seguridad

Un programa sobre el que aún no has decidido puede quedarse en modo Preguntar: su primera conexión espera hasta que respondas, y las conexiones retenidas más antiguas aparecen primero. Un cambio que podría cortar tu propio acceso a la red se marca como arriesgado y espera tu confirmación; si no confirmas a tiempo, se deshace solo.

## Por qué esto sigue siendo revisable

Cada cambio de firewall, de entrada o por programa, pasa por el mismo motor que cualquier otro cambio en IbexWall: un plan muestra las operaciones, se toma una instantánea y el Historial puede revertir. Un firewall solo es tan bueno como la confianza que tienes en él, y la confianza viene de poder ver y deshacer cada regla.
