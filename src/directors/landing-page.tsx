// src/directors/landing-page.tsx
import { createDirector } from '../_core';
import { AppConduit } from '../conduits/AppConduit';

const LandingPageDirector = createDirector('landing-page director').init(input => ({
	conduit: new AppConduit(input),

}))

LandingPageDirector(

)
