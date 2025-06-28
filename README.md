# IFTAI - IFTTT for AI automations

## Overview

IFTAI is a workflow automation system built with Next.Js and HeroUI that enables users to create, manage, and execute automated AI-based workflows. The system supports various triggers, OpenAI models, and actions to be chained and executed.

Unlike LangChain or other similar systems that are agent-oriented and code-based, IFTAI takes a different approach. By  giving a visual WSIWYG-like editor like IFTTT, users can set up automations far easier than LangChain. With the ability to have models in the chain, dynamic inputs are parsed and evaluated much easier and safer than trying to accomodate for every possible input. 

## Getting Started

To get started, you'll need

- Node.js 18+
- npm, yarn, pnpm, or bun
- A browser, of course.

### Setup

1. Clone the repo:
```bash
git clone https://github.com/jleuth/IFTAI.git
```
2. Install deps:
```bash
npm i
```
3. Run the server:
```bash
npm run dev
```

That's it! Open up http://localhost:3000 in your browser to make your first workflow.


## Features

### Dashboard
The main dashboard lists out all your workflows, and their aspects. From here, you can edit, create, and view workflows, along with changing your settings.

### Workflow Creator
The workflow creator makes creating automations puts powerful automation chains in the palm of your hand. All you need to do is name the workflow, pick a trigger, pick a model, and the actions that will be taken!

### Settings Page
All your environment variables, like safety flags and API keys, live in here. You can quickly update then without needing to log into your server and go to war over the editor to use *(fight over vim vs. nano vs. emacs in the issues, I dare you.)* to change your shiz.

### Action Types

 1. Call to AI
    - Makes a call to the model of your choice with your provided instructions
    - For the devs, this uses the OpenAI Responses API

2. Send a Telegram message
    - If you set up a Telegram bot, you can use this to have your workflow communicate to you
    - Chain this up with `Call to AI` to get AI-powered messages.
    - Useful for summaries or error messages

3. Send an HTTP request
    - Specify a method, URL, body, and optionally headers to make a request to any endpoint on the internet!
    - Useful for interacting with external APIs
    - Useful for custom messaging methods other than Telegram

4. Wait for a specific amount of time
    - Does what it says on the tin
    - Great at preventine race conditions

You can chain an *effectively* infinite amount of actions together.

### Workflow Executor
On the backend, the workflow executor gets invoked on a trigger activation, like a webhook. It executes your workflow through sequentially going through each step. 

Inputs and outputs of each action (or step) are intelligently chained with the next, to give the model, or any action, context of the past steps and input (if there was one).

### API
Because the frontend just talks to the backend with a bog-standard CRUD API, you're free to integrate IFTAI with anything you like. 

#### Create a workflow
```http
POST /api/createworkflow
Content-Type: application/json

{
    "name": "string",
    "description": "string",
    "trigger": "webhook|cron|whatever",
    "model": "string of a real OpenAI model identifier (e.g. o4-mini)",
    "actions": [
        {
            "id": number,
            "action": "string",
            "label": "string"

        }
    ]
}
```

#### Run a workflow
```http
POST /api/webhook/[id of workflow]?input=your input here
Content-Type: application/json
```
(yes that's literally it)

### Environment variables

You can update them all in settings, just make sure to make a `.env.local` in the root directory before you do.
