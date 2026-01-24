'use client';

import { useState } from 'react';
import { createNote, deleteNote } from './noteActions';
import { Trash2, Plus } from 'lucide-react';

export default function TaskNotesSection({ taskId, notes }: { taskId: number; notes: any[] }) {
    const [newNote, setNewNote] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        setIsAdding(true);
        try {
            await createNote(taskId, newNote);
            setNewNote('');
        } catch (error) {
            alert('Failed to add note');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteNote = async (noteId: number) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await deleteNote(noteId);
        } catch (error) {
            alert('Failed to delete note');
        }
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const noteDate = new Date(date);
        const diffMs = now.getTime() - noteDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return noteDate.toLocaleDateString();
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Notes
            </label>

            {/* Notes List */}
            <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '1rem',
                border: notes.length > 0 ? '1px solid #e2e8f0' : 'none',
                borderRadius: '0.375rem',
            }}>
                {notes.length === 0 ? (
                    <p style={{
                        color: '#94a3b8',
                        fontSize: '0.875rem',
                        padding: '1rem',
                        textAlign: 'center',
                        fontStyle: 'italic'
                    }}>
                        No notes yet. Add your first note below.
                    </p>
                ) : (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '0.5rem',
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    margin: '0 0 0.25rem 0',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.5',
                                }}>
                                    {note.content}
                                </p>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.75rem',
                                    color: '#64748b',
                                }}>
                                    {formatDate(note.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeleteNote(note.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#ef4444',
                                    padding: '0.25rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                title="Delete note"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Note Section */}
            <div>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a new note..."
                    rows={2}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                        marginBottom: '0.5rem',
                    }}
                />
                <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isAdding}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: newNote.trim() && !isAdding ? '#3b82f6' : '#cbd5e1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: newNote.trim() && !isAdding ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <Plus size={16} />
                    {isAdding ? 'Adding...' : 'Add Note'}
                </button>
            </div>
        </div>
    );
}
