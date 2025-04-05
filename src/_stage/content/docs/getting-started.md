# **Let's get started!**

# 1) This is a Director
This docs page is constructed by a [Director](/docs?section=director). Here is where I can write down the Director Instructions (henceforth named Director metadata)

```js
// src/directors/docs-page.js
import { Director } from 'packages/_core/src/index'

const DocsDirector = new Director(
  // the first argument of the metadata must always be a string
  'Docs Page Director',
  // the rest can be any
  'Directs all of the documentation of the Cond8 framework',
  'Doc sections are written in mdx and parsed into html'
);

export default DocsDirector;
```

---

# 2) A Director structures Scenes.
Then, we write our first [Scene](/docs?section=scene) that will be directed by the [Director](/docs?section=director) above. We will write down the following [Scene Context](/docs?section=metadata):

```js
// src/directors/docs-page.js
import { Director } from '@cond8/core'

const DocsDirector = new Director(
  'Docs Page Director',
  'Directs all of the documentation of the Cond8 framework',
  'Doc sections are written in mdx and parsed into html'
);

DocsDirector.scene(
  // Again, first argument for a context is a string
  'Docs Page Fetch and Parse Scene',
  // the rest can be any, but I keep it strings for clarity
  'Documentation page that has "section" in the query',
  'I guess thats enough to make any docs page?',
  // and much more...
)

export default DocsDirector;
```

Normally, those strings would be considered comments of JSDocs. So that other developers can see what is going on. But now - they are real literal strings, those lines that were comments before, are now first-class citizens in Cond8.

---

# 3) A DSLMs writes the actors for a scene.

This time. We don't write the actors ourselves. We will run the following command: (make sure that you have `export default DocsDirector;` As the second last line on the file)

```sh
$ pnpm cond8 fin directors/docs-page.js
```
Using the [Directors Instructions](/docs?section=metadata) & [Scene Context](/docs?section=metadata) the DSLM will write [Actors Prompt](/docs?section=metadata). This is the result:

```js
// src/directors/docs-page.js
import { Director } from '@cond8/core'

const DocsDirector = new Director(
  'Docs Page Director',
  'Directs all of the documentation of the Cond8 framework',
  'Doc sections are written in mdx and parsed into html'
)

DocsDirector.scene(
  'Docs Page Fetch and Parse Scene',
  'Documentation page that has "section" in the input body',
  'I guess that\'s enough to make any docs page?',
)(
  // The Actors also follow the same pattern, first argument is a string
  // Everything below this comment is written by a DSLM
  Docs.Data.getMdxFile(
    'Cond8 Docs Data Actor',
    'Identify the section from the incoming body.',
    'Fetch the *.mdx file from /public/docs/.',
    'Save the file content as "mdx" within the data context.',
  ),
  Docs.Guard.checkMdx(
    'Cond8 Docs Guard Actor',
    'Access the "mdx" data from the current context.',
    'If "mdx" is absent, abort execution with an error message.',
  ),
  Docs.Caller.parseMdx(
    'Cond8 Docs Caller Actor',
    'Extract the "mdx" data.',
    'Utilize the mdx parser service to convert the content.',
    'Store the parsed output under a new data key "html".',
  ),
).fin('html')

export default DocsDirector;
```
> A scene always ends with "`).fin('`" This helps an autoregressive language model by providing a clear stopping point, improving structure and predictability. We need to complete it by writing "`html');`" ourselves

The DSLM has written human-readable prompts for the actors. This is what the director's page is for. Although it doesn't really have to be this verbose.

---

# 4) Refinement

It's our turn again to do some work. A common industry saying is: "The job of the human is to review the work of LLMs."

Running the director page as it is right now will crash, because the `DOCS` object that the DSLM hallucinated doesn't even exist. That is by design. However, a lot of logic isn't completely refined yet. Like how to parse the mdx file. the DSLM just wrote "parse it through the service" without any details. (Read more about [Services](/docs?section=services)).

## Actors Prompt

```js
  Docs.Guard.checkMdx(
    'Cond8 Docs Guard Actor',
    'Access the "mdx" data from the current context.',
    'If "mdx" is absent, abort execution with an error message.',
  ),
```
Let's zoom in on this actor. The strings are called an Actors Prompt.

# The human director


For example, take a look at the declarative actor prompt:

```js
Docs.Data.getMdxFile(
"Cond8 Docs Data Actor",
`
# DATA TASK: Fetch MDX File
• Identify the section from the incoming body.
• Fetch the *.mdx file from /public/docs/.
• Save the file content as "mdx" within the data context.
`
)
```
There’s a mistake: the prompt assumes the MDX file should be fetched over HTTP, but since the file is already on the server, we should retrieve it directly from the system path instead.

```js
Docs.Data.getMdxFile(
"Cond8 Docs Data Actor",
`
# DATA TASK: Fetch MDX File
• Identify the section from the incoming body.
• Retrieve the *.mdx file from the system in ../docs/*.
• Save the file content as "docs" within the data context.
`
)
```

# The imperative DSLM

Now that we have the declarative prompts to our disposal. we can make the actors scripts.
