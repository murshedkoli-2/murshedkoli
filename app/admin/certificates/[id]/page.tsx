import { CertificateForm } from '@/components/admin/certificates/CertificateForm'

interface EditCertificatePageProps {
  params: Promise<{ id: string }>
}

export default async function EditCertificatePage({ params }: EditCertificatePageProps) {
  const { id } = await params
  return <CertificateForm certificateId={id} />
}
