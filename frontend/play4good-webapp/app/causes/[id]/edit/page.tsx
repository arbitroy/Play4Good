import { getCauseById } from '../../actions'
import CauseForm from '../../CauseForm'

export default async function EditCausePage({ params }: { params: { id: string } }) {
    const cause = await getCauseById(parseInt(params.id))

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-blue-900 mb-6">Edit Cause</h1>
                <CauseForm cause={cause} />
            </div>
        </div>
    )
}