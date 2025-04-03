## 📘 Cond8 Deep Dives

Below are three focused explanations designed to clarify key concepts of Cond8’s current structure and functionality.

---

### 1. 🔧 **Understanding Blueprints**

In Cond8, a **Blueprint** defines the interface of a **Conduit Layer**, a structured, stateful environment through which Actors interact.

Each Blueprint specifies the allowed methods for reading, writing, and modifying state. Cond8 offers several built-in Blueprint types:

- **`CoreBlueprint`**: The foundational abstract class, minimal by design (also called `EmptyBlueprint`), which other Blueprints extend.
- **`StrictKVBlueprint`**: A strict key-value store enforcing errors on invalid access, helping catch issues early. Comes in two flavors:
- **`StrictKVBlueprintSync`** (synchronous operations)
- **`StrictKVBlueprintAsync`** (asynchronous operations)
- **Custom Blueprints**: You can create specialized Blueprints tailored to your application's specific needs (e.g., `StrictFileSystemService`, `StrictMemoryLRUService`).

**Example of a custom Blueprint implementation:**

```typescript
class MyAppCacheService extends StrictKVBlueprintAsync<string, string> {
  async has(key: string): Promise<boolean> { /* custom logic */ }
  async optional(key: string): Promise<string | undefined> { /* custom logic */ }
  async set(key: string, value: string): Promise<void> { /* custom logic */ }
  async remove(key: string): Promise<void> { /* custom logic */ }
}
```

Actors access Blueprints exclusively via `get`, `set`, and `do` operations, ensuring clear boundaries and state predictability.

---

### 2. 🎭 **Roles as Prompt-Time Metadata**

In Cond8, **Roles** are strictly metadata constructs used exclusively at the prompting stage for Domain-Specific Language Models (DSLMs). They guide the DSLM by clearly specifying the intended behavior and logic of an Actor during code generation.

Roles are not part of the runtime system; rather, they help the DSLM generate precise and contextually relevant scripts.

**Example usage of Roles:**

```typescript
CoreActors.Get.String('user:name')
  .Role('Normalizer')
  .Do(name => name.trim().toLowerCase())
  .Set('normalized_name');
```

In this example, the `Normalizer` Role instructs the DSLM precisely on the expected logic (normalizing a user's name).

---

### 3. 🛠️ **AUTO_ERROR_FIX in Action**

Cond8 includes a robust self-correcting feature called **AUTO_ERROR_FIX**, automatically recovering from errors at runtime by regenerating faulty Actors using detailed error insights.

Here's how it works:

1. **Detection:** When an Actor encounters an error, Cond8 immediately stops execution.
2. **Recording:** The error details (type, message, stack trace) are captured by the Cond8 **Recorder**.
3. **Prompting:** Cond8 reformulates the captured error into a structured prompt and feeds it to the precision DSLM.
4. **Auto-Regeneration:** The DSLM generates corrected code based on the detailed error feedback.

**Example of AUTO_ERROR_FIX in practice:**

**Initial Actor (with error):**

```typescript
CoreActors.Get.String('user:email')
  .Do(email => email.toUppercase()) // Mistake here: 'toUppercase' is incorrect.
  .Set('user_email');
```

After failure, Cond8 prompts the DSLM:

```plaintext
Error: "email.toUppercase is not a function. Did you mean 'toUpperCase'?"
```

**Automatically fixed Actor:**

```typescript
CoreActors.Get.String('user:email')
  .Do(email => email.toUpperCase()) // Fixed automatically
  .Set('user_email');
```

This automated feedback loop ensures reliability and correctness, continuously improving code quality without manual intervention.

