// TaskLogSection.tsx - displays completed tasks with filters and notes for a client
'use client';

import { useState, useMemo } from 'react';
import { editClientNote, deleteClientNote, addNote } from './actions';
import { Trash2, Pencil } from 'lucide-react';
<<<<<<< HEAD
import styles from './TaskSection.module.css';
=======
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e

export default function TaskLogSection({ client }: { client: any }) {
    // Filter state
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [type, setType] = useState(''); // using priority as type
    const [status, setStatus] = useState('Completed'); // always completed for log

    // Note edit state
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [newNote, setNewNote] = useState('');

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        await addNote(client.id, newNote.trim());
        setNewNote('');
        window.location.reload();
    };

    // Filtered completed tasks
    const completedTasks = useMemo(() => {
        return client.tasks
            .filter((t: any) => t.completed)
            .filter((t: any) => {
                if (dateFrom && new Date(t.updatedAt) < new Date(dateFrom)) return false;
                if (dateTo && new Date(t.updatedAt) > new Date(dateTo)) return false;
                if (type && t.priority !== type) return false;
                return true;
            })
            .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [client.tasks, dateFrom, dateTo, type]);

    const handleEditSave = async (noteId: number) => {
        if (!editContent.trim()) return;
        await editClientNote(noteId, editContent.trim());
        setEditingNoteId(null);
        setEditContent('');
        // Force refresh - could re-fetch or rely on revalidation
        window.location.reload();
    };

    return (
<<<<<<< HEAD
        <div className={styles.logSection}>
            <div className={styles.filters}>
=======
        <div style={{ padding: '1rem' }}>
            {/* Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="From"
<<<<<<< HEAD
                    className={styles.filterInput}
=======
                    style={{ padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem' }}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                />
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="To"
<<<<<<< HEAD
                    className={styles.filterInput}
=======
                    style={{ padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem' }}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
<<<<<<< HEAD
                    className={styles.filterSelect}
=======
                    style={{ padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem' }}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                >
                    <option value="">All Types</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            {/* Task Log */}
<<<<<<< HEAD
            <h3 className={styles.logTitle}>Task Log</h3>
            {completedTasks.length === 0 ? (
                <p style={{ color: '#64748b' }}>No completed tasks for the selected filters.</p>
            ) : (
                <ul className={styles.logList}>
                    {completedTasks.map((task: any) => (
                        <li
                            key={task.id}
                            className={styles.logItem}
                        >
                            <div className={styles.logMeta}>
                                <strong>{task.title}</strong>
                                <span>
                                    Completed: {new Date(task.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={styles.logDetails}>
=======
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Task Log</h3>
            {completedTasks.length === 0 ? (
                <p style={{ color: '#64748b' }}>No completed tasks for the selected filters.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {completedTasks.map((task: any) => (
                        <li
                            key={task.id}
                            style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.375rem',
                                padding: '0.75rem',
                                marginBottom: '0.5rem',
                                backgroundColor: '#f8fafc',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>{task.title}</strong>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    Completed: {new Date(task.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                {/* Placeholder for responsible team member and follow‑up actions */}
                                <span>Responsible: {client.contactName}</span>
                                <br />
                                <span>Follow‑up: —</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

<<<<<<< HEAD
            <div className={styles.notesWrap}>
                <h3 className={styles.logTitle}>Client Notes</h3>

                <div style={{ marginBottom: '1rem' }}>
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a new note..."
                        rows={2}
                        className={styles.noteInput}
                    />
                    <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className={styles.noteButton}
                    >
                        Add Note
                    </button>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    {client.notes.map((note: any) => (
                        <div key={note.id} className={styles.noteCard}>
=======
            {/* Notes Section */}
            <h3 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Client Notes</h3>

            <div style={{ marginBottom: '1rem' }}>
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
                        marginBottom: '0.5rem',
                    }}
                />
                <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: newNote.trim() ? '#3b82f6' : '#cbd5e1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: newNote.trim() ? 'pointer' : 'not-allowed',
                    }}
                >
                    Add Note
                </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                {client.notes.map((note: any) => (
                    <div
                        key={note.id}
                        style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.375rem',
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            backgroundColor: '#fff',
                        }}
                    >
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                        {editingNoteId === note.id ? (
                            <div>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={3}
<<<<<<< HEAD
                                    className={styles.noteInput}
=======
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem' }}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                />
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEditSave(note.id)}
<<<<<<< HEAD
                                        className={styles.noteButton}
=======
                                        style={{ padding: '0.25rem 0.5rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.25rem' }}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingNoteId(null)}
<<<<<<< HEAD
                                        className={styles.cancelButton}
=======
                                        style={{ padding: '0.25rem 0.5rem', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '0.25rem' }}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ margin: 0 }}>{note.content}</p>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                        {new Date(note.createdAt).toLocaleString()}
                                    </span>
                                </div>
<<<<<<< HEAD
                                <div className={styles.noteActions}>
=======
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                    <button
                                        onClick={() => {
                                            setEditingNoteId(note.id);
                                            setEditContent(note.content);
                                        }}
                                        title="Edit note"
<<<<<<< HEAD
                                        className={styles.noteActionButton}
=======
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (confirm('Delete this note?')) {
                                                await deleteClientNote(note.id);
                                                window.location.reload();
                                            }
                                        }}
                                        title="Delete note"
<<<<<<< HEAD
                                        className={`${styles.noteActionButton} ${styles.noteDeleteButton}`}
=======
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
<<<<<<< HEAD
                        </div>
                    ))}
                </div>
=======
                    </div>
                ))}
>>>>>>> 3e2ac0d59dc6241e9562d18fc027f13f7ec37d5e
            </div>
        </div>
    );
}
