import dedent from 'dedent';
import { CoreRedprint } from '../../_core';
import { C8Error } from '../../_core/Recorder/C8Error';

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

	// Generate extra payload + recording sections
	let extraSections = '';
	if (error instanceof C8Error) {
		const payload = error.payload;
		const recording = error.recording;

		let payloadSections = '';
		for (const key in payload) {
			let value = payload[key];
			if (value instanceof CoreRedprint) {
				value = value.utils.readonly;
				delete value.var;
			}
			payloadSections += dedent`
        <section class="payload">
          <h2>${escapeHtml(key)}</h2>
          <pre>${escapeHtml(JSON.stringify(value, null, 2))}</pre>
        </section>
      `;
		}

		let recordingSection = '';
		if (Array.isArray(recording)) {
			recordingSection = recording
				.map((entry, i) => {
					const { ms, filter, metadata } = entry;

					const metadataGrid = Array.isArray(metadata)
						? `<div class="grid">${metadata
								.map(item => {
									if (item instanceof Error) {
										return `
                      <div class="cell">
                        <h3>Error: ${escapeHtml(item.name)}</h3>
                        <div><strong>Message:</strong> ${escapeHtml(item.message)}</div>
                        <div>
                          <strong>Stack:</strong>
                          <div class="stack-scroll">
                            <pre>${escapeHtml(item.stack ?? '')}</pre>
                          </div>
                        </div>
                      </div>
                    `;
									}

									return `
                    <div class="cell">
                      <pre>${escapeHtml(JSON.stringify(item, null, 2))}</pre>
                    </div>
                  `;
								})
								.join('')}</div>`
						: '';

					return dedent`
            <section class="recording">
              <h2>Recording #${i + 1}</h2>
              <div><strong>ms:</strong> ${ms}</div>
              <div><strong>filter:</strong> ${escapeHtml(filter)}</div>
              ${metadataGrid}
            </section>
          `;
				})
				.join('\n');
		}

		extraSections = recordingSection + payloadSections;
	}

	return dedent`
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
      --payload: #00c851;
      --recording: #ffeb3b;
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

    section:not(.payload):not(.recording) pre {
      border-left: 4px solid var(--accent);
    }

    section.payload pre {
      border-left: 4px solid var(--payload);
    }

    section.recording pre {
      border-left: 4px solid var(--recording);
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
      margin-top: 0.5rem;
    }

    section.recording .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    section.recording .cell {
      border: 1px solid var(--dim);
      background: #1c1c1c;
      padding: 1rem;
      overflow-x: auto;
    }

    .stack-scroll {
      max-height: 200px;
      overflow: auto;
      margin-top: 0.5rem;
      background: #1c1c1c;
      padding: 0.5rem;
      border: 1px solid var(--dim);
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

  ${extraSections}

</body>
</html>`;
}

function escapeHtml(input?: string): string {
	return input?.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') || '';
}
