`v0.0.1`

# Do you like [Vibe-coding](https://x.com/karpathy/status/1886192184808149383)? This is more like Oscillatory Resonance-Oriented Sinewave Programming.
> (basically, vibe-coding with structural intent)

>>if you prefer learning about Cond8 through your preferred LLM Chat? Then press the button on the left to copy the **Cond8-Introduction prompt** to your clipboard. [button](/prompts?section=cond8-introduction)

## What is it really?
Cond8 is, at its core, a **procedural function execution framework** designed to structure logic clearly and intuitively. With Cond8, you describe **human-readable** [Actor Prompts](docs/section=actor-prompts) in simple, declarative [Director Pages](/docs?section=director-pages), and let Cond8 handle structured, predictable development.

> There are a lot of links in the introduction and a lot of Cond8 specific terms. You don't have to click on each link to learn more. I've written the first couple of pages in a way that it will cover everything that you need to know about Cond8.

## Why?
Because I wanted a coding assistant that made writing large codebases easier and more structured without making it feel like a chore. Ideally, the coding assistant would run locally on my own hardware without heavy resources.
> Minimum hardware requirement for local DSLM execution: Mac M1 or equivalent.


## How?
By **strategically limiting scope** and ordering code in a way that ensures the [DSLM](/docs?section=dslm) has the correct context for token prediction. Small Language Models (SLMs) can then write code predictably and effectively, ensuring consistency. Unlike *traditional* vibe-coding, which deals with free-form code while *embracing exponentials*...(uhu), Cond8 **introduces structured** constraints to maintain clarity and intent.

---

## **Again why? (The Real Story)**
I was waiting for the JavaScript's **[pipeline operator](https://github.com/tc39/proposal-pipeline-operator)**.

I got impatient. So, I made my own pipe function.

Then that turned into an Express wrapper.

Then, while building a centralized error catcher, I realized...

I was actually making an automated bug-fixing prompt for ChatGPT.

Then it got out of hand.

So I went to Disneyland and back as one should.

Then I completely restarted as Cond8.

Then everything **magically clicked into place**—and now we’re here...

...still waiting for the pipeline operator.

## **What are you talking about?**
🦍 Cond8 let Small Language Models (~3B) brute-force its way to passing tests 🦍
🦍 Cond8 wants AI that can run on laptops to be effective software developers 🦍

---
---


## DSLM?
A **Domain-Specific Language Model (DSLM)** is a code completer—small or large—customized or constrained for specific domain tasks. It doesn't necessarily need to be a specialized, fine-tuned model that you can [download here](/dslm); a general-purpose model like ChatGPT can function as a DSLM when guided by crafted [prompts](/prompts) that enforce domain-specific constraints. A general-purpose code completer like GitHub Copilot can be a DSLM if it understands the code patterns and start producing the right code. <span style="opacity: 0.6;">It's whatever...</span>

### What about prompting?
Cond8 gives developers full control over prompt composition using the [Prompt Composer](/docs?section=prompt-builder). During auto-development, each [Actor](/docs?section=actor) generates its own [Metadata](/docs?section=metadata)-driven prompts. The [Recorder](/docs?section=recorder) collects all metadata, tracking Conduit changes and Actor execution details. This data forms an unstructured treasure trove, enabling the automatic generation of dynamic, proactive prompts.

If you do not use the Prompt Composer. Cond8 will simply put all the metadata in the prompt, in the order of recording, completely unstructured nor composed. Surprisingly—for small scenes, this works quite well. However, for larger scenes, you might hit the context limit, so then you will have to use the Prompt Composer to refine the prompts.

> **Having a bug?**<br/>**Note:** A **DSLM** is not a chat assistant—it is a code completer. Your prompt should always end with the start of your code so the completer can generate the rest.

### DSLM Sizes:
- Small: For Laptops
- Medium: For medium/high-end consumer-grade GPUs
- Large: For the cloud

### No DSLM?
Take a look at the [Home Domain](/domains?section=home) that makes Cond8 into a full web development stack (with Express, Kysely and htmx), or make a [Custom Domain](/docs?section=custom-domains). Fine-tune your own local DSLM, with generated training-data from your own Cond8 codebase.

---
---

# **The Three Limiting Scopes**
## That ensures that DSLMs write code in small, predictable functions.
---
## **1. Procedural Function Execution**
The first and most fundamental scope limiter is procedural function execution. Instead of letting an LLM generate an entire codebase in one go, **Cond8 ensures DSLMs write code in small, predictable functions** (called [Actors](/docs?section=actors)), one by one. The DSLM will immediately stop when it generates a token that contains `).fin('` for writing scenes. and `return c8;` for writing actors. So that we are sure that the DSLM is not writing any more than what is needed.

Then, we **execute those functions in a structured procedure**.

```javascript
// src/directors/docs.page.js
DocsDirector.scene('Docs Page Fetch and Parse Scene')(
  Docs.Data.getMdxFile('make an actor that gets the file from the server'),
  Docs.Guard.checkMdx('make sure that the file is not empty'),
  Docs.Caller.parseMdx('call the mdx parser service to convert the content'),
).fin()
```

Cond8 is the **framework built around this concept**.

## **2. The Conduit**
[The Conduit](/docs?section=the-conduit) is the second scope limiter.
It acts as the **central hub** for **all data, services, and database connections**.
Each Actor passes the Conduit to the next one in order.

Each **Actor** follows a strict process with the Conduit to ensure **structured and controlled data flow** throughout execution:
1. **Get** something from the Conduit.
2. **Do**  something with the thing from the Conduit.
3. **Set** something back in the Conduit.

```javascript
// src/actors/docs.data.js
import { Actors } from 'packages/_core/src/index';

export const getMdxFile = Actors.Data(async c8 => {
  // get something
  const sectionName = c8.getBody('query:section') ?? 'index';
  // do something
  const file = await fetch(
    `http://localhost:3030/public/docs/${sectionName}.mdx`,
  );
  const text = await file.text();
  // set something
  c8.addData('docs', text);
  return c8;
});
```

> However, manually working within these constraints can feel verbose and tedious—unless you're creating [Custom Domains](/docs?section=custom-domains), where the Conduit and Roles below are customisable.

## **3. Roles**
The final scope limiter is [Roles](/docs?section=roles-introduction).
Each **Actor** is assigned a **specific role**, which determines the **methods it can access**.
Roles are **fundamental** when fine-tuning local DSLMs, because they provide **targeted context** at the most critical point in each prompt—ensuring the model generates **accurate, context-aware** code.

There are **12 predefined roles**:
🔹 [Logger](/docs?section=role-logger)
🔹 [Reader](/docs?section=role-reader)
🔹 [Auth](/docs?section=role-auth)*
🔹 [Store](/docs?section=role-store)
🔹 [Service Setup](/docs?section=role-service-setup)
🔹 [Database Setup](/docs?section=role-database-setup)
🔹 [Caller](/docs?section=role-caller)
🔹 [Repository](/docs?section=role-repository)
🔹 [Data](/docs?section=role-data)
🔹 [Guard](/docs?section=role-guard)
🔹 [Modeler](/docs?section=role-modeler)
🔹 [Every](/docs?section=role-every)

> ***Cond8 does NOT provide built-in authentication.** <br/>
> In this context, **"Auth"** means access to authentication details—not an authentication mechanism itself.

```javascript
// Actor 1: docs.guard.js
export const actorThatGuardsBody = Actors.Guard(c8 => {
  // get something
  const bodyValue = c8.getBody('body key');
  if (!bodyValue) {
    // throw something
    c8.abort('Body value is missing', 'getBody:', bodyValue);
  }
  return c8;
});

// Actor 2: docs.database.setup.js
export const actorThatSetsUpDatabase = Actors.DatabaseSetup(c8 => {
  // set something
  c8.addDatabase('mock database', new MockDatabase(c8));
  return c8;
});

// Actor 3: docs.repository.js
export const actorThatUsesRepo = Actors.Repository(async c8 => {
  // get something
  const bodyValue = c8.getBody('body key');
  const database = c8.getDatabase('mock database');
  // do something
  const value = await database.query(bodyValue);
  // set something
  c8.addData('data key', value);
  return c8;
});

// Actor 4: docs.modeler.js
export const actorThatModelsData = Actors.Modeler(c8 => {
  // get something
  const value = c8.getData('data key');
  // do something
  c8.updateData('data key', value.toUpperCase());
  // set something
  return c8;
});

// Actor 5: docs.service.setup.js
export const actorThatSetsUpService = Actors.ServiceSetup(c8 => {
  // set something
  c8.addService('mock service', new MockService(c8));
  return c8;
});

// Actor 6: docs.caller.js
export const actorThatCallsService = Actors.Caller(async c8 => {
  // get something
  const service = c8.getService('mock service');
  const modeledData = c8.getData('data key');
  // do something
  const serviceResult = await service.process(modeledData);
  // set something
  c8.addData('service output', serviceResult);
  return c8;
});
```

> Comments are added by me. and each of these actors takes about 2 seconds to generate with a Diffusion-based DSLM.<br/>For manual writing, You can access all Conduit methods using the [Every](/docs?section=role-every) role.

---

# else Services
Some tasks don’t fit neatly into Cond8’s structured execution model. That’s where Services come in.

A Service is a free-form, independent function that can be called from any Caller Actor. Unlike the declarative approach of Cond8, Services allow you to write code the way you naturally think about it—without conforming to the framework’s constraints.

They are perfect when you have a clear concept in your head and would rather collaborate with an AI assistant (like ChatGPT) to write code directly instead of breaking it down into Cond8’s step-by-step execution.

```ts
// src/services/mock.service.ts
export class MockService extends AbstractService {
  private readonly user: UserShape;

  constructor(c8: ReadonlyConduit, recorder: Recorder) {
    super(c8, recorder);
    this.user = c8.user;
  }

  process(input: string): string {
    if (!input.trim()) {
      this.recorder.record('MockService: Received empty input', 'warning');
      return 'Invalid input provided.';
    }

    const result = `${input} is processed by ${this.user.name}`;
    this.recorder.record(`Service: Processed input -> ${result}`, 'info');
    return result;
  }

  onClose(): void {
    this.recorder.record('MockService: Cleaning up resources', 'info');
    // Lifecycle method to clean up resources
  }
}
```

---

>> **Worried about the learning curve? Cond8’s documentation is packed with prompts designed to help you learn through your favorite LLM chat.** [button](/prompts?section=cond8-introduction)

---


## Why JavaScript, Not TypeScript?
- **Cond8 Core:** Built in TypeScript for type safety.
- **[Auto-Development](/docs?section=developer-tools)?:** JavaScript is faster (skips build step for the recursive DSLM function).
- **Writing [Custom Domains](/docs?section=custom-domains)?** Use TypeScript.
- **Balanced Approach?** TypeScript for Services.

---
---


## Design Requirements
A **Small** Language Model (~3B parameters) operating within a large Cond8 codebase should effectively:
- **Understands** a high-level overview of the codebase.
- **Writes** code that is aligned with the user's intent.
- **Debugs** efficiently with the right context.

**Development speed is crucial**. The following CRUD project was developed using Cond8 in under 24 minutes.

> Is it secure? No. Is it fast? Yes. Is it fun? Absolutely.

## Development Process for a CRUD Project
**Project:** A ticketmaster clone using the [Home Domain](/domains?section=home).
- **Tech Stack:** Express, Kysely, htmx.
- **Features:** User authentication, ticket purchasing, and event creation.
- **Pages:** Home, Login, Register, Events, Tickets and Buy.
- **Database:** SQLite.
- **DSLMs:** Cond8 Planner (8B), Home Domain Declarative (3B), Home Domain Diffusion (2B), Multi Modal VHX Domain Diffusion (12B).
### Steps:
1. Chat with the [Cond8 Project Planner](/project-planner) to produce Director and Scene metadata. (like planning the input and output of staged scenes)
2. Use the CLI to generate the project structure. The Director pages contains all the metadata.
3. Use the declarative DSLM to generate the actors prompts (or actor metadata) for each scene.
4. Human in the loop refinement for each of the metadata.
5. Auto-generate Testing files for each scene. where we can test with an input and expect an output.
6. Use the default Recorder and connect it to all the Directors.
7. Activate Auto-Development of the backend through the CLI. This will generate all the Actors Scripts through a recursive DSLM function until each scene has reaches their expected output.
8. Switch to the VHX DSLM for the frontend. This will generate all the frontend code.
9. Activate Auto-Development of the frontend through the CLI. This will make active screenshots during front-end development for the Multi-Modal DSLM.
10. Passes all tests within 24 minutes.

---

## Caveats
* When AI writes one function at a time, procedural constraints make Key-Value storage and CRUD operations the most reliable foundation.
* Making actors loop is the same as making a GOTO statement. (Don't do it)
* 🦍 Long scenes don't perform well. 🦍
* Writing Actors and Directors manually is quite boring. Make [Custom Domains](/docs?section=custom-domains) to make it fun.

---

## About me
* 7 years of professional coding experience.
* Always building side-projects (Cond8 turned out pretty dang good, though!).
* Never finishes side-projects (I code to learn!).
* Goes on dating shows for fun.
* In contrary to popular belief. I **do** eat cheese.
* ChatGPT once called me a systems thinker (nice).

---
---
---
---
---
