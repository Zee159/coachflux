/**
 * Knowledge Recommendations Component
 * 
 * Displays personalized knowledge article recommendations after session completion.
 * Loads asynchronously using RAG semantic search.
 */

import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect } from "react";

interface KnowledgeRecommendation {
  id: string;
  title: string;
  category: string;
  content: string;
  fullContent: string;
  relevance: number;
  source: string;
}

interface KnowledgeRecommendationsProps {
  sessionId: Id<"sessions">;
}

export function KnowledgeRecommendations({ sessionId }: KnowledgeRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<KnowledgeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const generateRecommendations = useAction(api.knowledgeRecommendations.generateRecommendations);
  
  useEffect(() => {
    async function loadRecommendations() {
      try {
        const results = await generateRecommendations({ sessionId });
        setRecommendations(results as KnowledgeRecommendation[]);
      } catch (err) {
        console.error("Error loading recommendations:", err);
        setError("Unable to load recommendations. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    }
    
    if (sessionId !== undefined) {
      void loadRecommendations();
    }
  }, [sessionId, generateRecommendations]);
  
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 rounded-r-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          📚 Recommended Reading
        </h2>
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Finding relevant articles for you...
          </p>
        </div>
      </div>
    );
  }
  
  if (error !== null) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📚 Recommended Reading
        </h2>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return null; // Don't show section if no recommendations
  }
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 rounded-r-lg p-6 print:break-inside-avoid">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        📚 Recommended Reading
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Based on your session, here are relevant resources to deepen your understanding:
      </p>
      
      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div
            key={rec.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Article Header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white flex-1">
                  {idx + 1}. {rec.title}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    {Math.round(rec.relevance * 100)}% match
                  </span>
                </div>
              </div>
              
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  {rec.category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {rec.source.replace(/_/g, ' ')}
                </span>
              </div>
              
              {/* Preview or Full Content */}
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {expandedId === rec.id ? (
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {rec.fullContent}
                  </div>
                ) : (
                  <p className="line-clamp-3">{rec.content}</p>
                )}
              </div>
              
              {/* Read More Button */}
              <button
                onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
              >
                {expandedId === rec.id ? (
                  <>
                    Show less
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Read full article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          💡 These articles are selected based on semantic similarity to your session content.
          Each article contains 1,200+ words of frameworks, scripts, and actionable guidance.
        </p>
      </div>
    </div>
  );
}
