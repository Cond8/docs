// src/_stage/components/docs-sidebar.tsx
export const sections = [
	{
		title: 'Introduction',
		links: ['What is Cond8?', 'Key Features', 'Why Use Cond8?'],
	},
	{
		title: 'Core Concepts',
		links: ['Directors', 'Actors', 'The Conduit', 'Blueprints', 'Roles'],
	},
	{
		title: 'Domain-Specific Small Language Models (DSLMs)',
		links: ['Overview', 'Dreamer (Diffusion DSLM)', 'Carpenter (Autoregressive DSLM)', 'Prompting in Cond8'],
	},
	{
		title: 'Execution Engine',
		links: ['Procedural Execution', 'Lambda-Based Optimization', 'Director Shaking', 'Execution Lifecycle'],
	},
	{
		title: 'Error Handling and Auto-Fixing',
		links: ['The Cond8 Recorder', 'Automatic Error Fixing (AUTO_ERROR_FIX)', 'Debugging and Testing'],
	},
	{
		title: 'Getting Started',
		links: ['Installation', 'HelloDirector Example', 'Building Your First Director'],
	},
	{
		title: 'Tutorials',
		links: ['Creating Actors', 'Composing Directors', 'Custom Blueprints', 'Integrating with Express'],
	},
	{
		title: 'API Reference',
		links: ['Core APIs', 'Actor APIs', 'Conduit APIs', 'DSLM Integration APIs'],
	},
	{
		title: 'Advanced Topics',
		links: ['Performance Optimization', 'Scaling with Cond8', 'Custom DSLMs', 'Extending the Execution Engine'],
	},
	{
		title: 'FAQ and Troubleshooting',
		links: ['Common Issues', 'Best Practices', 'Community Resources'],
	},
];

export const DocsSidebar = () => (
	<div className="w-64 mt-5">
		<nav className="flex flex-col gap-4">
			{sections.map(section => {
				return (
					<div key={section.title} className="mb-2">
						<div className="font-title uppercase text-card-foreground mb-2 text-sm">{section.title}</div>
						<ul className="font-mono list-none p-0 m-0 space-y-1">
							{section.links.map(link => {
								const slug = link
									.toLowerCase()
									.replace(/[^\w\s]/g, '')
									.replace(/\s+/g, '-');

								return (
									<li key={link}>
										<a
											href={`/docs/${slug}`}
											hx-get={`/partials/docs/${slug}`}
											hx-target="#htmx-target"
											hx-swap="innerHTML"
											hx-push-url={`/docs/${slug}`}
											className="text-foreground no-underline hover:text-primary transition-colors duration-200"
										>
											{link}
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				);
			})}
		</nav>
	</div>
);
