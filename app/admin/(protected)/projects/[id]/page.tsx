import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getProjectById } from '@/lib/actions/project-actions'
import { ProjectEditor } from '@/components/admin/project-editor/ProjectEditor'

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  const result = await getProjectById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <Suspense fallback={null}>
      <ProjectEditor project={result.data} />
    </Suspense>
  )
}
