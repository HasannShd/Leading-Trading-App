import { Fragment } from 'react';
import { formatPortalChatDateLabel, formatPortalTime, getPortalDateKey } from '../../utils/portalDate';
import './PortalShell.css';

const attachmentLabel = (attachment) => attachment?.name || attachment?.url?.split('/').pop() || 'Attachment';

const buildTimeline = (messages) => {
  const timeline = [];
  let previousDateKey = '';

  messages.forEach((entry) => {
    const nextDateKey = getPortalDateKey(entry.createdAt);
    if (nextDateKey !== previousDateKey) {
      timeline.push({
        type: 'date',
        key: `date-${nextDateKey}`,
        label: formatPortalChatDateLabel(entry.createdAt),
      });
      previousDateKey = nextDateKey;
    }

    timeline.push({
      type: 'message',
      key: entry._id,
      entry,
    });
  });

  return timeline;
};

const PortalMessageThread = ({ messages = [], selfRole, resolveSenderLabel }) => {
  const timeline = buildTimeline(messages);

  return (
    <div className="portal-message-stack">
      {timeline.map((item) => {
        if (item.type === 'date') {
          return (
            <div key={item.key} className="portal-message-date-break">
              <span>{item.label}</span>
            </div>
          );
        }

        const entry = item.entry;
        const isSelf = entry.senderRole === selfRole;

        return (
          <Fragment key={item.key}>
            <div className={`portal-message-row ${isSelf ? 'self' : 'office'}`}>
              <div className="portal-message-bubble">
                <div className="portal-message-meta">
                  <strong>{resolveSenderLabel(entry)}</strong>
                  <span>{formatPortalTime(entry.createdAt)}</span>
                </div>
                {entry.text ? <p className="portal-message-copy">{entry.text}</p> : null}
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
          </Fragment>
        );
      })}
    </div>
  );
};

export default PortalMessageThread;
