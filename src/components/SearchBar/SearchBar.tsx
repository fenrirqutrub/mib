// src/components/SearchBar/SearchBar.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Loader2 } from "lucide-react";

export interface ReusableSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

interface FormValues {
  query: string;
}

const SearchBar: React.FC<ReusableSearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  isLoading = false,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { register, watch, setValue, handleSubmit, setFocus } =
    useForm<FormValues>({
      defaultValues: { query: value },
    });

  const query = watch("query");
  const {
    ref: registerRef,
    onBlur: rhfOnBlur,
    ...registerRest
  } = register("query");

  // Keep parent in sync whenever RHF field changes
  useEffect(() => {
    if (query !== value) onChange(query ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Keep RHF in sync if parent value changes externally (e.g. reset elsewhere)
  useEffect(() => {
    if (value !== query) setValue("query", value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const submit = handleSubmit((data) => {
    onSubmit?.(data.query);
  });

  const handleClear = () => {
    setValue("query", "");
    onChange("");
    setFocus("query");
  };

  return (
    <form
      onSubmit={submit}
      className={`group relative w-full max-w-2xl mx-auto ${className}`}
    >
      {/* Glow ring on focus */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-violet-600/30 blur-md"
        initial={false}
        animate={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      <motion.div
        initial={false}
        animate={{ scale: isFocused ? 1.01 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`relative flex items-center gap-2 md:gap-3 w-full px-4 py-2.5 md:py-3
        bg-(--color-bg) rounded-xl border transition-colors duration-200
        ${
          isFocused
            ? "border-violet-600 shadow-lg shadow-violet-600/10"
            : "border-(--color-active-border)"
        }`}
      >
        <div className="shrink-0 relative w-5 h-5 md:w-6 md:h-6">
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <motion.div
                key="loader"
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
              >
                <Loader2 className="w-full h-full text-violet-600 animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: isFocused ? 0.9 : 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
              >
                <Search
                  className={`w-full h-full transition-colors duration-200 ${
                    isFocused ? "text-violet-600" : "text-(--color-gray)"
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          {...registerRest}
          ref={(el) => {
            registerRef(el);
            inputRef.current = el;
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            rhfOnBlur(e);
          }}
          type="text"
          placeholder={placeholder}
          className="bangla flex-1 min-w-0 bg-transparent outline-none text-(--color-text) placeholder-(--color-gray) text-sm md:text-base"
        />

        <AnimatePresence initial={false}>
          {query && !isLoading && (
            <motion.button
              key="clear"
              type="button"
              onClick={handleClear}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              whileTap={{ scale: 0.85 }}
              className="shrink-0 p-1 rounded-full text-(--color-gray) hover:bg-(--color-active-bg) hover:text-(--color-text)"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </form>
  );
};

export default SearchBar;
