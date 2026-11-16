import React, { useState, useRef, useEffect } from 'react';
import { searchCampusLocations, SearchItem, findShortestRoute } from '../data/campusGraph';
import { Viewpoint, CampusRoute } from '../types/tour';
import { Search, MapPin, Navigation, X, Building2, BedDouble, GraduationCap, AlertCircle, Sparkles } from 'lucide-react';

interface LocationSearchProps {
  currentViewpoint: Viewpoint;
  onNavigateTo: (targetId: string) => void;
  onSetRoute: (route: CampusRoute | null) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  currentViewpoint,
  onNavigateTo,
  onSetRoute
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [notFoundMsg, setNotFoundMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setNotFoundMsg(null);
      return;
    }

    const items = searchCampusLocations(query);
    const filtered = selectedFilter === 'all'
      ? items
      : items.filter((i) => {
          if (selectedFilter === 'academic') return i.category === 'academic';
          if (selectedFilter === 'hostel') return i.category === 'hostel';
          if (selectedFilter === 'admin') return i.category === 'admin';
          if (selectedFilter === 'outdoor') return i.category === 'outdoor' || i.category === 'sports';
          return true;
        });

    setResults(filtered);
    if (filtered.length === 0) {
      setNotFoundMsg(`No campus location found matching "${query}". Check spelling or room code (e.g. B-012, 301).`);
    } else {
      setNotFoundMsg(null);
    }
  }, [query, selectedFilter]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (id: string, isRoute: boolean) => {
    if (isRoute) {
      const route = findShortestRoute(currentViewpoint.id, id);
      if (route) {
        onSetRoute(route);
      }
    } else {
      onSetRoute(null);
      onNavigateTo(id);
    }
    setIsOpen(false);
    setQuery('');
  };

  const quickChips = [
    { label: 'All', value: 'all' },
    { label: 'Academic & Labs', value: 'academic' },
    { label: 'Hostel Rooms', value: 'hostel' },
    { label: 'Administrative', value: 'admin' },
    { label: 'Sports & Gates', value: 'outdoor' },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-md sm:max-w-lg z-40">
      {/* Search Input Bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-street focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <Search className="w-5 h-5 text-indigo-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search campus, rooms (B-012, G-025, 301), library, labs..."
          className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-slate-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="p-1 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Results Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 p-2 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl max-h-96 overflow-y-auto">
          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 mb-2 overflow-x-auto border-b border-slate-800 pb-2">
            {quickChips.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setSelectedFilter(chip.value)}
                className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition ${
                  selectedFilter === chip.value
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Results List */}
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition group"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => handleSelectLocation(item.id, false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/50 flex items-center justify-center shrink-0 text-indigo-400 group-hover:scale-105 transition">
                      {item.category === 'hostel' && <BedDouble className="w-4 h-4 text-emerald-400" />}
                      {item.category === 'academic' && <GraduationCap className="w-4 h-4 text-cyan-400" />}
                      {item.category === 'admin' && <Building2 className="w-4 h-4 text-amber-400" />}
                      {item.category !== 'hostel' && item.category !== 'academic' && item.category !== 'admin' && (
                        <MapPin className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400">{item.subtitle}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <button
                      onClick={() => handleSelectLocation(item.id, true)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-600/40 transition"
                      title="Calculate walking route from here"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Route</span>
                    </button>
                    <button
                      onClick={() => handleSelectLocation(item.id, false)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : notFoundMsg ? (
            <div className="p-4 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-400" />
              <span>{notFoundMsg}</span>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400 text-xs">
              Type a room code like <span className="text-indigo-300 font-mono">B-012</span>,{' '}
              <span className="text-indigo-300 font-mono">301</span>, or <span className="text-indigo-300 font-mono">Library</span> to navigate.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

