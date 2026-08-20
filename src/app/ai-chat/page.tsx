'use client';

import ProtectedRoute from '../components/protected-route/ProtectedRoute';

function AiChatContent() {
    return (
        <>
        <div className="p-8 text-center text-xl font-bold">
            AI Агент беті
        </div>
        <div className="p-8 text-center text-xl font-bold">
            AI Агент беті
        </div>
        <div className="p-8 text-center text-xl font-bold">
            AI Агент беті
        </div>
        <div className="p-8 text-center text-xl font-bold">
            AI Агент беті
        </div>
        <div className="p-8 text-center text-xl font-bold">
            AI Агент беті
        </div>
        <div className="p-8 text-center text-xl font-bold">
            AI Агент беті
        </div>
        <div className="p-8 text-center text-xl font-bold">
            AI Агент беті
        </div>
        </>
        
    );
}

export default function AiChatPage() {
    return (
        <ProtectedRoute>
            <AiChatContent />
        </ProtectedRoute>
    );
}
