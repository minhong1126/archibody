import { type SchemaTypeDefinition } from 'sanity';
import { openhouseSchema } from './openhouseSchema';
import { projectSchema } from './projectSchema';
import { workshopSchema } from './workshopSchema';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectSchema, workshopSchema, openhouseSchema],
};
