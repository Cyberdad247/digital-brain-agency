import { CRMBeacon } from './CRMBeacon';
import { FlowForge } from './FlowForge';
import { SocialSpark } from './SocialSpark';
import { InsightOracle } from './InsightOracle';

export const personas = {
  CRMBeacon,
  FlowForge,
  SocialSpark,
  InsightOracle
};

export type Persona = keyof typeof personas;
