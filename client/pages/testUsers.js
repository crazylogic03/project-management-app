import { useEffect, useState } from "react";

export default function TestUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Users</h1>
            <ul>
                {users.length === 0 && <li>No users found</li>}
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}
