'use client';

// TODO: unused

import { SourceReleaseSchema } from '@/prisma/generated/zod';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewReleasePage() {
  const router = useRouter();
  const [error, setError] = useState('');

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Create New Release</h1>

      <Formik
        initialValues={Object.fromEntries(
          Object.entries(SourceReleaseSchema.shape).map(([key]) => [
            key,
            key === 'visibility'
              ? 'PRIVATE'
              : key === 'urls' || key === 'defaultUmapSourceIds'
              ? []
              : key === 'isNewUi' || key === 'featured'
              ? false
              : '',
          ]),
        )}
        onSubmit={async (values) => {
          try {
            const res = await fetch('/api/sae/release/new', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...values,
              }),
            });

            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.error || 'Failed to create release');
            }

            const release = await res.json();
            router.push(`/sae/release/${release.name}`);
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError('An unknown error occurred');
            }
          }
        }}
      >
        <Form className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium">
              Name
              <Field
                type="text"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </label>
          </div>

          <div>
            <label htmlFor="description" className="block font-medium">
              Description
              <Field
                as="textarea"
                name="description"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </label>
          </div>

          <div>
            <label htmlFor="descriptionShort" className="block font-medium">
              Description (Short)
              <Field
                type="text"
                name="descriptionShort"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </label>
          </div>

          <div>
            <label htmlFor="creatorName" className="block font-medium">
              Creator Name
              <Field
                type="text"
                name="creatorName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </label>
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <button type="submit" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Create Release
          </button>
        </Form>
      </Formik>
    </div>
  );
}
