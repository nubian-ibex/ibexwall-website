---
title: "Conecta un asistente de IA a tu equipo Linux con seguridad"
description: "Qué es MCP, qué puede leer, planificar y proponer un asistente de IA con IbexWall (nunca aplicar), cómo lo limitan las claves y los perfiles, y los riesgos."
slug: "connect-an-ai-assistant-to-your-computer-safely"
date: 2026-11-06
updated: 2026-11-06
tags: [mcp, ia, control-de-acceso]
related_hardening: []
faq:
  - q: "¿Qué es MCP?"
    a: "El Model Context Protocol es una forma estándar de que un asistente de IA llame a las herramientas que ofrece un programa, como leer un estado u obtener un informe."
  - q: "¿Puede un asistente de IA cambiar mi sistema a través de IbexWall?"
    a: "No. Puede leer el estado, explicar los hallazgos y proponer un cambio. Una persona tiene que aprobar cada propuesta, y el asistente no tiene ninguna herramienta para aplicar, aprobar ni deshacer nada."
---

Puedes dejar que un asistente de IA lea el estado de seguridad de tu equipo y sugiera correcciones, sin dejar que cambie nada. Así está construida la conexión del asistente en IbexWall: el asistente lee, planifica y propone, y tú decides. No existe ninguna herramienta que le permita aplicar un cambio.

## Qué es MCP

El Model Context Protocol (MCP) es un estándar que permite a un asistente de IA llamar a las herramientas que ofrece otro programa. Un asistente de programación como Claude Code, OpenCode o un editor compatible con MCP inicia o alcanza un servidor MCP, conoce la lista de herramientas y las llama cuando las necesita. Piénsalo como un menú: el servidor decide qué hay en él.

El servidor MCP de IbexWall (`ibexwall-mcp`) se ejecuta como tu usuario, no como root. Ofrece nueve herramientas. Algunas leen: la postura, los hallazgos, la explicación de un hallazgo, los eventos, qué aplicaciones se conectaron a dónde, y ejecutar una comprobación. Una muestra qué haría un parche sin ponerlo en cola (una simulación). Una crea una propuesta.

## Qué puede hacer un asistente

- Leer tu puntuación de seguridad y la lista de hallazgos.
- Explicar un hallazgo con palabras claras.
- Ejecutar una comprobación y mirar los eventos recientes.
- Mostrar qué haría un cambio concreto, como simulación.
- Crear una propuesta: un plan para un cambio, a la espera en una cola.

## Qué no puede hacer

- Aplicar, aprobar, deshacer ni rechazar nada. Esas herramientas no existen, y el sistema operativo lo respalda: polkit no permite esas acciones al usuario con el que se ejecuta un asistente.
- Cambiar sus propios permisos ni ninguna política.
- Ver cuentas del sistema, discos ni dispositivos gestionados. Eso está cerrado para todos los clientes.

Una propuesta aparece en la pantalla Asistente. Ves las operaciones reales que haría el cambio, las palabras del propio asistente en una cita marcada como escrita por la IA y no comprobada, y lo que podría romperse. Tú apruebas o rechazas. Si el plan cambió entre la propuesta y tu aprobación, la aprobación se rechaza. Un cambio aprobado pasa por la instantánea habitual, así que el Historial puede deshacerlo. Una propuesta que no se puede deshacer se rechaza al crearla.

## Perfiles y claves

El acceso se elige entre perfiles: leer, planificar o proponer. Leer solo ve el estado y los hallazgos. Planificar también puede hacer simulaciones. Proponer también puede poner una propuesta en cola. Un cliente que no figura en la configuración obtiene solo la postura y los hallazgos, a un ritmo bajo.

Un asistente en el mismo equipo necesita que tu usuario esté en el grupo `ibexwall-assistants`. Para un asistente en otra máquina, IbexWall puede ofrecer una conexión por HTTPS con una clave. Creas la clave en IbexWall, le pones nombre, le das un perfil y, si quieres, una fecha de caducidad. El secreto se muestra una sola vez, solo se guarda un hash y la clave no aparece en ningún registro. Guárdala en una variable de entorno del cliente en lugar de en un archivo que subas a un repositorio.

## Riesgos que debes conocer

Sé sincero contigo mismo sobre esto.

- Todo lo que permita el perfil se envía al modelo que conectes. Los valores privados se sustituyen por seudónimos estables (nombres de usuario y de equipo, nombres de red, hardware y direcciones privadas; las carpetas personales pasan a ser `~`), pero ocultar datos reduce el riesgo sin volver privado a un modelo remoto. Para la máxima privacidad, usa un modelo que se ejecute en tu máquina.
- Un asistente puede ser engañado por el texto que lee, como el nombre de un proceso o una línea de registro. IbexWall marca el texto externo como datos no confiables, y el diseño hace que un asistente engañado, como mucho, ponga en cola una propuesta que puedes rechazar. Aun así, puede decirte cosas engañosas, así que lee tú mismo lo que propone.
- Una clave robada funciona hasta que la borras o caduca. Fija una caducidad y revoca las claves que ya no uses.
- Cada llamada se escribe en un registro en tu propio directorio antes de ejecutarse, con cada línea encadenada a la anterior para que se detecten las ediciones. Aun así, el mismo usuario puede borrar el archivo entero.

## Compruébalo con IbexWall

Abre Conectar una IA para configurar el acceso, o ejecuta `ibexctl mcp config claude-code` (también `opencode` y `vscode`) para obtener el fragmento que debes pegar en tu asistente. El plugin de asistentes de IA (system.assistant) controla qué puede leer, planificar o proponer. Activar o desactivar el acceso es un plan que revisas, y el Historial puede deshacerlo. La versión 1.0 está en preparación. Empieza sin acceso remoto y piensa en [lo que tu herramienta envía a algún sitio](/es/articles/no-telemetry-in-a-security-tool/) antes de ampliarlo.
