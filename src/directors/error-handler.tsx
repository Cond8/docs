// src/directors/error-handler.tsx
import { createDirector } from '../_core';
import { C8Error } from '../_core/Recorder/C8Error';
import { DefaultHeaders } from '../_stage/components/default-headers';
import { ErrorHeader } from '../_stage/components/error-header';
import { ErrorHero } from '../_stage/components/error-hero';
import { ErrorPayload } from '../_stage/components/error-payload';
import { RecordingBlock } from '../_stage/components/recording-block';
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
			{/* Top bar with Copy button */}
			<div className="w-full flex justify-end mb-4">
				<button
					data-copy="Placeholder error text to copy"
					className="text-xs uppercase font-bold tracking-wide px-3 py-1 rounded bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
				>
					Copy Error
				</button>
			</div>

			<div className="w-full flex justify-center">
				<ErrorHeader />
			</div>

			{/* Grid layout for sections */}
			<section className="space-y-10 w-full">
				{/* Error Block */}
				<div className="bg-background/70 hover:bg-background/90 transition-all rounded">
					<h2 className="font-title uppercase text-lg mb-3 tracking-wide">🧨 Error</h2>
					<slot name="Error" />
				</div>

				{/* Recording Section */}
				<div className="border border-caution-border bg-background/60 p-6">
					<h2 className="text-sm font-bold text-caution-foreground mb-2 uppercase tracking-wide">🎥 Recordings</h2>
					<slot name="Recording" />
				</div>

				{/* Payload Section */}
				<div className="border border-note-border bg-background/60 p-6">
					<h2 className="text-sm font-bold text-note-foreground mb-2 uppercase tracking-wide">📦 Payload Snapshot</h2>
					<slot name="Payload" />
				</div>
			</section>
		</main>,
	),

	ErrorActors.VHX.Slot('Error', c8 => <ErrorHero error={c8.var('error')} />),
	ErrorActors.VHX.Slot('Recording', c8 => <RecordingBlock recording={c8.var('recording')} />),
	ErrorActors.VHX.Slot('Payload', c8 => <ErrorPayload payload={c8.var('payload')} />),
	ErrorActors.VHX.Finalize.Set('html'),
);

export default ErrorHandlerDirector.fin<string>(c8 => {
	console.log(c8.var);
	return c8.var('html');
});
