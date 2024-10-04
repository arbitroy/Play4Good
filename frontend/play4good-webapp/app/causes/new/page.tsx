import CauseForm from '../CauseForm'

export default function NewCausePage() {
    return (
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-blue-900 mb-6">Create New Cause</h1>
                <CauseForm />
            </div>
        </div>
    )
}