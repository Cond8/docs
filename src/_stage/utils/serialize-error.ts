export function serializeError(error: unknown): string {
	let name = 'Error';
	let message = 'Unknown error';
	let stack = '';

	if (error instanceof Error) {
		name = error.name;
		message = error.message;
		stack = error.stack || '';
	} else if (typeof error === 'object' && error !== null) {
		message = JSON.stringify(error, null, 2);
	} else if (typeof error === 'string') {
		message = error;
	} else {
		message = String(error);
	}

	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${name}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />

  <script src="/cond8-dev.js"></script>
  <style>
    :root {
      --background: #0f0f0f;
      --foreground: #f8f8f8;
      --accent: #ff003c;
      --dim: #999;
      --font: 'Courier New', monospace;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      background: var(--background);
      color: var(--foreground);
      font-family: var(--font), monospace;
      line-height: 1.5;
      padding: 2rem;
    }

    h1 {
      font-size: 2.5rem;
      border-bottom: 4px solid var(--accent);
      padding-bottom: 0.5rem;
      margin-bottom: 1.5rem;
    }

    section {
      margin-bottom: 2rem;
      border: 1px solid var(--dim);
      padding: 1rem;
    }

    h2 {
      font-size: 1.2rem;
      color: var(--foreground);
      margin-bottom: 0.5rem;
    }

    pre {
      background: #1c1c1c;
      padding: 1rem;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      border-left: 4px solid var(--accent);
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <h1>COND8 ERROR</h1>

  <section>
    <h2>Name</h2>
    <pre>${escapeHtml(name)}</pre>
  </section>

  <section>
    <h2>Message</h2>
    <pre>${escapeHtml(message)}</pre>
  </section>

  ${
		stack
			? `<section>
         <h2>Stack Trace</h2>
         <pre>${escapeHtml(stack)}</pre>
       </section>`
			: ''
	}

</body>
</html>`;
}

function escapeHtml(input: string): string {
	return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;/g  &gt;');
}
