// studio/schemaTypes/document.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'documents',
  title: 'Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'dataFile',
      title: 'Data File',
      type: 'file',
    }),
  ],
})