---
title: "Conecte um assistente de IA ao seu Linux, com segurança"
description: "O que é o MCP, o que um assistente de IA pode ler, planejar e propor pelo IbexWall (nunca aplicar), como chaves e presets o limitam e os riscos a conhecer."
slug: "connect-an-ai-assistant-to-your-computer-safely"
date: 2026-11-06
updated: 2026-11-06
tags: [mcp, ia, controle de acesso]
related_hardening: []
faq:
  - q: "O que é o MCP?"
    a: "O Model Context Protocol é um padrão para que um assistente de IA chame ferramentas oferecidas por um programa, como ler um status ou buscar um relatório."
  - q: "Um assistente de IA pode alterar o meu sistema pelo IbexWall?"
    a: "Não. Ele pode ler o status, explicar achados e propor uma alteração. Uma pessoa precisa aprovar a proposta, e o assistente não tem nenhuma ferramenta para aplicar, aprovar ou desfazer algo."
---

Você pode deixar um assistente de IA ler o status de segurança do seu computador e sugerir correções, sem deixar que ele mude nada. É assim que a conexão do assistente com o IbexWall foi construída: o assistente lê, planeja e propõe, e você decide. Não existe nenhuma ferramenta que o deixe aplicar uma alteração.

## O que é o MCP

O Model Context Protocol (MCP) é um padrão que permite a um assistente de IA chamar ferramentas oferecidas por outro programa. Um assistente de programação como o Claude Code, o OpenCode ou um editor com suporte a MCP inicia ou alcança um servidor MCP, aprende a lista de ferramentas e as chama quando precisa. Pense num cardápio: o servidor decide o que está nele.

O servidor MCP do IbexWall (`ibexwall-mcp`) roda como o seu usuário, não como root. Ele oferece nove ferramentas. Algumas leem: postura, achados, a explicação de um achado, eventos, quais apps se conectaram a onde, execução de uma verificação. Uma mostra o que um patch faria sem colocá-lo na fila (um teste a seco). Uma cria uma proposta.

## O que um assistente pode fazer

- Ler a sua pontuação de segurança e a lista de achados.
- Explicar um achado em palavras simples.
- Executar uma verificação e olhar os eventos recentes.
- Mostrar o que uma determinada alteração faria, como teste a seco.
- Criar uma proposta: um plano de alteração, esperando numa fila.

## O que ele não pode fazer

- Aplicar, aprovar, desfazer ou rejeitar qualquer coisa. Essas ferramentas não existem, e o sistema operacional reforça isso: o usuário com que o assistente roda não tem permissão do polkit para essas ações.
- Mudar as próprias permissões ou qualquer política.
- Ver contas do sistema, discos ou dispositivos gerenciados. Isso fica fechado para todo cliente.

Uma proposta aparece na tela do Assistente. Você vê as operações reais que a alteração faria, as palavras do próprio assistente numa citação marcada como escrita pela IA e não verificada, e o que pode quebrar. Você aprova ou rejeita. Se o plano mudou entre a proposta e a sua aprovação, a aprovação é recusada. Uma alteração aprovada passa pelo instantâneo de sempre, então o Histórico pode desfazê-la. Uma proposta que não pode ser desfeita é recusada no momento em que é criada.

## Presets e chaves

O acesso é escolhido entre presets: ler, planejar ou propor. Ler só vê o status e os achados. Planejar também pode fazer testes a seco. Propor também pode colocar uma proposta na fila. Um cliente que não é citado na configuração recebe apenas a postura e os achados, num ritmo baixo.

Um assistente no mesmo computador precisa que o seu usuário esteja no grupo `ibexwall-assistants`. Para um assistente em outra máquina, o IbexWall pode oferecer uma conexão por HTTPS com um token. Você cria o token no IbexWall, dá um nome, escolhe um preset e, se quiser, uma data de expiração. O segredo é mostrado uma vez, só um hash é guardado e o token não aparece em nenhum registro. Guarde-o numa variável de ambiente no cliente, não num arquivo que você envie ao repositório.

## Riscos a conhecer

Seja honesto consigo mesmo sobre eles.

- Tudo o que o preset permite é enviado ao modelo que você conecta. Valores privados são trocados por pseudônimos estáveis (nomes de usuário e de host, nomes de rede, endereços de hardware e privados; pastas pessoais viram `~`), mas a ocultação reduz o risco sem tornar privado um modelo remoto. Para a maior privacidade, use um modelo que rode na sua máquina.
- Um assistente pode ser enganado por texto que lê, como o nome de um processo ou uma linha de registro. O IbexWall marca texto externo como dado não confiável, e o desenho faz com que um assistente enganado, no pior caso, coloque na fila uma proposta que você pode rejeitar. Ele ainda pode dizer coisas enganosas a você, então leia por conta própria o que ele propõe.
- Um token roubado funciona até você apagá-lo ou ele expirar. Defina uma expiração e revogue os tokens que não usa mais.
- Cada chamada é gravada num registro no seu próprio diretório antes de ser executada, com cada linha encadeada à anterior para que edições sejam detectáveis. Mesmo assim, o mesmo usuário pode apagar o arquivo inteiro.

## Verifique com o IbexWall

Abra Conectar uma IA para configurar o acesso, ou execute `ibexctl mcp config claude-code` (também `opencode` e `vscode`) para obter o trecho a colar no seu assistente. O plugin de assistentes de IA (system.assistant) controla o que ele pode ler, planejar ou propor. Ligar ou desligar o acesso é um plano que você revisa, e o Histórico pode desfazê-lo. A versão 1.0 está em preparação. Comece sem acesso remoto e pense no que [a sua ferramenta envia para fora](/pt-br/articles/no-telemetry-in-a-security-tool/) antes de ampliar o acesso.
