"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function CollegeCombobox({
  id,
  value,
  manualMode,
  onChange,
  colleges,
  error,
  placeholder = "Search your college...",
}) {
  const wrapperRef = useRef(null);
  const optionRefs = useRef([]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredColleges = useMemo(() => {
    if (!normalizedQuery) {
      return colleges;
    }

    return colleges.filter((college) => college.toLowerCase().includes(normalizedQuery));
  }, [colleges, normalizedQuery]);

  const hasExactMatch = useMemo(() => {
    if (!normalizedQuery) {
      return false;
    }

    return colleges.some((college) => college.toLowerCase() === normalizedQuery);
  }, [colleges, normalizedQuery]);

  const showNotListed = Boolean(normalizedQuery) && !hasExactMatch;
  const optionsCount = filteredColleges.length + (showNotListed ? 1 : 0);

  useEffect(() => {
    if (!open) {
      return;
    }

    setHighlightedIndex(0);
  }, [open, normalizedQuery]);

  useEffect(() => {
    if (!open || optionsCount === 0) {
      return;
    }

    if (highlightedIndex > optionsCount - 1) {
      setHighlightedIndex(optionsCount - 1);
      return;
    }

    const node = optionRefs.current[highlightedIndex];
    if (node) {
      node.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedIndex, open, optionsCount]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectCollege = (college) => {
    onChange({ collegeName: college, collegeManual: false });
    setQuery(college);
    setOpen(false);
  };

  const activateManualMode = () => {
    onChange({ collegeName: "", collegeManual: true });
    setQuery("");
    setOpen(false);
  };

  const handleKeyboard = (event) => {
    if (manualMode) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((prev) => Math.min(prev + 1, Math.max(optionsCount - 1, 0)));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (event.key === "Enter" && open) {
      event.preventDefault();

      if (highlightedIndex < filteredColleges.length) {
        const selected = filteredColleges[highlightedIndex];
        if (selected) {
          selectCollege(selected);
        }
        return;
      }

      if (showNotListed) {
        activateManualMode();
      }
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="register-college-combobox" ref={wrapperRef}>
      {!manualMode ? (
        <>
          <input
            id={id}
            className={`register-control register-combobox-input${error ? " is-invalid" : ""}`}
            type="text"
            value={query}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              if (value) {
                onChange({ collegeName: "", collegeManual: false });
              }
            }}
            onKeyDown={handleKeyboard}
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-listbox`}
            aria-autocomplete="list"
            aria-activedescendant={open ? `${id}-option-${highlightedIndex}` : undefined}
            aria-invalid={Boolean(error)}
            autoComplete="off"
          />

          {open ? (
            <div className="register-college-popover" id={`${id}-listbox`} role="listbox">
              <div className="register-college-options">
                {filteredColleges.length > 0 ? (
                  filteredColleges.map((college, index) => {
                    const isActive = index === highlightedIndex;
                    return (
                      <button
                        key={college}
                        id={`${id}-option-${index}`}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        ref={(node) => {
                          optionRefs.current[index] = node;
                        }}
                        className={`register-college-option${isActive ? " active" : ""}`}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => selectCollege(college)}
                      >
                        {college}
                      </button>
                    );
                  })
                ) : (
                  <p className="register-college-empty">No matching colleges</p>
                )}

                {showNotListed ? (
                  <button
                    id={`${id}-option-${filteredColleges.length}`}
                    type="button"
                    role="option"
                    aria-selected={highlightedIndex === filteredColleges.length}
                    ref={(node) => {
                      optionRefs.current[filteredColleges.length] = node;
                    }}
                    className={`register-college-option register-college-option-subtle${
                      highlightedIndex === filteredColleges.length ? " active" : ""
                    }`}
                    onMouseEnter={() => setHighlightedIndex(filteredColleges.length)}
                    onClick={activateManualMode}
                  >
                    My college is not listed
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {value ? <p className="register-note">Selected college: {value}</p> : null}
        </>
      ) : (
        <>
          <div className="register-manual-college-head">
            <p className="register-note">My college is not listed</p>
            <button
              type="button"
              className="register-college-back"
              onClick={() => {
                onChange({ collegeName: "", collegeManual: false });
                setQuery("");
              }}
            >
              Search from list
            </button>
          </div>

          <input
            id={`${id}Manual`}
            className={`register-control${error ? " is-invalid" : ""}`}
            type="text"
            value={value}
            placeholder="Enter your college name manually"
            onChange={(event) => onChange({ collegeName: event.target.value, collegeManual: true })}
            aria-invalid={Boolean(error)}
            required
          />
        </>
      )}
    </div>
  );
}
