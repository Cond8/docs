import { createDirector } from '../_core';
import { C8Error } from '../_core/Recorder/C8Error';
import { DocsConduit } from '../_stage/conduits/DocsConduit';
import { ErrorConduit } from '../_stage/conduits/ErrorConduit';
import { ErrorBodyParser } from './error-directors/body-parser';

const ErrorHandlerDirector = createDirector<ErrorConduit>('Error Handler Director').init<C8Error<DocsConduit>>(error => ({
	conduit: new ErrorConduit(error),
}));

ErrorHandlerDirector(ErrorBodyParser.AsActor);

export default ErrorHandlerDirector.fin<string>(c8 => c8.var.string('html'));
