import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, Loader } from 'lucide-react';
import '../styles/InvitationHandler.css';

const InvitationHandler = () => {
    const { token, action } = useParams();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        // Fetch invitation details
        fetch(`http://localhost:3000/api/invitations/${token}`)
            .then(res => {
                if (!res.ok) throw new Error("Invalid invitation");
                return res.json();
            })
            .then(data => {
                setInvitation(data);
                setLoading(false);

                // If action is present in URL, trigger it automatically
                if (action && (action === 'accept' || action === 'decline')) {
                    handleAction(action, data);
                }
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [token, action]);

    const handleAction = async (act, inviteData = invitation) => {
        setActionLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            // Store return URL to redirect back after login
            localStorage.setItem('returnUrl', `/invite/${token}/${act}`);
            alert("Please login first to accept the invitation");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/invitations/${act}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, userId: user.id })
            });

            if (response.ok) {
                if (act === 'accept') {
                    // Redirect to the specific project or chat
                    // For now, projects list is safe
                    navigate('/projects');
                } else {
                    navigate('/');
                }
            } else {
                const data = await response.json();
                // If already member, just redirect
                if (data.message === "User is already a member of this board") {
                    navigate('/projects');
                } else {
                    alert(data.message);
                    // If auto-action failed, maybe clear action from URL so they can try manual or see error
                    navigate(`/invite/${token}`);
                }
            }
        } catch (err) {
            alert("Action failed");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="invitation-page"><Loader className="spin" /> Loading invitation...</div>;
    if (error) return <div className="invitation-page error"><h3>Error</h3><p>{error}</p></div>;

    return (
        <div className="invitation-page">
            <div className="invitation-card">
                <div className="invitation-icon">
                    <span>✉️</span>
                </div>
                <h2>Project Invitation</h2>
                <p>You have been invited to join the project <strong>{invitation.board.title}</strong>.</p>

                {actionLoading ? (
                    <div className="processing-action">
                        <Loader className="spin" /> Processing {action}...
                    </div>
                ) : (
                    <div className="invitation-actions">
                        <button
                            className="accept-btn"
                            onClick={() => handleAction('accept')}
                            disabled={actionLoading}
                        >
                            <Check size={18} /> Accept
                        </button>
                        <button
                            className="decline-btn"
                            onClick={() => handleAction('decline')}
                            disabled={actionLoading}
                        >
                            <X size={18} /> Decline
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvitationHandler;
