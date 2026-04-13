import { useEffect, useMemo, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import AdminTopNav from '../Admin/AdminTopNav';
import { formatPortalDateTime } from '../../utils/portalDate';
import '../Admin/AdminCategories.css';
import './PortalShell.css';

const attachmentLabel = (attachment) => attachment?.name || attachment?.url?.split('/').pop() || 'Attachment';

const AdminMessagesPage = () => {
  const [staff, setStaff] = useState([]);
  const [threads, setThreads] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [thread, setThread] = useState(null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadLists = async () => {
    setLoading(true);
    try {
      const [staffResponse, threadsResponse] = await Promise.all([
        portalApi.get('/admin-portal/staff', 'admin'),
        portalApi.get('/admin-portal/messages', 'admin'),
      ]);
      const nextStaff = staffResponse.data.staff || [];
      const nextThreads = threadsResponse.data.threads || [];
      setStaff(nextStaff);
      setThreads(nextThreads);
      if (!selectedStaffId) {
        setSelectedStaffId(nextThreads[0]?.staffUser?._id || nextStaff[0]?._id || '');
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadThread = async (staffId, markRead = true) => {
    if (!staffId) {
      setThread(null);
      return;
    }
    setThreadLoading(true);
    try {
      const response = await portalApi.get(`/admin-portal/messages/${staffId}`, 'admin');
      const nextThread = response.data.thread;
      setThread(nextThread);
      if (markRead) {
        const unread = (nextThread.messages || []).some(
          (entry) => entry.senderRole === 'sales_staff' && !entry.readByAdmin
        );
        if (unread) {
          await portalApi.patch(`/admin-portal/messages/${staffId}/read`, {}, 'admin');
          setThread((current) =>
            current
              ? {
                  ...current,
                  messages: current.messages.map((entry) =>
                    entry.senderRole === 'sales_staff' ? { ...entry, readByAdmin: true } : entry
                  ),
                }
              : current
          );
          setThreads((current) =>
            current.map((entry) =>
              entry.staffUser?._id === staffId ? { ...entry, unreadStaffCount: 0 } : entry
            )
          );
        }
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (selectedStaffId) {
      loadThread(selectedStaffId);
    }
  }, [selectedStaffId]);

  const threadSummaryByStaff = useMemo(
    () => new Map(threads.map((entry) => [entry.staffUser?._id, entry])),
    [threads]
  );

  const filteredStaff = useMemo(() => {
    const term = String(search || '').trim().toLowerCase();
    if (!term) return staff;
    return staff.filter((member) =>
      [member.name, member.username, member.email, member.phone, member.department]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [search, staff]);

  const orderedMessages = useMemo(
    () =>
      [...(thread?.messages || [])].sort(
        (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
      ),
    [thread]
  );

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setMessage('');
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const url = await portalApi.uploadFile(file, 'admin');
          return {
            name: file.name,
            url,
            mimeType: file.type,
          };
        })
      );
      setAttachments((current) => [...current, ...uploaded]);
    } catch (err) {
      setMessage(err.message || 'Attachment upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!selectedStaffId) {
      setMessage('Select a staff member first.');
      return;
    }
    if (!draft.trim() && !attachments.length) {
      setMessage('Add a message or attachment first.');
      return;
    }
    setSending(true);
    setMessage('');
    try {
      const response = await portalApi.post(
        `/admin-portal/messages/${selectedStaffId}`,
        { text: draft.trim(), attachments },
        'admin'
      );
      setThread(response.data.thread);
      setDraft('');
      setAttachments([]);
      await loadLists();
      setSelectedStaffId(selectedStaffId);
      setMessage('Message sent to staff.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSending(false);
    }
  };

  const removeAttachment = (url) => {
    setAttachments((current) => current.filter((entry) => entry.url !== url));
  };

  return (
    <div className="admin-categories">
      <AdminTopNav />
      <section className="portal-page">
        <div className="portal-card">
          <div className="portal-section-head">
            <div>
              <div className="portal-brand-kicker">Office Communication</div>
              <h1 className="portal-section-title" style={{ fontSize: '1.8rem' }}>Staff Messages</h1>
              <p className="portal-section-copy">
                Keep admin and staff communication in one saved thread per staff member. Attach PDFs, photos, and supporting documents when needed.
              </p>
            </div>
          </div>
          {message && <div className="portal-message-banner success">{message}</div>}
        </div>

        <div className="portal-card portal-messages-layout">
          <div className="portal-thread-list-card">
            <div className="portal-section-head">
              <div>
                <div className="portal-brand-kicker">Staff list</div>
                <h2 className="portal-section-title" style={{ fontSize: '1.35rem' }}>Choose who to message</h2>
              </div>
            </div>
            <div className="portal-filter-bar" style={{ marginTop: '1rem' }}>
              <input
                type="search"
                placeholder="Search staff by name, email, or phone"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="portal-thread-list" style={{ marginTop: '1rem' }}>
              {loading ? (
                <div className="portal-empty-state">
                  <h3 className="portal-empty-title">Loading staff...</h3>
                </div>
              ) : filteredStaff.length ? (
                filteredStaff.map((member) => {
                  const summary = threadSummaryByStaff.get(member._id);
                  const preview = summary?.lastMessage?.text || (summary?.lastMessage?.attachments?.length ? `${summary.lastMessage.attachments.length} attachment(s)` : 'No messages yet');
                  return (
                    <button
                      key={member._id}
                      type="button"
                      className={`portal-thread-button${selectedStaffId === member._id ? ' is-selected' : ''}`}
                      onClick={() => setSelectedStaffId(member._id)}
                    >
                      <div className="portal-thread-title-row">
                        <strong>{member.name || member.username}</strong>
                        {summary?.unreadStaffCount ? <span className="portal-badge status">{summary.unreadStaffCount} new</span> : null}
                      </div>
                      <div className="portal-record-meta">
                        <span>{member.email}</span>
                        {member.phone && <span>{member.phone}</span>}
                      </div>
                      <div className="portal-thread-preview">{preview}</div>
                    </button>
                  );
                })
              ) : (
                <div className="portal-empty-state">
                  <h3 className="portal-empty-title">No staff match that search</h3>
                </div>
              )}
            </div>
          </div>

          <div className="portal-thread-panel">
            <div className="portal-section-head">
              <div>
                <div className="portal-brand-kicker">Saved thread</div>
                <h2 className="portal-section-title" style={{ fontSize: '1.35rem' }}>
                  {thread?.staffUser?.name || thread?.staffUser?.username || 'Select a staff member'}
                </h2>
                {thread?.staffUser ? (
                  <p className="portal-section-copy">
                    {thread.staffUser.email}
                    {thread.staffUser.phone ? ` • ${thread.staffUser.phone}` : ''}
                    {thread.staffUser.department ? ` • ${thread.staffUser.department}` : ''}
                  </p>
                ) : null}
              </div>
              {selectedStaffId ? (
                <button className="portal-inline-button ghost" type="button" onClick={() => loadThread(selectedStaffId, false)}>
                  Refresh
                </button>
              ) : null}
            </div>

            <div className="portal-conversation-window">
              {threadLoading ? (
                <div className="portal-empty-state">
                  <h3 className="portal-empty-title">Loading messages...</h3>
                </div>
              ) : orderedMessages.length ? (
                <div className="portal-message-stack">
                  {orderedMessages.map((entry) => (
                    <div
                      key={entry._id}
                      className={`portal-message-row ${entry.senderRole === 'admin' ? 'self' : 'office'}`}
                    >
                      <div className="portal-message-bubble">
                        <div className="portal-message-meta">
                          <strong>{entry.senderRole === 'admin' ? 'Admin' : entry.sender?.name || entry.sender?.username || 'Staff'}</strong>
                          <span>{formatPortalDateTime(entry.createdAt)}</span>
                        </div>
                        {entry.text && <p className="portal-message-copy">{entry.text}</p>}
                        {entry.attachments?.length ? (
                          <div className="portal-attachment-list">
                            {entry.attachments.map((attachment) => (
                              <a
                                key={`${entry._id}-${attachment.url}`}
                                className="portal-attachment-chip"
                                href={attachment.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {attachmentLabel(attachment)}
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="portal-empty-state">
                  <h3 className="portal-empty-title">No messages yet</h3>
                  <p className="portal-empty-copy">Send the first message below to start this staff thread.</p>
                </div>
              )}
            </div>

            <form className="portal-message-composer" onSubmit={sendMessage}>
              <label className="portal-field">
                <span>Write a message to staff</span>
                <textarea
                  rows="4"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Share instructions, updates, or follow-up details..."
                />
              </label>

              <div className="portal-inline-actions">
                <label className="portal-inline-button secondary portal-file-label">
                  {uploading ? 'Uploading...' : 'Attach Files'}
                  <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={handleFiles} hidden />
                </label>
                <button className="portal-inline-button ghost" type="button" onClick={() => { setDraft(''); setAttachments([]); }}>
                  Clear
                </button>
              </div>

              {attachments.length ? (
                <div className="portal-attachment-list editor">
                  {attachments.map((attachment) => (
                    <button
                      key={attachment.url}
                      type="button"
                      className="portal-attachment-chip removable"
                      onClick={() => removeAttachment(attachment.url)}
                    >
                      {attachmentLabel(attachment)} ×
                    </button>
                  ))}
                </div>
              ) : null}

              <button className="portal-button primary portal-save-button" type="submit" disabled={sending || uploading || !selectedStaffId}>
                {sending ? 'Sending...' : 'Send to Staff'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminMessagesPage;
