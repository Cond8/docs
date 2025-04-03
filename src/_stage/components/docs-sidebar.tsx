// src/_stage/components/docs-sidebar.tsx
export const sections = [
  {
    title: 'Introduction',
    links: ['What is COND8?', 'Key Features', 'Installation'],
  },
  {
    title: 'Core Concepts',
    links: ['Conduit', 'Actors', 'Recorder', 'Home DSL'],
  },
  {
    title: 'Using Cond8',
    links: ['Writing a Director Page', 'Custom Actors', 'Middleware'],
  },
  {
    title: 'API Reference',
    links: ['Conduit API', 'Actor API', 'Observer API'],
  },
  { title: 'CLI & Tooling', links: ['Cond8 CLI', 'Auto-Repair', 'Testing'] },
  { title: 'Advanced Topics', links: ['Custom DSLMs', 'Home DSL Internals'] },
];

export const DocsSidebar = () => (
  <div className="w-64 mt-5">
    <nav className="flex flex-col gap-4">
      {sections.map(section => (
        <div key={section.title} className="mb-2">
          <div className="font-title uppercase text-card-foreground mb-2 text-sm">
            {section.title}
          </div>
          <ul className="font-mono list-none p-0 m-0 space-y-1">
            {section.links.map(link => (
              <li key={link}>
                <a
                  href={`/docs/${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-foreground no-underline hover:text-primary transition-colors duration-200"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  </div>
);
