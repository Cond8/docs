// src/directors/register-newsletter.tsx
import { Context } from 'hono';
import { z } from 'zod';
import { createDirector } from '../_core';
import { DocsActors, DocsConduit } from '../_stage/conduits/DocsConduit';

const RegisterNewsletterDirector = createDirector<DocsConduit>(
	'register-newsletter director',
	'a partial HTML register newsletter director',
).init<Context>(c => ({
	conduit: new DocsConduit(c),
}));

RegisterNewsletterDirector(
	DocsActors.Guard.Body.Check({ email: z.string().email() }).SetEntries((n, v) => [`body ${n}`, v]),

	DocsActors.VHX.Finalize.Set('html'),
);

export default RegisterNewsletterDirector.fin(c8 => c8.var.string('html'));
