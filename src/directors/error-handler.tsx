// src/directors/error-handler.tsx
import { createDirector } from '../_core';
import { C8Error } from '../_core/Recorder/C8Error';
import { DefaultHeaders } from '../_stage/components/default-headers';
import { ErrorHero } from '../_stage/components/error-hero';
import { DocsConduit } from '../_stage/conduits/DocsConduit';
import { ErrorActors, ErrorConduit } from '../_stage/conduits/ErrorConduit';
import { ErrorBodyParser } from './error-directors/body-parser';

const ErrorHandlerDirector = createDirector<ErrorConduit>('Error Handler Director').init<C8Error<DocsConduit>>(error => ({
	conduit: new ErrorConduit(error),
}));

ErrorHandlerDirector(
	ErrorBodyParser.AsActor,
	ErrorActors.VHX.Title.Get('error message', s => `Cond8 Error ${s}`),
	ErrorActors.VHX.Header(<DefaultHeaders />),
	ErrorActors.VHX.Template(
		<main
			id="error-page"
			className="min-h-screen w-full max-w-[1024px] mx-auto px-4 py-8 font-mono text-[var(--foreground)] bg-[var(--background)]"
		>
			{/* Grid layout for sections */}
			<section
				className="
        w-full grid gap-6
        grid-cols-1
        md:grid-cols-3 md:grid-rows-[repeat(12,minmax(0,1fr))]
      "
			>
				{/* Error block */}
				<div className="md:col-span-3 md:row-span-4 border border-foreground p-5 bg-background/70 hover:bg-background/90 transition-all">
					<h2 className="font-title uppercase text-lg mb-3 tracking-wide">🧨 Error</h2>
					<slot name="Error" />
				</div>

				{/* Recording */}
				<div className="md:col-span-3 md:row-start-5 md:row-span-3 border border-[var(--caution-border)] p-5 bg-background/60">
					<h2 className="text-sm font-bold text-[var(--caution-foreground)] mb-2 uppercase tracking-wide">🎥 Recordings</h2>
					<slot name="Recording" />
				</div>

				{/* Payload Snapshot */}
				<div className="md:col-span-3 md:row-start-8 md:row-span-4 border border-[var(--note-border)] p-5 bg-background/60">
					<h2 className="text-sm font-bold text-[var(--note-foreground)] mb-2 uppercase tracking-wide">📦 Payload Snapshot</h2>
					<slot name="Payload" />
				</div>
			</section>
		</main>,
	),

	ErrorActors.VHX.Slot('Error', c8 => <ErrorHero error={c8.var('error')} />),
	ErrorActors.VHX.Finalize.Set('html'),
);

export default ErrorHandlerDirector.fin<string>(c8 => {
	console.log(c8.var);
	return c8.var('html');
});
