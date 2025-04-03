# Cond8: The Sinewave-Programming Framework You Didn’t Know You Needed

> *"I was waiting for the pipeline operator in JavaScript. It took too long. So, I built my own pipeline—and called it Cond8. Then everything magically clicked into place (again). Welcome to Sinewave Programming 2.0."*

Cond8 is **a pipeline**—a sequence of small, predictable functions (Actors) executed one after another under the watchful guidance of an all-seeing Director. Think of it as vibe-coding on rails. Instead of letting your code meander like an endless jam session of cosmic frequencies, Cond8 lovingly corrals your logic into an organized jam session—where each function is a single jazz note, methodically played in sequence. Cue the sax solo.

---

## Why Another Pipeline?

Because waiting for the official [pipeline operator](https://github.com/tc39/proposal-pipeline-operator) to land in JavaScript is like waiting for the second coming of Tron. I got impatient. I started building a pipe function for fun. Then that turned into an Express wrapper. Then I realized, *"Hold up, am I basically creating an entire automated bug-fixing pipeline that might or might not rely on cosmic frequencies and laser beams?"* Possibly. And so I kept iterating. Then Disneyland happened. Then I renamed everything, and **poof**—Cond8 was reborn.

So, yeah. Cond8 is basically me spicing up vibe-coding with structural constraints so small language models can do all the heavy code-lifting.

---

## 3 Key Points: Directors, Actors, and the Conduit

### 1. **Directors**: The Big Picture
A Director is like your symphony conductor, orchestrating the entire pipeline. Directors can nest within other Directors for some truly meta coding hijinks. They are the final say in how each Actor is orchestrated, and they can embed entire sub-directors like a well-layered onion. (Or a particularly philosophical lasagna. Whichever analogy resonates best with your vibe.)

**Example**
```tsx
const MyEpicDirector = createDirector('Epic Scene')(
  /* Actor 1 */ HelloWorldActor,
  /* Actor 2 */ FancyDatabaseActor,
  /* Actor 3 */ PossiblyALightsaberActor,
).fin();
```
They run in sequence. They output what you want. They’re *composable*, re-usable, and if you politely ask them, they might also brew coffee. (They won’t, but a developer can dream.)

---

### 2. **Actors**: The Little Big Deal
Actors are small, single-purpose functions that follow Cond8’s precious **Get → Do → Set** pattern:

1. **Get** something from the Conduit.
2. **Do** something with that “something.”
3. **Set** something back into the Conduit.

The strictly limited nature of Actors makes them *super friendly* for smaller, domain-specific language models (DSLMs). Instead of writing 500 lines of code in one shot, the model writes 5 lines, checks them, and calls it a day—like a diligent cameo role in your code’s miniseries.

**Example**
```js
export const HelloWorldActor = Actors.Data(c8 => {
  // 1. Get
  const nameParam = c8.getBody('params:name');

  // 2. Do
  const greeting = `Hello, ${nameParam}!`;

  // 3. Set
  c8.addData('greetingMsg', greeting);
  return c8;
});
```

---

### 3. **The Conduit**: Universal Data Hub
Where do these Actors store data? How do they communicate? Meet the Conduit: the code’s nerve center, the stage manager for all the Actors’ comedic (and serious) interactions. An Actor can’t directly talk to another Actor—it has to go through the Conduit. This forced isolation is why everything remains tidy and testable. Like a Zen garden with tiny sand rakes.

The Conduit is formed by **Blueprints**, abstract classes that define exactly how data is stored, retrieved, and validated. You can have a Conduit that’s strict enough to freak out at the slightest mismatch, or one that’s more laid-back and goes with the flow. The choice is yours. Meanwhile, each Actor just calls `c8.get(...)` or `c8.set(...)`, letting the Conduit do the heavy lifting.

---

## Domain-Specific Small Language Models (DSLMs)

### The *Two* DSLMs
We harness the magic of two specialized mini-models:

1. **Diffusion DSLM** – The Dreamer
   - **Job**: Build Directors. Sketch out the overall pipeline, imagine new roles or placeholders, and basically come up with a grand plan that might have a dash of unicorns or references to services that don't yet exist.
   - **Style**: Loose, creative, occasionally whimsical. It’s allowed to dream big, because the next DSLM or the Cond8 CLI can fill in any gaps.

2. **Autoregressive DSLM** – The Carpenter
   - **Job**: Implement each Actor with precision.
   - **Style**: Strict and methodical. If the dreamer says, “Let’s create a `StoreActors.Compactify('SecretKey')`,” the Carpenter’s job is to ensure that actually compiles and passes tests. No messing around.

### Dynamic Prompting + The Recorder
All this magic is orchestrated by Cond8’s built-in **Recorder**. It’s a device that tracks every meaningful piece of context, from intermediate data values to error messages. When an Actor fails, Cond8 promptly feeds the entire fiasco (via the Recorder logs) back to the DSLM so it can correct itself. Think of it as a witty coworker who never forgets your mistakes—except it helps you fix them, too.

---

## Example: The "HelloDirector" that Greets the Universe

```tsx
// src/directors/hello.tsx
import { createDirector } from '@cond8/core';
import { ExpressHttpHooks } from '@cond8/home';
import { AppConduit, ExpressHttpActors, CoreActors, VHXActors } from '../AppConduit';
import { z } from 'zod';
import { capitalize } from '../utils.js';

const HelloDirector = createDirector(
  'Hello World',
  ExpressHttpHooks.Get('/hello/:name'),
  ExpressHttpHooks.Config({ sendType: 'html' }),
).init(input => ({
  conduit: new AppConduit(input), // A custom Conduit
  recorder: null, // No recording
}));

HelloDirector(
  // 1. Validate the incoming route parameter `:name`
  ExpressHttpActors.ParamsGuard({ name: z.string() }),

  // 2. Grab the param, jazz it up, store it
  CoreActors
    .Get.String('params:name')
    .Do((rawName) => capitalize(rawName))
    .Set('Capitalized name'),

  // 3. Adjust the browser title for flair
  VHXActors.Title('Greetings from Cond8'),

  // 4. Render a basic greeting in JSX (like a boss)
  VHXActors.Template(c8 => (
    <h1 className="font-xl text-center">
      Hello, {c8.string('Capitalized name')}!
    </h1>
  )),

  // 5. Wrap it all up in a glorious HTML structure
  VHXActors.WrapHtml(),
);

export default HelloDirector.fin(c8 => c8.var('html'));
```

**What does it do?**
It’s basically a “Hello World” that’s *slightly* fancier. Provide a route parameter (`:name`), it capitalizes it, sets the HTML title, and returns a simple greeting.

---

## A Procedural Lambda Execution Engine (Wait, What?)

- **Procedural**: Directors call Actors in a single file (or many files, but single flow). Your code is easy to follow, easy to fix, and easy to reason about.
- **Lambda**: Directors + Actors can be mathematically pure—like a function that always does the same thing given the same input. *No state shenanigans allowed.*
- **Execution**: Each Actor’s success or fail is caught. If an error arises, Cond8 can automatically retry or prompt a specialized “imperative DSLM” to fix what broke.
- **Engine**: All of this is built into the Cond8 runtime environment, so you can focus on your code (and possibly those cosmic frequencies).

---

## The 3 Core Restrictions (But Fun)

1. **Directors**: Don’t let the LLM write the entire codebase in one go. Force it to express logic as a pipeline. Clear, testable, no “heyyyy let’s build a nested labyrinth of doom” (unless it’s intentionally nested inside sub-directors, in which case, carry on).

2. **Conduit**: Gate all data through a single source of truth. No more spaghetti code with random global variables. Actors talk to the Conduit only.

3. **Roles**: Provide *just enough scaffolding* so your Actors do *exactly* what you intended. The Director DSLM can go all airy-fairy referencing new Roles or calls, and the CLI + Autoregressive DSLM will fill in the precise bits. It's basically “imagine first, implement second.”

---

## Final Words: Are We Having Fun Yet?

- Cond8 is a pipeline for your entire codebase.
- Each function is an Actor.
- Directors are the orchestrators.
- The Conduit is the ultimate data hub.
- DSLMs (the small but mighty language models) do the heavy lifting under the hood.

Yes, it’s more structured than freeform vibe-coding. But guess what? **Your small language models will love it** because the scope is tight, the checks are frequent, and the potential for meltdown is minimal. And for you, the human coder, it means building software that’s surprisingly robust, easy to debug, and pretty fun to orchestrate.

> **Disclaimer**: The pipeline operator might finally arrive in JavaScript one day, but until then, we’ve got Cond8 to keep us vibing in a structured, magical sort of way.

---
**Welcome to Cond8**—where code meets pipelines, tests meet self-healing DSLMs, and your software development journey just got a whole lot more interesting. Grab a coffee and enjoy the ride.

*(Yes, I **do** eat cheese. And yes, ChatGPT once called me a “systems thinker.”)*
