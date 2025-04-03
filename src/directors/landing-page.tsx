import { createDirector } from '../Cond8';
import { AppConduit } from '../conduits/AppConduit';

const landingPageDirector = createDirector('landing-page director').init(input => ({
	conduit: new AppConduit(input),

}))
