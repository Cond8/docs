import { createDirector } from '../_core';
import { C8Error } from '../_core/Recorder/C8Error';
import { DefaultHeaders } from '../_stage/components/default-headers';
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
	ErrorActors.VHX.Template(<></>),
);

export default ErrorHandlerDirector.fin<string>(c8 => c8.var.string('html'));
