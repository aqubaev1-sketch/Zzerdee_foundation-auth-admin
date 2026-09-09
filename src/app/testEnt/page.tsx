'use client';
import EnhancedFloatingCalculator from '../components/ui/EnhancedFloatingCalculator';


import ProtectedRoute from '../components/protected-route/ProtectedRoute';

function TestEContent() {
    return (
        <>
        <div className="p-8 text-center text-xl font-bold">testENT</div>
        <EnhancedFloatingCalculator initialPosition={{ x: 30, y: 30 }} />
        </>
        
    );
}

export default function TestE() {
    return (
        <ProtectedRoute>
            <TestEContent />
        </ProtectedRoute>
    );
}
