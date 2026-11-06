---
title: "Obter o IbexWall"
description: "O IbexWall 1.0 está em preparação. Veja como as versões serão publicadas e assinadas, como conferir um download e como compilar a partir do código-fonte hoje."
updated: 2026-11-06
---

O IbexWall 1.0 ainda não foi lançado. Esta página diz o que uma versão vai conter, como conferi-la e como compilar o programa por conta própria enquanto isso.

## O que uma versão contém

Cada versão é um conjunto de arquivos na [página de releases do GitHub](https://github.com/nubian-ibex/ibexwall/releases):

- pacotes para Fedora (RPM), Ubuntu e Debian (DEB) e Arch Linux;
- o código-fonte no commit marcado;
- somas de verificação, uma assinatura para cada arquivo, uma lista de materiais de software (SBOM) e uma declaração de procedência que descreve como os arquivos foram compilados.

Os pacotes são divididos para que você instale só o que precisa: `ibexwall` (o daemon, a linha de comando e os plugins), `ibexwall-desktop` (a janela, o ícone da bandeja e o agente de sessão), `ibexwall-mcp` (o servidor para assistentes de IA) e um pacote de confinamento para o seu sistema: `ibexwall-apparmor` no Debian e no Ubuntu, `ibexwall-selinux` no Fedora.

## Sistemas suportados

Fedora, Ubuntu 24.04 e 26.04, Debian e Arch Linux. Antes de ser publicada, cada versão é instalada, usada, atualizada, removida e purgada em uma máquina virtual de cada um deles.

## Confira o que você baixou

Baixe os arquivos da versão para uma mesma pasta e confira a assinatura da lista de somas de verificação, depois cada soma, depois cada assinatura:

```sh
git clone https://github.com/nubian-ibex/ibexwall
cd ibexwall
cargo xtask verify-release /path/to/the/folder /path/to/the/folder/ibexwall-release.pub
```

Os arquivos usam o formato minisign, então `minisign -V` também funciona em um único arquivo. A chave pública também é publicada na [página de segurança](/pt-br/security/); compare as duas antes de confiar numa assinatura. O [guia de versões](https://docs.ibexwall.com/reference/release-verification/) explica cada arquivo.

## Compile a partir do código-fonte

Você precisa da toolchain Rust indicada em `rust-toolchain.toml` e, para a janela, das ferramentas do Node.js e dos pacotes de desenvolvimento do WebKitGTK.

```sh
git clone https://github.com/nubian-ibex/ibexwall
cd ibexwall
cargo build --release --workspace
```

Experimente sem alterar o seu sistema: `scripts/dev-sandbox.sh` inicia o daemon e a janela em um isolamento que nunca toca nos seus arquivos, serviços ou firewall. O guia do desenvolvedor está em [docs.ibexwall.com](https://docs.ibexwall.com/contributing/).

## O que a instalação faz

A instalação cria os usuários e diretórios do sistema, ativa os sockets que iniciam o daemon e os plugins quando necessário, e os inicia. Ela não aplica nenhuma alteração de segurança: toda alteração continua sendo um plano que você revisa. Remover os pacotes desfaz o que o IbexWall mudou, por meio do instantâneo de cada alteração, e mantém os seus dados até você purgar.
