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

	// Extra sections for C8Error payload and recording
	let extraSections = '';
	if (error instanceof C8Error) {
		const payload = error.payload;
		const directorPayload = error.directorPayload;
		const recording = error.recording;

		// Generate sections for each payload property using a helper
		let payloadSections = '';
		for (const key in payload) {
			if (payload[key] !== undefined) {
				payloadSections += generatePayloadSection(key, payload[key]);
			}
		}

		// Generate sections for each directorPayload property using a new helper
		let directorPayloadSections = '';
		for (const key in directorPayload) {
			if (directorPayload[key] !== undefined) {
				directorPayloadSections += generateDirectorPayloadSection(key, directorPayload[key]);
			}
		}

		// Generate sections for recording entries (see previous snippet)
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

		// Combine payload, directorPayload, and recording sections
		extraSections = payloadSections + directorPayloadSections + recordingSection;
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
      --director: #007bff; /* New blue color for directorPayload */
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

    /* Default error sections */
    section:not(.payload):not(.director-payload):not(.recording) pre {
      border-left: 4px solid var(--accent);
    }

    /* Payload sections */
    section.payload pre {
      border-left: 4px solid var(--payload);
    }

    /* Director Payload sections */
    section.director-payload pre {
      border-left: 4px solid var(--director);
    }

    /* Recording sections */
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

    /* Styles for the grid in metadata */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .cell {
      border: 1px solid var(--dim);
      background: #1c1c1c;
      padding: 1rem;
      overflow-x: auto;
    }

    /* Scrollable stack trace for errors */
    .stack-scroll {
      max-height: 200px;
      overflow: auto;
      margin-top: 0.5rem;
      background: #1c1c1c;
      padding: 0.5rem;
      border: 1px solid var(--dim);
    }

    /* Styling for tables (used in the c8 section) */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
    }

    table, th, td {
      border: 1px solid var(--dim);
    }

    th, td {
      padding: 0.5rem;
      text-align: left;
    }

    .scrollbox {
      max-height: 300px;
      overflow: auto;
      background: #1c1c1c;
      border: 1px solid var(--dim);
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

  ${extraSections}

</body>
</html>`;
}

/**
 * Generates a custom HTML section for each key in the payload.
 */
function generatePayloadSection(key: string, value: unknown): string {
	switch (key) {
		case 'c8':
			if (value instanceof CoreRedprint) {
				const readonlyObj = value.utils.readonly;

				if (typeof readonlyObj === 'object' && readonlyObj !== null && !Array.isArray(readonlyObj)) {
					const rows = Object.entries(readonlyObj)
						.map(([outerKey, innerValue]) => {
							if (typeof innerValue !== 'object' || innerValue === null || Array.isArray(innerValue)) {
								// Not a nested record — show raw value
								return `
              <tr>
                <td>${escapeHtml(outerKey)}</td>
                <td>${escapeHtml(JSON.stringify(innerValue, null, 2))}</td>
              </tr>
            `;
							}

							const innerRows = Object.entries(innerValue)
								.map(
									([innerKey, val]) => `
                <tr>
                  <td>${escapeHtml(innerKey)}</td>
                  <td>${escapeHtml(JSON.stringify(val, null, 2))}</td>
                </tr>
              `,
								)
								.join('');

							return `
                <tr>
                  <td>${escapeHtml(outerKey)}</td>
                  <td>
                    <div class="scrollbox">
                      <table>
                        <thead>
                          <tr>
                            <th>Key</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${innerRows}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              `;
						})
						.join('');

					return dedent`
        <section class="payload">
          <h2>${escapeHtml(key)}</h2>
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </section>
      `;
				}
			}

			// Fallback: simple <pre> dump
			return dedent`
    <section class="payload">
      <h2>${escapeHtml(key)}</h2>
      <pre>${escapeHtml(JSON.stringify(value, null, 2))}</pre>
    </section>
  `;

		case 'error':
			if (value instanceof Error) {
				return dedent`
          <section class="payload">
            <h2>Error</h2>
            <div><strong>Name:</strong> ${escapeHtml(value.name)}</div>
            <div><strong>Message:</strong> ${escapeHtml(value.message)}</div>
            <div>
              <strong>Stack:</strong>
              <div class="stack-scroll">
                <pre>${escapeHtml(value.stack ?? '')}</pre>
              </div>
            </div>
          </section>
        `;
			}
			return dedent`
        <section class="payload">
          <h2>${escapeHtml(key)}</h2>
          <pre>${escapeHtml(JSON.stringify(value, null, 2))}</pre>
        </section>
      `;
		case 'metadata':
			if (Array.isArray(value)) {
				const items = value
					.map(
						item => `
            <div class="cell">
              <pre>${escapeHtml(JSON.stringify(item, null, 2))}</pre>
            </div>
          `,
					)
					.join('');
				return dedent`
          <section class="payload">
            <h2>Metadata</h2>
            <div class="grid">${items}</div>
          </section>
        `;
			}
			return dedent`
        <section class="payload">
          <h2>${escapeHtml(key)}</h2>
          <pre>${escapeHtml(JSON.stringify(value, null, 2))}</pre>
        </section>
      `;
		// For all other keys, output the JSON representation
		default:
			return dedent`
        <section class="payload">
          <h2>${escapeHtml(key)}</h2>
          <pre>${escapeHtml(JSON.stringify(value, null, 2))}</pre>
        </section>
      `;
	}
}

/**
 * Generates a custom HTML section for each key in the directorPayload.
 * Reuses the payload section, but replaces the CSS class with "director-payload"
 * to apply the blue color.
 */
function generateDirectorPayloadSection(key: string, value: unknown): string {
	// Replace all occurrences of the "payload" class with "director-payload"
	return generatePayloadSection(key, value).replace(/class="payload"/g, 'class="director-payload"');
}

/**
 * Escapes HTML special characters.
 */
function escapeHtml(input?: string): string {
	return input?.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') || '';
}
