import { createDirector } from '../_core';
import { C8Error } from '../_core/Recorder/C8Error';
import { AppConduit } from '../_stage/conduits/AppConduit';

const ErrorHandlerDirector = createDirector('Error Handler Director').init<C8Error<AppConduit>>(error => ({
	conduit: new AppConduit(error),
}));
