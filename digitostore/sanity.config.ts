import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import documents from './schemaTypes/documents'
import submissions from './schemaTypes/submissions'

export default defineConfig({
  name: 'default',
  title: 'digitostore',

  projectId: 'lhckr2ny',
  dataset: 'production',
  schema: {
    // types: schemaTypes,
    // 2. Add your schemas to the array
    types: [documents, submissions],
  },
  plugins: [structureTool(), visionTool()],
  
})

