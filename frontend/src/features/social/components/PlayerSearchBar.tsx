import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocialStore } from '../stores/socialStore';
import type { UserProfile } from '../../../shared/types/database';

interface PlayerSearchBarProps {
  onSendRequest: (userId: string) => void;
  currentUserId: string;
}

export function PlayerSearchBar({ onSendRequest, currentUserId }: PlayerSearchBarProps) {
  const { searchPlayers } = useSocialStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setSearching(true);
      const found = await searchPlayers(searchQuery);
      // Filter out self
      setResults(found.filter((p) => p.id !== currentUserId));
      setShowResults(true);
      setSearching(false);
    },
    [searchPlayers, currentUserId]
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendRequest = (userId: string) => {
    onSendRequest(userId);
    setResults((prev) => prev.filter((p) => p.id !== userId));
  };

  return (
    <div className="player-search" ref={containerRef}>
      <input
        className="player-search__input"
        type="text"
        placeholder="Search players..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setShowResults(true);
        }}
      />
      {searching && <span className="player-search__spinner" />}

      {showResults && results.length > 0 && (
        <div className="player-search__results">
          {results.map((profile) => {
            const initial = profile.display_name?.charAt(0)?.toUpperCase() ?? '?';
            return (
              <div key={profile.id} className="player-search__result">
                <div className="player-search__result-avatar">{initial}</div>
                <span className="player-search__result-name">
                  {profile.display_name}
                </span>
                <button
                  className="player-search__add-btn"
                  onClick={() => handleSendRequest(profile.id)}
                >
                  Add Friend
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showResults && !searching && query.trim() && results.length === 0 && (
        <div className="player-search__results">
          <div className="player-search__no-results">No players found.</div>
        </div>
      )}
    </div>
  );
}
