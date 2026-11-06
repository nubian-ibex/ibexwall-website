---
title: "¿Necesitas un cortafuegos en un escritorio Linux? Qué hace"
description: "Un escritorio Linux acepta todo por defecto. Mira qué escucha de verdad, cómo se relacionan nftables, ufw y firewalld, y las reglas de entrada frente a las de cada programa."
slug: "do-you-need-a-firewall-on-linux-desktop"
date: 2026-11-06
updated: 2026-11-06
tags: [cortafuegos, nftables, red]
related_hardening: [net.tcp-syncookies, net.source-routing]
faq:
  - q: "¿Necesito un cortafuegos en un escritorio Linux?"
    a: "Si nada escucha conexiones externas, un cortafuegos tiene poco que bloquear. Aun así conviene tenerlo como red de seguridad para servicios que instales más adelante y en redes de las que no te fíes."
  - q: "¿Son ufw, firewalld y nftables cortafuegos distintos?"
    a: "No. nftables es el filtro de paquetes del kernel. ufw y firewalld son herramientas que escriben reglas de nftables o iptables por ti con comandos más sencillos."
---

Un escritorio Linux no necesita un cortafuegos para ser usable, y muchos funcionan sin uno. Pero es una red de seguridad barata: si un programa empieza a escuchar en un puerto más adelante, ya sea por un paquete que instalas, un servidor de desarrollo que olvidas o un servicio que activa una distribución, un cortafuegos decide si la red puede llegar hasta él. La pregunta más útil es qué está escuchando ahora mismo.

## Permitir todo por defecto, en palabras claras

El kernel de Linux no filtra nada hasta que se añaden reglas. Fedora Workstation trae firewalld activado. Ubuntu trae ufw, pero lo deja apagado. Debian y Arch no instalan ningún cortafuegos por defecto. Así que en un Debian o un Arch recién instalados, todo puerto que abre un programa es accesible desde tu red.

Es menos alarmante de lo que suena, porque un escritorio recién instalado abre muy pocos. Además, los routers domésticos bloquean el tráfico no solicitado que viene de internet. El riesgo es la red local: una cafetería, un hotel, un piso compartido, una oficina.

## Mira qué escucha

```sh
sudo ss -tulpn
```

Las columnas que importan son la dirección local y el programa. `127.0.0.1` significa que solo este equipo puede conectarse. `0.0.0.0` o `[::]` significa cualquier máquina que pueda alcanzarte. Entradas normales y legítimas en un escritorio son el stub DNS local, el servicio mDNS (Avahi, UDP 5353) y el servicio de impresión (CUPS, que normalmente está en loopback). Todo lo que no reconozcas merece una mirada.

También puedes probar desde fuera con `nmap` en otra máquina, que muestra lo que la red ve de verdad y no lo que el equipo cree que ofrece.

## nftables, ufw y firewalld

Son tres capas, no tres rivales.

- nftables es el motor de filtrado del kernel, y `nft` es su comando.
- ufw ("uncomplicated firewall") es una interfaz sencilla, habitual en Ubuntu. Uso típico: `sudo ufw enable` y `sudo ufw allow 22/tcp`.
- firewalld es una interfaz construida en torno a zonas como `public` y `home`, usada por Fedora. Uso típico: `sudo firewall-cmd --list-all`.

Elige la que tu distribución ya usa. Ejecutar dos interfaces que gestionan reglas lleva a resultados confusos. Para leer lo que esté activo, `sudo nft list ruleset` siempre funciona, porque toda interfaz acaba allí o en la capa antigua de iptables que hoy suele apoyarse en nftables.

## Entrada frente a salida

Una regla de entrada decide quién puede iniciar una conexión contigo. Para un escritorio, lo sensato es rechazar el tráfico de entrada no solicitado y permitir las respuestas a las conexiones que iniciaste tú. Las tres herramientas lo hacen de fábrica cuando están activadas.

Filtrar la salida es otro trabajo. Las herramientas clásicas filtran por dirección y puerto, no por programa, así que no pueden decir "Firefox puede conectarse, este binario desconocido no". El control de salida por programa necesita que el kernel diga al filtro qué proceso es el dueño de una conexión, y eso es lo que hacen las herramientas basadas en eBPF. Sirve para notar un programa que habla con un servidor que no esperabas. También da más trabajo en el día a día, porque respondes una pregunta la primera vez que cada programa se conecta.

## Cuándo importa más

Tres situaciones aumentan el valor de un cortafuegos. Usas a menudo redes públicas o compartidas. Ejecutas servidores de desarrollo, bases de datos o recursos compartidos que escuchan en todas las direcciones por defecto, y los olvidas. O compartes el equipo con otras personas, donde una instalación descuidada puede abrir un puerto para todos. Si nada de esto aplica y `ss` no muestra nada fuera de loopback, el cortafuegos es un cinturón de seguridad que rara vez usas. Mantenerlo activado cuesta muy poco.

## Una configuración razonable

1. Usa la interfaz que trae tu distribución y actívala.
2. Mantén la opción por defecto de rechazar las conexiones de entrada no solicitadas.
3. Abre un puerto solo cuando puedas nombrar el servicio y el motivo.
4. Vuelve a mirar `ss -tulpn` después de instalar software de servidor.
5. Si quieres ver el comportamiento de salida, añade una supervisión por programa en lugar de escribir reglas a mano.

En un portátil que cambia de red, las zonas o los perfiles ayudan: la zona `public` de firewalld es estricta y `home` es más laxa.

## Compruébalo con IbexWall

La pantalla Cortafuegos enumera las reglas de entrada y trabaja a través del cortafuegos que tu sistema ya usa, y la pantalla Aplicaciones y red muestra qué programa habla con dónde y pregunta la primera vez que un programa se conecta. IbexWall guarda sus propias reglas en `table inet ibexwall` y nunca edita las de tu distribución. Cada cambio es un plan que revisas, con una instantánea que puedes deshacer desde el Historial, y una regla que podría cortar tu conexión espera tu confirmación. La versión 1.0 está en preparación. Para ver el panorama general, empieza con la [autocomprobación de diez minutos](/es/articles/how-secure-is-my-linux-computer/).
