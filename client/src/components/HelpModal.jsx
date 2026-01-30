import React, { useState } from "react";
import { X, Search, ChevronRight, Mail, FileText, ExternalLink } from "lucide-react";
import "../styles/HelpModal.css";

const HelpModal = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const faqs = [
        {
            id: 1,
            question: "How do I create a new project?",
            answer: "Go to the Projects page and click the 'New Project' button in the top right corner. Fill in the details and click Create."
        },
        {
            id: 2,
            question: "Can I invite external members?",
            answer: "Yes! In your project settings, look for the 'Team' section. You can invite members via email."
        },
        {
            id: 3,
            question: "How do I change my theme?",
            answer: "Click the moon/sun icon in the top navigation bar to toggle between light and dark modes."
        },
        {
            id: 4,
            question: "Where can I see my tasks?",
            answer: "The Dashboard gives you an overview, but the 'Task Detail' page shows a comprehensive list of all your assigned tasks."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="help-modal-overlay" onClick={onClose}>
            <div className="help-modal-content" onClick={e => e.stopPropagation()}>
                <button className="help-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="help-header">
                    <h2>How can we help?</h2>
                    <div className="help-search">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for help..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="help-body">
                    <section className="help-section">
                        <h3>Frequently Asked Questions</h3>
                        <div className="faq-list">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map(faq => (
                                    <div key={faq.id} className="faq-item">
                                        <div className="faq-question">
                                            <span className="icon-box"><FileText size={14} /></span>
                                            <h4>{faq.question}</h4>
                                        </div>
                                        <p className="faq-answer">{faq.answer}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-results">No results found for "{searchQuery}"</p>
                            )}
                        </div>
                    </section>

                    <section className="help-section">
                        <h3>Need more support?</h3>
                        <div className="support-links">
                            <a href="mailto:support@projectmanager.com" className="support-card">
                                <Mail size={24} />
                                <div>
                                    <h4>Contact Support</h4>
                                    <p>Get in touch with our team</p>
                                </div>
                                <ChevronRight size={16} className="arrow" />
                            </a>
                            <a href="#" className="support-card secondary">
                                <ExternalLink size={24} />
                                <div>
                                    <h4>Documentation</h4>
                                    <p>Read detailed guides</p>
                                </div>
                                <ChevronRight size={16} className="arrow" />
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
