import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, Calendar, User, FileText, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { noteService } from '../services/noteService';
import RatingStars from './RatingStars';

const NoteCard = ({ note, onDownloadSuccess }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadCount, setDownloadCount] = useState(note.downloadCount || 0);

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setDownloading(true);
      await noteService.downloadNote(note.id, note.fileName);
      setDownloadCount((prev) => prev + 1);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
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

  // Determine file type badge class
  const getFileBadgeClass = (fileName) => {
    if (!fileName) return 'badge-file-txt';
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'badge-file-pdf';
    if (ext === 'doc' || ext === 'docx') return 'badge-file-docx';
    if (ext === 'ppt' || ext === 'pptx') return 'badge-file-pptx';
    return 'badge-file-txt';
  };

  const getFileExtension = (fileName) => {
    if (!fileName) return 'FILE';
    return fileName.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const getUploaderInitial = (name) => {
    if (!name) return 'S';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="note-card">
      <div>
        <div className="note-card-header">
          <span className="badge badge-primary">{note.subjectName || 'General'}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className={`badge ${getFileBadgeClass(note.fileName)}`}>
              {getFileExtension(note.fileName)}
            </span>
            <span className="badge badge-warning">Unit {note.unit}</span>
          </div>
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
          <div className="note-meta-item" title={`Uploaded by ${note.uploaderName || 'Student'}`}>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#e0e7ff',
                color: '#3730a3',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
              }}
            >
              {getUploaderInitial(note.uploaderName)}
            </span>
            <span>{note.uploaderName || 'Student'}</span>
          </div>

          <div className="note-meta-item" title="Date Uploaded">
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>

          <div className="note-meta-item" title={note.fileName}>
            <FileText size={13} />
            <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {note.fileName}
            </span>
          </div>
        </div>

        <div className="note-card-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <RatingStars rating={note.averageRating || 0} size={14} showValue={true} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({note.totalRatings || 0})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                paddingRight: '0.25rem',
              }}
              title="Total Downloads"
            >
              <Download size={13} />
              {downloadCount}
            </span>

            <Link
              to={`/notes/${note.id}`}
              className="btn btn-secondary btn-sm"
              title="View full note details"
              style={{ padding: '0.35rem 0.65rem' }}
            >
              <Eye size={13} />
            </Link>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`btn ${downloadSuccess ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              title="Direct Download"
              style={{ padding: '0.35rem 0.75rem' }}
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 size={13} color="#10b981" />
                  <span style={{ color: '#047857' }}>Saved</span>
                </>
              ) : (
                <>
                  <Download size={13} />
                  <span>{downloading ? '...' : 'Get'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
