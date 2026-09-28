import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { noteService } from '../services/noteService';
import { subjectService } from '../services/subjectService';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import NoteGrid from '../components/NoteGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

const Notes = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [pageData, setPageData] = useState({
    page: 0,
    size: 9,
    totalPages: 0,
    totalElements: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract query filters from URL
  const keyword = searchParams.get('keyword') || '';
  const subjectId = searchParams.get('subjectId') ? Number(searchParams.get('subjectId')) : null;
  const unit = searchParams.get('unit') ? Number(searchParams.get('unit')) : null;
  const sortBy = searchParams.get('sort') || 'createdAt,desc';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 0;

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [searchParams]);

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getSubjects();
      setSubjects(res.data || []);
    } catch (err) {
      console.error('Failed to load subjects', err);
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        keyword: keyword || undefined,
        subjectId: subjectId || undefined,
        unit: unit || undefined,
        sort: sortBy,
        page: page,
        size: 9,
      };

      const res = await noteService.getNotes(params);
      const data = res.data;
      setNotes(data.content || []);
      setPageData({
        page: data.page,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      setError('Failed to fetch notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== '') {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });
    // Reset to page 0 when filters change (unless updating page itself)
    if (!('page' in newParams)) {
      updated.set('page', 0);
    }
    setSearchParams(updated);
  };

  const handleSearch = (newKeyword) => {
    updateFilters({ keyword: newKeyword });
  };

  const handleSubjectChange = (newSubjectId) => {
    updateFilters({ subjectId: newSubjectId });
  };

  const handleUnitChange = (newUnit) => {
    updateFilters({ unit: newUnit });
  };

  const handleSortChange = (newSort) => {
    updateFilters({ sort: newSort });
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageData.totalPages) {
      updateFilters({ page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Compass size={24} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '1.85rem' }}>Explore Academic Notes</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Search across subjects, syllabus units, titles and topics.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <SearchBar onSearch={handleSearch} initialValue={keyword} />
      </div>

      {/* Filters */}
      <FilterPanel
        subjects={subjects}
        selectedSubject={subjectId}
        onSubjectChange={handleSubjectChange}
        selectedUnit={unit}
        onUnitChange={handleUnitChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onReset={handleReset}
      />

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Results summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{notes.length}</strong> of <strong>{pageData.totalElements}</strong> notes
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Searching repository notes..." />
      ) : (
        <>
          <NoteGrid
            notes={notes}
            emptyMessage={
              keyword || subjectId || unit
                ? 'No notes found matching your filter criteria. Try clearing some filters.'
                : 'No notes uploaded yet. Start by uploading the first note!'
            }
          />

          {/* Pagination Controls */}
          {pageData.totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={pageData.page === 0}
                onClick={() => handlePageChange(pageData.page - 1)}
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: pageData.totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${pageData.page === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn"
                disabled={pageData.page >= pageData.totalPages - 1}
                onClick={() => handlePageChange(pageData.page + 1)}
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notes;
