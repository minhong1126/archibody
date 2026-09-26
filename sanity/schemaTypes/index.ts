import { type SchemaTypeDefinition } from 'sanity';
import { projectSchema } from './projectSchema';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectSchema],
};
