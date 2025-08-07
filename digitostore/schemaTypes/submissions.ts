// studio/schemaTypes/submission.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'submissions',
  title: 'Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'purpose',
      title: 'Purpose',
      type: 'string',
    }),
    defineField({
      name: 'consent',
      title: 'Consent',
      type: 'boolean',
    }),
    defineField({
        name: 'paymentStatus',
        title: 'Payment Status',
        type: 'string',
        initialValue: 'pending',
    }),
    defineField({
        name: 'requestedDoc',
        title: 'Requested Document',
        type: 'reference',
        to: {type: 'documents'},
    }),
  ],
})