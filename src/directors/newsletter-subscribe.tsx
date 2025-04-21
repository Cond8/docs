// src/directors/register-newsletter.tsx
import { Context } from 'hono';
import { z } from 'zod';
import { createDirector } from '../_core';
import { createRecorder } from '../_core/Recorder/create-recorder';
import { NewsletterFailure } from '../_stage/components/NewsletterFailure';
import { NewsletterSuccess } from '../_stage/components/NewsletterSuccess';
import { DocsActors, DocsConduit } from '../_stage/conduits/DocsConduit';

const NewsletterSubscribeDirector = createDirector<DocsConduit>(
	'register-newsletter director',
	'a partial HTML register newsletter director',
).init<Context>(c => ({
	conduit: new DocsConduit(c),
	recorder: createRecorder({
		onError: (recording, error) => {
			console.error(error);
			console.log(recording);
		},
	}),
}));

NewsletterSubscribeDirector(
	DocsActors.Guard.Body.Check({ email: z.string().email() })
		.SetEntries((n, v) => [`body ${n}`, v])
		.Catch(DocsActors.VHX.Template(<NewsletterFailure />)),
	DocsActors.Support.If(c8 => !(c8.vhx as any).templateSet).Then(
		DocsActors.Repo.NewsletterRegistration.From('body email'),
		DocsActors.Support.If(c8 => c8.var.string('newsletter_status') === 'success').Then(DocsActors.VHX.Template(<NewsletterSuccess />)),
	),
	DocsActors.VHX.Partialize.Set('html'),
);

export default NewsletterSubscribeDirector.fin(c8 => c8.var.string('html'));
