// TaskLogSection.tsx - displays completed tasks with filters and notes for a client
'use client';

import { useState, useMemo } from 'react';
import { editClientNote, deleteClientNote, addNote } from './actions';
import { Trash2, Pencil } from 'lucide-react';
import styles from './TaskSection.module.css';

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
        <div className={styles.logSection}>
            <div className={styles.filters}>
                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="From"
                    className={styles.filterInput}
                />
                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="To"
                    className={styles.filterInput}
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={styles.filterSelect}
                >
                    <option value="">All Types</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            {/* Task Log */}
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
                                {/* Placeholder for responsible team member and follow‑up actions */}
                                <span>Responsible: {client.contactName}</span>
                                <br />
                                <span>Follow‑up: —</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

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
                        {editingNoteId === note.id ? (
                            <div>
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    rows={3}
                                    className={styles.noteInput}
                                />
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleEditSave(note.id)}
                                        className={styles.noteButton}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingNoteId(null)}
                                        className={styles.cancelButton}
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
                                <div className={styles.noteActions}>
                                    <button
                                        onClick={() => {
                                            setEditingNoteId(note.id);
                                            setEditContent(note.content);
                                        }}
                                        title="Edit note"
                                        className={styles.noteActionButton}
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
                                        className={`${styles.noteActionButton} ${styles.noteDeleteButton}`}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
