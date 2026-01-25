import { useState, useMemo } from 'react';
import { editClientNote, deleteClientNote, addNote } from './actions';
import { Trash2, Pencil } from 'lucide-react';
import styles from './TaskSection.module.css';

export default function TaskLogSection({ client }: { client: any }) {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [type, setType] = useState('');
    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');

    const completedTasks = useMemo(() => {
        return client.tasks.filter((task: any) => {
            if (!task.completed) return false;
            if (type && task.type !== type) return false;
            if (dateFrom && new Date(task.updatedAt) < new Date(dateFrom)) return false;
            if (dateTo && new Date(task.updatedAt) > new Date(dateTo)) return false;
            return true;
        });
    }, [client.tasks, type, dateFrom, dateTo]);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        await addNote(client.id, newNote);
        setNewNote('');
    };

    const handleEditSave = async (id: number) => {
        await editClientNote(id, editContent);
        setEditingNoteId(null);
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
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                </select>
            </div>

            <h3 className={styles.logTitle}>Task Log</h3>
            {completedTasks.length === 0 ? (
                <p style={{ color: '#64748b' }}>No completed tasks for the selected filters.</p>
            ) : (
                <ul className={styles.logList}>
                    {completedTasks.map((task: any) => (
                        <li key={task.id} className={styles.logItem}>
                            <div className={styles.logMeta}>
                                <strong>{task.title}</strong>
                                <span>Completed: {new Date(task.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.logDetails}>
                                <span>Responsible: {client.contactName}</span>
                                <br />
                                <span>Follow-up: —</span>
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
                    <button onClick={handleAddNote} disabled={!newNote.trim()} className={styles.noteButton}>
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
                                        <button onClick={() => handleEditSave(note.id)} className={styles.noteButton}>
                                            Save
                                        </button>
                                        <button onClick={() => setEditingNoteId(null)} className={styles.cancelButton}>
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
