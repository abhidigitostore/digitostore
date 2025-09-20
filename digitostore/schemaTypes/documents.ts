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
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}], // This links it to the 'category' schema we created
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true, // This allows for better image cropping in the Studio
      },
    }),
  ],
})