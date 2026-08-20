'use client';

import ProtectedRoute from '../components/protected-route/ProtectedRoute';

function TestEContent() {
    return (
        <div className="p-8 text-center text-xl font-bold">testENT</div>
    );
}

export default function TestE() {
    return (
        <ProtectedRoute>
            <TestEContent />
        </ProtectedRoute>
    );
}
