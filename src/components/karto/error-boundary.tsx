"use client";

import React from "react";
import { motion } from "framer-motion";

type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Karto ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl">😕</motion.div>
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            We hit an unexpected error. Please refresh the page to continue shopping.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-karto-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-karto-green/90"
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
