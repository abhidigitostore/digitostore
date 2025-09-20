// studio/schemaTypes/submissions.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'submissions',
  title: 'Submissions',
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
        name: 'orderId',
        title: 'Razorpay Order ID',
        type: 'string',
    }),
    defineField({
        name: 'requestedDocs', 
        title: 'Requested Documents',
        type: 'array', 
        of: [{ 
            type: 'reference',
            to: {type: 'documents'},
            weak: true,
        }]
    }),
  ],
})