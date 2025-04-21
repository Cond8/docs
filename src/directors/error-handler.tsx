// src/directors/error-handler.tsx
import { createDirector } from '../_core';
import { C8Error } from '../_core/Recorder/C8Error';
import { CopyButton } from '../_stage/components/copy-button';
import { DefaultHeaders } from '../_stage/components/default-headers';
import { ErrorHeader } from '../_stage/components/error/error-header';
import { ErrorHero } from '../_stage/components/error/error-hero';
import { ErrorPayload } from '../_stage/components/error/error-payload';
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
	ErrorActors.VHX.Template(c8 => (
		<main id="error-page" className="min-h-screen w-full max-w-[1024px] mx-auto px-4 py-8 font-mono text-foreground bg-background">
			<div className="w-full flex justify-center">
				<ErrorHeader />
			</div>

			{/* Grid layout for sections */}
			<section className="space-y-10 w-full">
				{/* Error Block */}
				<div className="bg-background/70 hover:bg-background/90 transition-all rounded">
					<div className="flex justify-between items-center">
						<h2 className="font-title uppercase text-lg mb-3 tracking-wide">🧨 Error</h2>
						<CopyButton copyData={c8.var('llm text')}>Copy Error</CopyButton>
					</div>
					<ErrorHero error={c8.var('error')} />
				</div>

				{/* Recording Section */}
				{c8.var.has('recording') ? (
					<div className="border border-caution-border bg-background/60 p-6">
						<h2 className="text-sm font-bold text-caution-foreground mb-2 uppercase tracking-wide">🎥 Recordings</h2>
						<RecordingBlock recording={c8.var('recording')} />
					</div>
				) : null}

				{/* Payload Section */}
				<div className="border border-note-border bg-background/60 p-6">
					<h2 className="text-sm font-bold text-note-foreground mb-2 uppercase tracking-wide">📦 Payload Snapshot</h2>
					<ErrorPayload payload={c8.var('payload')} />
				</div>
			</section>
		</main>
	)),

	ErrorActors.VHX.Finalize.Set('html'),
);

export default ErrorHandlerDirector.fin<string>(c8 => {
	return c8.var('html');
});
