import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, Calendar, User, FileText, Star } from 'lucide-react';
import { noteService } from '../services/noteService';
import RatingStars from './RatingStars';

const NoteCard = ({ note, onDownloadSuccess }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadCount, setDownloadCount] = useState(note.downloadCount || 0);

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setDownloading(true);
      await noteService.downloadNote(note.id, note.fileName);
      setDownloadCount((prev) => prev + 1);
      if (onDownloadSuccess) onDownloadSuccess(note.id);
    } catch (err) {
      alert('Could not download file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="glass-card note-card">
      <div>
        <div className="note-card-header">
          <span className="badge badge-primary">{note.subjectName || 'Subject'}</span>
          <span className="badge badge-warning">Unit {note.unit}</span>
        </div>

        <Link to={`/notes/${note.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="note-title" title={note.title}>
            {note.title}
          </h3>
        </Link>

        {note.description && (
          <p className="note-desc" title={note.description}>
            {note.description}
          </p>
        )}
      </div>

      <div>
        <div className="note-meta">
          <div className="note-meta-item" title="Uploader">
            <User size={14} />
            <span>{note.uploaderName || 'Student'}</span>
          </div>
          <div className="note-meta-item" title="Upload Date">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          <div className="note-meta-item" title="File Name">
            <FileText size={14} />
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {note.fileName}
            </span>
          </div>
        </div>

        <div className="note-card-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RatingStars rating={note.averageRating || 0} size={15} showValue={true} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({note.totalRatings || 0})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginRight: '0.25rem',
              }}
              title="Total Downloads"
            >
              <Download size={13} />
              {downloadCount}
            </span>

            <Link to={`/notes/${note.id}`} className="btn btn-secondary btn-sm" title="View Details">
              <Eye size={14} />
            </Link>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn btn-primary btn-sm"
              title="Download Note"
            >
              <Download size={14} />
              <span>{downloading ? '...' : 'Get'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
