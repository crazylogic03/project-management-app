import React, { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import '../styles/InviteModal.css';

const InviteModal = ({ isOpen, onClose, boardId }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    if (!isOpen) return null;

    const handleSendInvite = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:3000/api/invitations/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ boardId, email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Invitation sent successfully!' });
                setEmail('');
                setTimeout(() => {
                    onClose();
                    setMessage(null);
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to send invitation' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="invite-modal-overlay">
            <div className="invite-modal">
                <div className="invite-modal-header">
                    <h3>Invite to Project</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSendInvite}>
                    <div className="invite-input-group">
                        <Mail size={18} className="input-icon" />
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {message && <div className={`invite-message ${message.type}`}>{message.text}</div>}
                    <div className="invite-modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="send-invite-btn" disabled={loading}>
                            {loading ? 'Sending...' : <><Send size={16} /> Send Invite</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteModal;
