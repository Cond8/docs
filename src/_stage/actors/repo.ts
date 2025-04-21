import { DocsConduit } from '../conduits/DocsConduit';

export const createRepoActors = <C8 extends DocsConduit>() => {
	const NewsletterRegistration = {
		From: (getKey: string) => async (c8: C8) => {
			const email = c8.var.string(getKey);
			const key = `subscriber:${email}`;

			try {
				if (!c8.body.env || !c8.body.env.SUBSCRIBERS) {
					console.error('SUBSCRIBERS KV namespace is not defined in environment variables.');
					c8.var('newsletter_status', 'error');
					return c8;
				}

				const existing = await c8.body.env.SUBSCRIBERS.get(key);
				if (!existing) {
					await c8.body.env.SUBSCRIBERS.put(key, JSON.stringify({ email, timestamp: new Date().toISOString() }));
				}
				c8.var('newsletter_status', 'success');
			} catch (err) {
				console.error('Error registering newsletter subscriber:', err);
				c8.var('newsletter_status', 'error');
			}

			return c8;
		},
	};

	return {
		NewsletterRegistration,
	};
};
