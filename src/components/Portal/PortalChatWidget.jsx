import { useCallback, useEffect, useMemo, useState } from 'react';
import { portalApi } from '../../services/portalApi';
import { formatPortalDateTime } from '../../utils/portalDate';
import './PortalShell.css';

const attachmentLabel = (attachment) => attachment?.name || attachment?.url?.split('/').pop() || 'Attachment';

const PortalChatWidget = ({ role = 'sales_staff' }) => {
  const isAdmin = role === 'admin';
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 640 : false));
  const [threads, setThreads] = useState([]);
  const [thread, setThread] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalUnread = useMemo(() => {
    if (isAdmin) return threads.reduce((sum, entry) => sum + (entry.unreadStaffCount || 0), 0);
    return thread?.unreadAdminCount || 0;
  }, [isAdmin, thread, threads]);

  const loadStaffThread = useCallback(async (markRead = false) => {
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
  }, []);

  const loadAdminList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await portalApi.get('/admin-portal/messages', 'admin');
      const nextThreads = response.data.threads || [];
      setThreads(nextThreads);
      if (!selectedStaffId && nextThreads[0]?.staffUser?._id) {
        setSelectedStaffId(nextThreads[0].staffUser._id);
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedStaffId]);

  const loadAdminThread = useCallback(async (staffId, markRead = false) => {
    if (!staffId) return;
    setLoading(true);
    try {
      const response = await portalApi.get(`/admin-portal/messages/${staffId}`, 'admin');
      const nextThread = response.data.thread;
      setThread(nextThread);
      if (
        markRead &&
        (nextThread.messages || []).some((entry) => entry.senderRole === 'sales_staff' && !entry.readByAdmin)
      ) {
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
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadAdminList();
      return;
    }
    loadStaffThread();
  }, [isAdmin, loadAdminList, loadStaffThread]);

  useEffect(() => {
    if (!open) return;
    if (isAdmin) {
      if (selectedStaffId) loadAdminThread(selectedStaffId, true);
      else loadAdminList();
      return;
    }
    loadStaffThread(true);
  }, [isAdmin, loadAdminList, loadAdminThread, loadStaffThread, open, selectedStaffId]);

  const orderedMessages = useMemo(
    () =>
      [...(thread?.messages || [])].sort(
        (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
      ),
    [thread]
  );

  const visibleThreads = useMemo(() => {
    if (!isAdmin) return [];
    const term = String(search || '').trim().toLowerCase();
    if (!term) return threads;
    return threads.filter((entry) =>
      [entry.staffUser?.name, entry.staffUser?.username, entry.staffUser?.email, entry.staffUser?.phone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [isAdmin, search, threads]);

  const selectedThreadLabel = useMemo(() => {
    if (!isAdmin) return 'Office';
    const current = threads.find((entry) => entry.staffUser?._id === selectedStaffId);
    return current?.staffUser?.name || current?.staffUser?.username || 'Staff';
  }, [isAdmin, selectedStaffId, threads]);

  const showAdminThreadOnMobile = isAdmin && isMobile && Boolean(selectedStaffId);

  const removeAttachment = (url) => {
    setAttachments((current) => current.filter((entry) => entry.url !== url));
  };

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setMessage('');
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const url = await portalApi.uploadFile(file, role);
          return { name: file.name, url, mimeType: file.type };
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
    if (!draft.trim() && !attachments.length) {
      setMessage('Add a message or at least one attachment.');
      return;
    }
    if (isAdmin && !selectedStaffId) {
      setMessage('Choose a staff member first.');
      return;
    }
    setSending(true);
    setMessage('');
    try {
      const path = isAdmin ? `/admin-portal/messages/${selectedStaffId}` : '/staff-portal/messages';
      const response = await portalApi.post(path, { text: draft.trim(), attachments }, role);
      setThread(response.data.thread);
      setDraft('');
      setAttachments([]);
      if (isAdmin) await loadAdminList();
      else await loadStaffThread(false);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`portal-chat-widget${open ? ' open' : ''}`}>
      <button
        type="button"
        className={`portal-chat-launcher${isMobile ? ' mobile' : ''}`}
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <span className="portal-chat-launcher-icon">{open ? '×' : '💬'}</span>
        {!isMobile ? <span>{open ? 'Close' : 'Chat'}</span> : null}
        {totalUnread ? <strong>{totalUnread}</strong> : null}
      </button>

      {open ? (
        <div className={`portal-chat-panel${isAdmin ? ' admin' : ' staff'}`}>
          <div className="portal-chat-panel-head">
            <div>
              <div className="portal-brand-kicker">Communication</div>
              <h3 className="portal-section-title">
                {showAdminThreadOnMobile ? selectedThreadLabel : isAdmin ? 'Messages' : 'Office Chat'}
              </h3>
            </div>
            <div className="portal-chat-head-actions">
              {showAdminThreadOnMobile ? (
                <button type="button" className="portal-inline-button ghost" onClick={() => setSelectedStaffId('')}>
                  Back
                </button>
              ) : null}
              <button type="button" className="portal-inline-button ghost" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>

          {message ? <div className="portal-message-banner success">{message}</div> : null}

          {isAdmin ? (
            <div className="portal-chat-admin-shell">
              {!showAdminThreadOnMobile ? (
                <div className="portal-chat-staff-list">
                  {!isMobile ? (
                    <div className="portal-filter-bar compact">
                      <input
                        type="search"
                        placeholder="Search staff"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                      />
                    </div>
                  ) : null}
                  <div className="portal-thread-list">
                    {visibleThreads.map((entry) => (
                      <button
                        key={entry.staffUser?._id}
                        type="button"
                        className={`portal-thread-button${selectedStaffId === entry.staffUser?._id ? ' is-selected' : ''}${isMobile ? ' mobile' : ''}`}
                        onClick={() => setSelectedStaffId(entry.staffUser?._id || '')}
                      >
                        <div className="portal-thread-title-row">
                          <strong>{entry.staffUser?.name || entry.staffUser?.username || 'Staff'}</strong>
                          {entry.unreadStaffCount ? <span className="portal-badge status">{entry.unreadStaffCount}</span> : null}
                        </div>
                        {!isMobile ? (
                          <div className="portal-thread-preview">
                            {entry.lastMessage?.text || (entry.lastMessage?.attachments?.length ? `${entry.lastMessage.attachments.length} attachment(s)` : 'No messages yet')}
                          </div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className={`portal-chat-thread${showAdminThreadOnMobile ? ' mobile-open' : ''}`}>
                <div className="portal-conversation-window compact">
                  {loading ? (
                    <div className="portal-empty-state"><h3 className="portal-empty-title">Loading...</h3></div>
                  ) : orderedMessages.length ? (
                    <div className="portal-message-stack">
                      {orderedMessages.map((entry) => (
                        <div key={entry._id} className={`portal-message-row ${entry.senderRole === 'admin' ? 'self' : 'office'}`}>
                          <div className="portal-message-bubble">
                            <div className="portal-message-meta">
                              <strong>{entry.senderRole === 'admin' ? 'Admin' : entry.sender?.name || entry.sender?.username || 'Staff'}</strong>
                              <span>{formatPortalDateTime(entry.createdAt)}</span>
                            </div>
                            {entry.text ? <p className="portal-message-copy">{entry.text}</p> : null}
                            {entry.attachments?.length ? (
                              <div className="portal-attachment-list">
                                {entry.attachments.map((attachment) => (
                                  <a key={`${entry._id}-${attachment.url}`} className="portal-attachment-chip" href={attachment.url} target="_blank" rel="noreferrer">
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
                    </div>
                  )}
                </div>
                <form className="portal-message-composer compact" onSubmit={sendMessage}>
                  <label className="portal-field">
                    <span>Message</span>
                    <textarea rows="3" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write to staff..." />
                  </label>
                  <div className="portal-inline-actions compact">
                    <label className="portal-inline-button secondary portal-file-label">
                      {uploading ? 'Uploading...' : 'Attach'}
                      <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={handleFiles} hidden />
                    </label>
                    <button type="button" className="portal-inline-button ghost" onClick={() => { setDraft(''); setAttachments([]); }}>
                      Clear
                    </button>
                  </div>
                  {attachments.length ? (
                    <div className="portal-attachment-list editor">
                      {attachments.map((attachment) => (
                        <button key={attachment.url} type="button" className="portal-attachment-chip removable" onClick={() => removeAttachment(attachment.url)}>
                          {attachmentLabel(attachment)} ×
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <button className="portal-button primary portal-save-button" type="submit" disabled={sending || uploading || !selectedStaffId}>
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="portal-chat-thread">
              <div className="portal-conversation-window compact">
                {loading ? (
                  <div className="portal-empty-state"><h3 className="portal-empty-title">Loading...</h3></div>
                ) : orderedMessages.length ? (
                  <div className="portal-message-stack">
                    {orderedMessages.map((entry) => (
                      <div key={entry._id} className={`portal-message-row ${entry.senderRole === 'sales_staff' ? 'self' : 'office'}`}>
                        <div className="portal-message-bubble">
                          <div className="portal-message-meta">
                            <strong>{entry.senderRole === 'sales_staff' ? 'You' : 'Office'}</strong>
                            <span>{formatPortalDateTime(entry.createdAt)}</span>
                          </div>
                          {entry.text ? <p className="portal-message-copy">{entry.text}</p> : null}
                          {entry.attachments?.length ? (
                            <div className="portal-attachment-list">
                              {entry.attachments.map((attachment) => (
                                <a key={`${entry._id}-${attachment.url}`} className="portal-attachment-chip" href={attachment.url} target="_blank" rel="noreferrer">
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
                  </div>
                )}
              </div>
              <form className="portal-message-composer compact" onSubmit={sendMessage}>
                <label className="portal-field">
                  <span>Message</span>
                  <textarea rows="3" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write to the office..." />
                </label>
                <div className="portal-inline-actions compact">
                  <label className="portal-inline-button secondary portal-file-label">
                    {uploading ? 'Uploading...' : 'Attach'}
                    <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={handleFiles} hidden />
                  </label>
                  <button type="button" className="portal-inline-button ghost" onClick={() => { setDraft(''); setAttachments([]); }}>
                    Clear
                  </button>
                </div>
                {attachments.length ? (
                  <div className="portal-attachment-list editor">
                    {attachments.map((attachment) => (
                      <button key={attachment.url} type="button" className="portal-attachment-chip removable" onClick={() => removeAttachment(attachment.url)}>
                        {attachmentLabel(attachment)} ×
                      </button>
                    ))}
                  </div>
                ) : null}
                <button className="portal-button primary portal-save-button" type="submit" disabled={sending || uploading}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PortalChatWidget;
