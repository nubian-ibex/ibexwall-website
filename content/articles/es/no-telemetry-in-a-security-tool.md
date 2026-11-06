---
title: "Por qué una herramienta de seguridad no debe enviar nada"
description: "Una herramienta de seguridad ve tus puertos, apps y registros, así que nunca debería avisar a nadie. Qué envía IbexWall, que es nada, y cómo comprobarlo tú mismo."
slug: "no-telemetry-in-a-security-tool"
date: 2026-11-06
updated: 2026-11-06
tags: [privacidad, telemetría, confianza]
related_hardening: []
faq:
  - q: "¿IbexWall envía algún dato a sus autores?"
    a: "No. No hay telemetría, analíticas ni cuenta. El tráfico de red solo ocurre cuando lo pides, como una consulta DNS que haces tú o una actualización de paquetes que ejecutas."
  - q: "¿Cómo puedo comprobar que un programa no envía nada?"
    a: "Observa sus conexiones con ss o una captura de paquetes mientras funciona, o aplica una regla de cortafuegos que bloquee su tráfico de salida y comprueba que nada se rompe."
---

Una herramienta de seguridad lee cosas que la mayoría de los programas nunca ven: qué servicios escuchan en tu máquina, qué programas se conectan a dónde, qué cuentas existen, qué dicen tus registros. Si una herramienta así además informara a su casa, incluso de forma anónima e "inofensiva", sería un mapa de tu sistema saliendo por la puerta. Por eso la regla es sencilla: no debe enviar nada si no lo pides. IbexWall sigue esa regla. No tiene telemetría, analíticas ni cuentas, y no avisa a nadie de nada.

## Por qué importa más aquí

La telemetría de una aplicación común le dice a los autores qué botón se pulsa. En una herramienta de seguridad, el mismo canal llevaría datos como "este equipo tiene un puerto SSH abierto y un kernel antiguo". Unos datos así son útiles justo para la persona que no debería tenerlos. Anonimizarlos es difícil, porque los detalles de una máquina suelen ser lo bastante únicos para identificarte. El diseño seguro más simple es no recopilar.

También está la confianza. Una herramienta que pide root, lee el estado del sistema y aplica cambios tiene que ganársela. "Nada sale de la máquina" es una afirmación que puedes comprobar, y eso es mejor que una política de privacidad en la que tienes que creer.

## Qué envía IbexWall

Nada por su cuenta. Los casos en los que hay tráfico de red son los que provocas tú:

- Una consulta DNS que haces. Si usas la pantalla DNS seguro, el resolvedor reenvía tus consultas al servidor que elegiste, porque ese es su trabajo.
- Una actualización de paquetes que ejecutas con tu gestor de paquetes.
- Una conexión de asistente remoto, si la activas. El servidor MCP solo acepta conexiones por TLS y solo cuando activas la opción remota.
- Descargas que pides, como las listas de bloqueo del filtro DNS.

La comprobación de vulnerabilidades conocidas funciona sin conexión, desde la caché del propio gestor de paquetes. Para ella no se envía nada a ningún sitio.

## Cómo comprobarlo tú mismo

No deberías fiarte de nuestra palabra, y no hace falta. Hay tres formas.

Enumera las conexiones que tiene un programa ahora mismo:

```sh
sudo ss -tupn | grep -i ibex
```

Observa la interfaz de red real mientras lo usas (averigua su nombre con `ip -br link`):

```sh
sudo tcpdump -ni wlan0 -w ibex.pcap
```

Abre después el archivo con `tcpdump -nr ibex.pcap` o con Wireshark y busca destinos que no reconozcas. Recuerda que tus otros programas también hablan, así que filtra por la hora en que usaste IbexWall y por lo que hiciste.

La prueba más sólida es una regla. Crea una regla de cortafuegos que bloquee el tráfico de salida del usuario del programa o de toda la máquina, usa la herramienta y comprueba que sigue funcionando. Las funciones que por naturaleza necesitan la red, como un servidor DNS ascendente, dejarán de funcionar, claro.

La pantalla Aplicaciones y red de IbexWall muestra qué programa habla con dónde, así que también puede informar sobre sí misma y sobre todo lo demás en tu máquina.

## Qué preguntar de cualquier herramienta

Las mismas preguntas valen para cada programa que instales, sea de seguridad o no. ¿Necesita una cuenta? ¿Dice qué envía y cuándo? ¿Sigue funcionando con la red bloqueada? ¿Puedes leer el código fuente o al menos inspeccionar el tráfico? ¿Hay un interruptor de apagado que se respete? Una herramienta que no puede responder esto con claridad ya te ha dicho algo.

## Otra telemetría en tu sistema

Tu distribución y algunas de tus aplicaciones pueden enviar informes de uso. Es un asunto aparte de la herramienta de seguridad, y puede importarte o no. El plugin de telemetría (privacy.telemetry) enumera lo que encuentra para que decidas, y solo enumera. Para el hábito más amplio de comprobar, mira la [autocomprobación de diez minutos](/es/articles/how-secure-is-my-linux-computer/).

## Lo que no se va con ella

El código abierto ayuda aquí. El código está en GitHub bajo GPL-3.0-or-later, así que cualquiera puede leer cómo se usa el acceso a la red, y está previsto que las versiones incluyan sumas de verificación, firmas, un SBOM y una declaración de procedencia. La primera versión aún no se ha publicado.

## Compruébalo con IbexWall

Abre Aplicaciones y red para ver las conexiones de cada programa, y Plugins para leer qué puede leer y cambiar cada plugin. Cualquier cambio es un plan que revisas, con una instantánea y una forma de deshacerlo en el Historial. La versión 1.0 está en preparación.
