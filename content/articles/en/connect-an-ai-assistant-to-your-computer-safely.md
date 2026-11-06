---
title: "Connect an AI assistant to your Linux computer, safely"
description: "What MCP is, what an AI assistant can read, plan and propose through IbexWall (never apply), how keys and presets limit it, and the risks to know first."
slug: "connect-an-ai-assistant-to-your-computer-safely"
date: 2026-11-06
updated: 2026-11-06
tags: [mcp, ai, access-control]
related_hardening: []
faq:
  - q: "What is MCP?"
    a: "The Model Context Protocol is a standard way for an AI assistant to call tools that a program offers, such as reading a status or fetching a report."
  - q: "Can an AI assistant change my system through IbexWall?"
    a: "No. It can read the status, explain findings and propose a change. A person has to approve a proposal, and the assistant has no tool to apply, approve or undo anything."
---

You can let an AI assistant read your computer's security status and suggest fixes, without letting it change anything. That is how IbexWall's assistant connection is built: the assistant reads, plans and proposes, and you decide. No tool exists that lets it apply a change.

## What MCP is

The Model Context Protocol (MCP) is a standard that lets an AI assistant call tools offered by another program. A coding assistant such as Claude Code, OpenCode or an editor with MCP support starts or reaches an MCP server, learns the list of tools, and calls them when it needs to. Think of it as a menu: the server decides what is on it.

The IbexWall MCP server (`ibexwall-mcp`) runs as your user, not as root. It offers nine tools. Some read: posture, findings, an explanation of a finding, events, which apps connected where, running a check. One shows what a patch would do without queuing it (a dry run). One creates a proposal.

## What an assistant can do

- Read your security score and the list of findings.
- Explain a finding in plain words.
- Run a check and look at recent events.
- Show what a given change would do, as a dry run.
- Create a proposal: a plan for a change, waiting in a queue.

## What it cannot do

- Apply, approve, undo or reject anything. These tools do not exist, and the operating system backs this up: the user an assistant runs as is not allowed those actions by polkit.
- Change its own permissions or any policy.
- See system accounts, disks or managed devices. Those are closed to every client.

A proposal appears on the Assistant screen. You see the real operations the change would perform, the assistant's own words in a quote marked as written by the AI and not checked, and what could break. You approve or reject. If the plan changed between the proposal and your approval, the approval is refused. An approved change goes through the usual snapshot, so History can undo it. A proposal that cannot be undone is refused when it is created.

## Presets and keys

Access is chosen from presets: read, plan, or propose. Read only sees the status and findings. Plan can also run dry runs. Propose can also queue a proposal. A client that is not named in the configuration gets only the posture and findings, at a low rate.

An assistant on the same computer needs your user to be in the `ibexwall-assistants` group. For an assistant on another machine, IbexWall can offer a connection over HTTPS with a token. You create the token in IbexWall, name it, give it a preset, and optionally an expiry date. The secret is shown once, only a hash is stored, and the token appears in no log. Keep it in an environment variable on the client rather than in a file you commit.

## Risks to know

Be honest with yourself about these.

- Whatever the preset allows is sent to the model you connect. Private values are replaced with stable pseudonyms (user and host names, network names, hardware and private addresses; home folders become `~`), but redaction lowers the risk without making a remote model private. For the strongest privacy, use a model that runs on your machine.
- An assistant can be misled by text it reads, such as a process name or a log line. IbexWall marks external text as untrusted data, and the design means a misled assistant can at worst queue a proposal you can reject. It can still say misleading things to you, so read what it proposes yourself.
- A stolen token works until you delete it or it expires. Set an expiry and revoke tokens you no longer use.
- Every call is written to a log in your own directory before it runs, with each line chained to the previous one so edits are detectable. The same user can delete the whole file, though.

## Check it with IbexWall

Open Connect an AI to set up access, or run `ibexctl mcp config claude-code` (also `opencode` and `vscode`) to get the snippet to paste into your assistant. The AI assistants plugin (system.assistant) controls what it may read, plan or propose. Turning access on or off is a plan you review, and History can undo it. Version 1.0 is in preparation. Start without remote access, and think about what [your tool sends anywhere](/articles/no-telemetry-in-a-security-tool/) before you widen it.
