import { createDirector } from '../_core';
import { C8Error } from '../_core/Recorder/C8Error';
import { DocsConduit } from '../_stage/conduits/DocsConduit';
import { ErrorActors, ErrorConduit } from '../_stage/conduits/ErrorConduit';

const ErrorHandlerDirector = createDirector<ErrorConduit>('Error Handler Director').init<C8Error<DocsConduit>>(error => ({
	conduit: new ErrorConduit(error),
}));

ErrorHandlerDirector(
	ErrorActors.Modeler(c8 => {
		const { directorPayload, payload, recording } = c8.body;
		const error = c8.body as Error;

		c8.var('director payload', directorPayload);
		c8.var('actor payload', payload);
		c8.var('recording', recording);
		c8.var('error', error);

		return c8;
	}),
	ErrorActors.Modeler(c8 => {
		const director = c8.var('director payload');
		const actor = c8.var('actor payload');

		return c8;
	}),
);

export default ErrorHandlerDirector.fin<string>(c8 => c8.var.string('html'));
