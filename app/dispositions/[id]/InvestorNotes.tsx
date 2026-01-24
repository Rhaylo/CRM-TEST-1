'use client';

import { useState } from 'react';
import { addInvestorNote, deleteInvestorNote } from '../actions';
import { Trash2 } from 'lucide-react';

export default function InvestorNotes({ investorId, notes }: { investorId: number, notes: any[] }) {
    const [newNote, setNewNote] = useState('');

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        await addInvestorNote(investorId, newNote.trim());
        setNewNote('');
    };

    const handleDeleteNote = async (noteId: number) => {
        if (confirm('Delete this note?')) {
            await deleteInvestorNote(noteId, investorId);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this investor..."
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        marginBottom: '0.5rem',
                        resize: 'vertical',
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: newNote.trim() ? '#2563eb' : '#cbd5e1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: newNote.trim() ? 'pointer' : 'not-allowed',
                            fontWeight: '500',
                        }}
                    >
                        Add Note
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notes.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>No notes yet.</p>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} style={{
                            padding: '1rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    {new Date(note.createdAt).toLocaleString()}
                                </span>
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}
                                    title="Delete note"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <p style={{ color: '#334155', fontSize: '0.875rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                {note.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
