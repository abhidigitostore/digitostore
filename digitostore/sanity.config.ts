import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import documents from './schemaTypes/documents'
import submissions from './schemaTypes/submissions'
import category from './schemaTypes/category'

export default defineConfig({
  name: 'default',
  title: 'digitostore',

  projectId: 'lhckr2ny',
  dataset: 'production',
  schema: {
    // 2. Add the category to the types array
    types: [documents, submissions, category],
  },
  plugins: [structureTool(), visionTool()],
})
