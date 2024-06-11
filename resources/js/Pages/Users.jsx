import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Users({ auth, users }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users</h2>}
        >
            <Head title="Users" />

            <div className="container" style={{margin:"100px"}}>
                <h2 className="text-2xl font-semibold mb-3">User List</h2>
                <ul className="space-y-2">
                    {users.map((user) => (
                        <li key={user.id} className="flex items-center border-b py-2">
                            <div className="mr-2">{user.name}</div>
                            <div className="text-gray-500">{user.email}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}
