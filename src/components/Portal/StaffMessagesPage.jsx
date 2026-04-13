import { useEffect, useMemo, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import { formatPortalDateTime } from '../../utils/portalDate';
import './PortalShell.css';

const draftKey = 'staff-draft:messages';

const attachmentLabel = (attachment) => attachment?.name || attachment?.url?.split('/').pop() || 'Attachment';

const StaffMessagesPage = () => {
  const [thread, setThread] = useState(null);
  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const unreadCount = thread?.unreadAdminCount || 0;

  const loadThread = async (markRead = true) => {
    setLoading(true);
    try {
      const response = await portalApi.get('/staff-portal/messages', 'sales_staff');
      const nextThread = response.data.thread;
      setThread(nextThread);
      if (markRead && nextThread?.unreadAdminCount) {
        await portalApi.patch('/staff-portal/messages/read', {}, 'sales_staff');
        setThread((current) =>
          current
            ? {
                ...current,
                unreadAdminCount: 0,
                messages: current.messages.map((entry) =>
                  entry.senderRole === 'admin' ? { ...entry, readByStaff: true } : entry
                ),
              }
            : current
        );
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThread();
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.text) setDraft(parsed.text);
      if (Array.isArray(parsed.attachments)) setAttachments(parsed.attachments);
    } catch (error) {
      // ignore malformed drafts
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(draftKey, JSON.stringify({ text: draft, attachments }));
  }, [attachments, draft]);

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
          const url = await portalApi.uploadFile(file, 'sales_staff');
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

  const removeAttachment = (url) => {
    setAttachments((current) => current.filter((entry) => entry.url !== url));
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!draft.trim() && !attachments.length) {
      setMessage('Add a message or at least one attachment.');
      return;
    }
    setSending(true);
    setMessage('');
    try {
      const response = await portalApi.post(
        '/staff-portal/messages',
        {
          text: draft.trim(),
          attachments,
        },
        'sales_staff'
      );
      setThread(response.data.thread);
      setDraft('');
      setAttachments([]);
      localStorage.removeItem(draftKey);
      setMessage('Message sent to the office.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="portal-page">
      <div className="portal-card dark">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Office Communication</div>
            <h1 className="portal-section-title">Messages and Attachments</h1>
            <p className="portal-section-copy" style={{ color: 'rgba(255,255,255,0.76)' }}>
              Send updates, PDFs, photos, and supporting files directly to the office. All messages stay saved in your account history.
            </p>
          </div>
          <div className="portal-inline-actions">
            <div className="portal-stat compact">
              <div className="portal-stat-value">{orderedMessages.length}</div>
              <div className="portal-stat-label">Total messages</div>
            </div>
            <div className="portal-stat compact">
              <div className="portal-stat-value">{unreadCount}</div>
              <div className="portal-stat-label">Unread from office</div>
            </div>
          </div>
        </div>
      </div>

      <div className="portal-card portal-help-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">How to use this</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Keep field communication in one place</h2>
            <p className="portal-section-copy">
              Use this page for updates that need office attention. You can attach photos, PDFs, and supporting files before pressing send.
            </p>
          </div>
        </div>
      </div>

      <div className="portal-card">
        <div className="portal-section-head">
          <div>
            <div className="portal-brand-kicker">Saved thread</div>
            <h2 className="portal-section-title" style={{ fontSize: '1.45rem' }}>Your office chat</h2>
          </div>
          <button className="portal-inline-button ghost" type="button" onClick={() => loadThread(false)}>
            Refresh
          </button>
        </div>

        {message && <div className="portal-message-banner success">{message}</div>}

        <div className="portal-thread-panel">
          <div className="portal-conversation-window">
            {loading ? (
              <div className="portal-empty-state">
                <h3 className="portal-empty-title">Loading messages...</h3>
              </div>
            ) : orderedMessages.length ? (
              <div className="portal-message-stack">
                {orderedMessages.map((entry) => (
                  <div
                    key={entry._id}
                    className={`portal-message-row ${entry.senderRole === 'sales_staff' ? 'self' : 'office'}`}
                  >
                    <div className="portal-message-bubble">
                      <div className="portal-message-meta">
                        <strong>{entry.senderRole === 'sales_staff' ? 'You' : 'Office'}</strong>
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
                <p className="portal-empty-copy">Start the thread below and the office will see your message in their panel.</p>
              </div>
            )}
          </div>

          <form className="portal-message-composer" onSubmit={sendMessage}>
            <label className="portal-field">
              <span>Type your update</span>
              <textarea
                rows="4"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write the message for the office here..."
              />
            </label>

            <div className="portal-inline-actions">
              <label className="portal-inline-button secondary portal-file-label">
                {uploading ? 'Uploading...' : 'Attach Files'}
                <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={handleFiles} hidden />
              </label>
              <button className="portal-inline-button ghost" type="button" onClick={() => { setDraft(''); setAttachments([]); localStorage.removeItem(draftKey); }}>
                Clear Draft
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

            <button className="portal-button primary portal-save-button" type="submit" disabled={sending || uploading}>
              {sending ? 'Sending...' : 'Send to Office'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default StaffMessagesPage;
