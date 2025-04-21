// src/routes/docs.ts
import { Hono } from 'hono';
import DocsPages from '../directors/docs-pages';
import DocsFragment from '../directors/docs-partial';

const DocsRoute = new Hono();

DocsRoute.get('/:slug', async c => {
	const html = await DocsPages(c);
	return c.html(html, 200, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

DocsRoute.get('/partials/:slug', async c => {
	const html = await DocsFragment(c);
	return c.html(html, 200, {
		'Content-Type': 'text/html; charset=utf-8',
	});
});

export default DocsRoute;
