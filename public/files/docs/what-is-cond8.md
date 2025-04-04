# What is Cond8?

Cond8 is, at its core, a pipeline—a sequence of functions executed one after another. In Cond8, we call these functions *Actors*, and the entire pipeline is called a *Director*. Directors are fully composable, meaning you can seamlessly embed Directors within other Directors, allowing you to build sophisticated workflows from simple, reusable parts. This structured approach empowers Domain-Specific Small Language Models (DSLMs) to clearly focus on coding just one Actor at a time. Each Actor is strictly limited—it must only **get** something, **do** something with it, and **set** something back. This straightforward yet powerful restriction makes Cond8 uniquely effective, providing DSLMs with a predictable and manageable framework to reliably generate correct code. Because each Actor has a clearly defined expected output, Cond8 can automatically retry or regenerate Actors until they pass their tests.

What makes Cond8 different isn’t polish — it’s that its core contracts with DSLMs are built into the infrastructure. If those break, the entire system fails by design. Cond8 isn’t just automation — it’s a deliberately constructed execution environment. Everything from director composition to actor behavior is formalized in code, so DSLMs don’t guess — they operate within strict, testable boundaries. That same structure also makes it easier for you, the human developer, to reason about complex systems and build software that doesn’t just work — it holds.

---

## HelloDirector Example

The director that made this page looks like this

```tsx
// src/directors/hello.tsx
import { createDirector } from '@cond8/core';
import { ExpressHttpHooks, ExpressHttpProps } from '@cond8/home';
import { VHXActors } from '../conduits/AppConduit.js';
import { AppConduit, CoreActors, ExpressHttpActors } from '../AppConduit'
import { z } from 'zod';
import { capitalize } from '../utils.js';

// Simple "Hello World" director
const HelloDirector = createDirector(
  'Hello World', // Human-readable director name
  ExpressHttpHooks.Get('/hello/:name'), // Route: matches GET /hello/:name
  ExpressHttpHooks.Config({ sendType: 'html' }), // Set content-type to HTML
).init<ExpressHttpProps>(input => ({
  conduit: new AppConduit(input), // Create the conduit (shared environment)
  recorder: null, // Disable recording for this director
}));

HelloDirector(
  // 1. Validate the incoming `:name` param (ensure it's a string)
  ExpressHttpActors.ParamsGuard({ name: z.string() }),

  // 2. Get and format the name from the route params
  CoreActors
    .Get.String('params:name') // Access raw route param
    .Do(paramSection =>
      paramSection
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(capitalize)
        .join(' '),
    )
    .Set('Capitalized name'),

  // 3. Set the browser tab title
  VHXActors.Title('Greeting from Cond8'),

  // 4. Render a simple greeting using the formatted name
  VHXActors.Template(c8 => (
    <h1 className="font-xl text-center h-full">
      Hello, {c8.string('Capitalized name')}!
    </h1>
  )),

  // 5. Wrap everything in a full HTML document
  VHXActors.WrapHtml(),
);

// 6. Finalize the director and return the rendered HTML
export default HelloDirector.fin(c8 => c8.var('html'));
```

## HelloDirector Example — FAQ

### **Q1: What exactly does the `HelloDirector` example do?**
**A:** It sets up a web endpoint (`GET /hello/:name`) that returns an HTML page greeting visitors by their capitalized name. For example, accessing `/hello/john-doe` displays "Hello, John Doe!".

### **Q2: What is happening inside each Actor in this Director?**
**A:** Each Actor follows the strict Cond8 pattern of **Get → Do → Set**:

1. **ParamsGuard**: Ensures the URL param `:name` is a valid string.
2. **CoreActors.Get.String & Do**: Fetches the param and capitalizes it.
3. **VHXActors.Title**: Sets the browser tab title.
4. **VHXActors.Template**: Creates HTML content using JSX.
5. **VHXActors.WrapHtml**: Wraps content into a complete HTML document.

### **Q3: What's the purpose of the `Conduit` in `init(...)`?**
**A:** The **Conduit** is a shared state space allowing Actors to read, transform, and store data safely. Each Actor interacts exclusively through it, ensuring Actors remain isolated and easy to test or regenerate.

### **Q4: What does the `.fin(...)` method do at the end of the Director?**
**A:** It finalizes the Director by defining the specific output—here, the final rendered HTML. After calling `.fin(...)`, the Director becomes executable and ready to deploy as a web route handler.

### **Q5: How does Cond8 handle errors within the `HelloDirector`?**
**A:** If an Actor fails, Cond8 automatically halts execution. It then retries or regenerates the faulty Actor using detailed runtime insights, ensuring reliability and correctness through its built-in auto-fixing mechanism.

---

## Domain-Specific Small Language Models (DSLMs)

Domain-Specific Small Language Models (DSLMs) are compact language models specially fine-tuned to interact precisely with the specific services provided by the Cond8 Engine. Cond8 relies on two complementary types of DSLMs, each trained for a distinct purpose: creative director prompt writing, and precise, restrictive actor script writing.

1. **Diffusion DSLM – The Dreamer**
    - **Job**: Visually sketch and maintain Cond8 Directors as structured, image-like compositions. Rather than worrying about exact syntax or precise logic, the Dreamer treats each Director as a cohesive visual structure, like a blueprint or pixel art, clearly bounded by initialization (`init`) at the top and finalization (`fin`) at the bottom.
    - **Style**: Loose, intuitive, and creative. It excels at rapidly visualizing pipelines and imagining new roles or actors—even those that don't yet exist. The Dreamer doesn’t require token-by-token precision; instead, it ensures that the overall visual integrity and structure remain coherent across hundreds of Directors simultaneously.
    - **Why Visual?**: Viewing Directors as images leverages the natural strengths of Diffusion models, enabling efficient maintenance and exploration of large-scale, structured codebases without overwhelming VRAM constraints.

2. **Autoregressive DSLM – The Carpenter**
    - **Job**: Precisely implement each Actor within Directors. Takes the visually sketched "dreams" and translates them into executable, correct code. It rigorously validates syntax, ensures type correctness, and guarantees that every Actor compiles, passes tests, and integrates cleanly into the Cond8 infrastructure.
    - **Style**: Methodical, strict, and precise. If the Dreamer envisions something creative like `StoreActors.Compactify('SecretKey')`, the Carpenter ensures this Actor is accurately implemented, throwing errors immediately if anything doesn't match specifications.
    - **Why Autoregressive?**: The Carpenter’s autoregressive nature enforces strict correctness, bridging the gap between imaginative visual structures and robust, production-ready code.

---

**Synergy between Dreamer and Carpenter**:

By having the Diffusion DSLM handle the visual, structural integrity of large codebases (like images), and the Autoregressive DSLM meticulously ensuring correctness at the actor implementation level, Cond8 achieves a powerful combination of creativity and reliability:

- **Dreamer (Diffusion)**: Efficiently manages hundreds of Directors visually.
- **Carpenter (Autoregressive)**: Guarantees correctness and precision within each Director.

Together, they ensure that Cond8 remains flexible, innovative, and robust.

---

### What about Prompting?

Prompting in Cond8 is dynamic and adaptive, driven by runtime insights captured by the Cond8 Recorder. The Recorder meticulously tracks every meaningful interaction—each method call within the Conduit, as well as lifecycle events between directors and actors. Cond8’s prompt infrastructure can then intelligently filter and process this rich, recorded data, removing noise to provide clean, relevant prompts uniquely tailored to each Actor at runtime.

This powerful system also supports Cond8’s automatic error-fixing capability (AUTO_ERROR_FIX). When an error occurs, it immediately becomes integrated into the Actor’s next prompt, providing the Imperative DSLM with clear, actionable context. This feedback loop continuously enhances precision, reliability, and the model’s ability to handle edge cases—all seamlessly at runtime.

---

## Procedural Lambda Execution Engine

Cond8 runs on a specialized execution engine designed to maximize clarity, reliability, and performance. Here’s how each part contributes to the overall experience:

- **Procedural**: Actors are executed sequentially, one after another. This linear progression ensures predictable interactions and easy debugging, as every Actor clearly builds upon the previous Actor’s results.

- **Lambda**: Directors can be represented as compositions of pure functions, following principles from lambda calculus. Because of this purity and mathematical rigor, Cond8 can aggressively optimize Directors—automatically reducing them to their minimal computational footprint. This optimization process is what we call **Director Shaking**: turning declarative, expressive pipelines into tightly optimized computations.

- **Execution**: Each Actor receives careful attention during execution. Cond8 enforces built-in assertions and constraints, making sure that Actors behave as intended. If an assertion fails, Cond8 invokes a specialized imperative DSLM—an error-handling Actor—trained explicitly to detect, diagnose, and even automatically patch logic errors and edge cases.

- **Engine**: All these layers come together in Cond8’s robust and highly orchestrated runtime environment. This engine integrates procedural sequencing, lambda calculus-inspired optimizations, automated self-healing mechanisms, and robust actor lifecycle management, creating a dependable and performant execution platform for your DSLM-generated code.

---

## Core Restrictions

### 1. **Directors (The Pipeline)**
The first core restriction prevents DSLMs from attempting to generate an entire codebase at once. Instead, DSLMs write a linear pipeline: a clearly defined series of input/output transformations. Although simple in structure, pipelines turn out to be remarkably expressive. Each Director becomes a powerful, declarative interface for computation—easy to reason about, easy to test, and easy to maintain.

### 2. **The Virtual Conduit**
The Conduit is the central hub of every Director. Actors aren't allowed to communicate directly with each other; instead, they interact exclusively with the Conduit. This isolation greatly simplifies testing, enhances predictability, and makes individual Actors easy to regenerate if something goes wrong.

Internally, a Conduit consists of **layers of services**, ranging from straightforward local key-value storage to complex asynchronous communication. Each layer is defined by a **Blueprint**, an abstract class you can extend and customize as needed.

For example, the `StrictKVBlueprint` provides standard key-value methods like `get`, `set`, `remove`, and `has`. However, because it’s **strict**, accessing or modifying undefined keys immediately throws an error. This strictness helps quickly catch hallucinations made by the imperative DSLM, forcing it to stick closely to the defined logic. Director writers can dream freely, but Actors must be precise.

If strict isn't the right fit, you can always extend from `EmptyBlueprint` or define your own completely custom Blueprint—Cond8 provides structure without limiting flexibility.

### 3. **Roles**
Roles can be summarized simply as **prompt infrastructure**. When creating Directors, you might sometimes need to write intentional scaffolding—even if it feels verbose or redundant—to help clearly and declaratively describe your logic. This structured scaffolding guides the Director-writing DSLM, allowing it to craft more creative and meaningful Actor prompts.

Whatever the Director writer DSLM specifies, the imperative Actor-writer DSLM must respect and follow closely. Actor prompts are always structured clearly as *Get → Do → Set*. A little hallucination from the Director writer DSLM is acceptable because Cond8’s CLI can automatically generate any necessary scaffolding code to bring imagined or hallucinated Actors into reality. Once scaffolded, the imperative DSLM takes over and meticulously implements the Actor’s actual logic—bringing the Director to life.
