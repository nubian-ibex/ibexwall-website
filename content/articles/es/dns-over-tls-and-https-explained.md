---
title: "DNS sobre TLS y sobre HTTPS explicados, y cómo comprobarlos"
description: "El DNS normal muestra a tu red cada sitio que visitas. Qué cambian DoT y DoH, cómo elegir un resolvedor, el problema de los portales cautivos y cómo probar el tuyo."
slug: "dns-over-tls-and-https-explained"
date: 2026-11-06
updated: 2026-11-06
tags: [dns, privacidad, cifrado]
related_hardening: []
faq:
  - q: "¿Cuál es la diferencia entre DNS sobre TLS y DNS sobre HTTPS?"
    a: "Ambos cifran la consulta. DoT usa su propio puerto, el 853, así que una red puede ver que lo usas. DoH viaja por el puerto 443 como el tráfico web normal, lo que lo hace más difícil de distinguir o de bloquear."
  - q: "¿El DNS cifrado oculta los sitios que visito?"
    a: "Oculta la consulta a tu red, pero no al resolvedor que elegiste, y la conexión con el sitio sigue mostrando su dirección y, a menudo, su nombre."
---

Cada vez que abres un sitio, tu equipo pregunta primero a un resolvedor DNS por su dirección. Por defecto, esa pregunta viaja como texto plano por el puerto 53, así que quien administra tu Wi-Fi, tu proveedor de internet y cualquiera en el camino puede leer qué nombres consultas y alterar las respuestas. DNS sobre TLS (DoT) y DNS sobre HTTPS (DoH) envuelven esa misma pregunta en cifrado.

## Lo que revela el DNS normal

Una consulta por `example.org` le dice a quien escucha que vas a visitar `example.org`, aunque la página en sí esté cifrada. Una red hostil también puede responder con una dirección falsa, que es como algunas páginas cautivas y algunos ataques te redirigen. El cifrado resuelve la escucha y, como el resolvedor se autentica con su certificado, también la manipulación en el camino.

No te vuelve anónimo. El resolvedor que elijas ve cada nombre que pides, así que trasladas la confianza de tu red a esa empresa. Y cuando te conectas al sitio, su dirección es visible, y a menudo el nombre también.

## DoT frente a DoH

- DoT envía los mensajes DNS dentro de TLS por el puerto TCP 853. Es sencillo, y el operador de una red puede ver que lo usas y bloquear el puerto.
- DoH envía los mensajes DNS como peticiones HTTPS por el puerto 443. Se mezcla con el tráfico web, así que es más difícil de bloquear, y algunos navegadores incluyen su propio cliente DoH que esquiva el resolvedor del sistema.

Para todo el sistema, DoT suele ser la opción más fácil, porque un servicio resolvedor puede usarlo para todos los programas. DoH dentro de un solo navegador protege solo a ese navegador, y puede saltarse una lista de bloqueo local o una configuración de DNS dividido en la que confías.

## Elegir un resolvedor

Entre los resolvedores públicos conocidos con puntos de acceso cifrados están Cloudflare (`1.1.1.1`, nombre `one.one.one.one`) y Quad9 (`9.9.9.9`, nombre `dns.quad9.net`). Quad9 filtra por defecto los dominios maliciosos conocidos; el servicio normal de Cloudflare no. Su documentación describe sus políticas de registro y privacidad, y deberías leerla antes de decidir. El resolvedor de tu proveedor es otra opción, con el inconveniente de que es justo la parte de la que querías protegerte. Un resolvedor que administras tú ofrece el mayor control y el mayor mantenimiento.

## Actívalo con systemd-resolved

Fedora y Ubuntu usan systemd-resolved por defecto. Debian y Arch lo tienen disponible, pero no necesariamente activo. Si es el tuyo, crea un drop-in:

```ini
# /etc/systemd/resolved.conf.d/dot.conf
[Resolve]
DNS=9.9.9.9#dns.quad9.net 149.112.112.112#dns.quad9.net
DNSOverTLS=yes
```

Después ejecuta `sudo systemctl restart systemd-resolved`. Con `DNSOverTLS=yes`, las consultas fallan si no se puede llegar al servidor por TLS. El valor `opportunistic` prueba TLS y recurre al DNS normal, lo que te mantiene en línea pero permite a un atacante forzar la degradación.

## El problema de los portales cautivos

El Wi-Fi de hoteles y cafeterías suele interceptar tu primera petición web para mostrar una página de acceso. El DNS cifrado estricto puede romper eso, porque el portal espera responder consultas normales antes de que inicies sesión. Síntomas típicos: estás conectado al Wi-Fi y no se abre ninguna página. Salidas habituales: iniciar sesión con el modo `opportunistic`, abrir directamente la dirección del portal o desactivar el modo estricto durante esa sesión y volver a activarlo después.

## Comprueba qué hace el tuyo

```sh
resolvectl status
```

Busca `DNS Servers` y `+DNSOverTLS` en la línea de protocolo de la interfaz o de la sección global. Para ver si el DNS sin cifrar sigue saliendo del equipo, observa el puerto 53 en tu interfaz de red real (averigua su nombre con `ip -br link`, por ejemplo `wlan0` o `enp3s0`) mientras navegas:

```sh
sudo tcpdump -ni wlan0 port 53
```

No uses `-i any`: los programas hablan con el resolvedor stub local en la interfaz de loopback, y ese tráfico aparecería y parecería una fuga. Si no ves nada en la interfaz real mientras cargan las páginas, las consultas no salen en claro. También puedes ejecutar `resolvectl query example.org` y comprobar qué servidor respondió. Si usas una VPN, sus ajustes de DNS pueden anular los tuyos para algunos nombres, así que prueba con ella activada y desactivada.

## Compruébalo con IbexWall

La pantalla DNS seguro, respaldada por el plugin net.dns, cifra las consultas, bloquea rastreadores y dominios de malware, e impide que los navegadores la eludan. Reconoce un dnscrypt-proxy existente en lugar de pelearse con él. Los cambios son un plan que revisas y deshaces desde el Historial, y un cambio de DNS que podría dejarte sin conexión espera tu confirmación. La versión 1.0 está en preparación. Si un portal cautivo se interpone, IbexWall puede decirte que detectó uno, pero el inicio de sesión lo haces tú.
