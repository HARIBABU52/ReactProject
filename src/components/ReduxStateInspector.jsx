import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { selectLogs, clearLogs } from '../features/logs/logsSlice';
import { getCachedDataByKey, setCachedDataByKey, invalidateQueriesByKey } from '../services/tanstackApi';
import { X, Trash2, Cpu, Database, Activity, Workflow, Server, RefreshCw, Flame, Edit3, Eye } from 'lucide-react';

export default function ReduxStateInspector({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('diagram'); // 'diagram' | 'logs' | 'state' | 'tanstack'
  const [inspectedKeyData, setInspectedKeyData] = useState(null);
  const [selectedKeyText, setSelectedKeyText] = useState('');

  const logs = useSelector(selectLogs);
  const fullState = useSelector((state) => state);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const queryCache = queryClient.getQueryCache().getAll();

  const handleGetQueryData = (queryKey) => {
    const data = getCachedDataByKey(queryClient, queryKey);
    setSelectedKeyText(JSON.stringify(queryKey));
    setInspectedKeyData(data);
  };

  const handleSetQueryData = (queryKey) => {
    // Example: Manually update cache via setQueryData(queryKey, updater)
    setCachedDataByKey(queryClient, queryKey, (oldData) => {
      if (!oldData) return oldData;
      if (oldData.results) {
        return {
          ...oldData,
          results: oldData.results.map((item, idx) =>
            idx === 0 ? { ...item, name: `${item.name} (Updated via setQueryData)` } : item
          ),
        };
      }
      return oldData;
    });

    // Refresh inspected data view
    handleGetQueryData(queryKey);
  };

  const handleInvalidateQuery = (queryKey) => {
    invalidateQueriesByKey(queryClient, queryKey);
  };

  if (!isOpen) return null;

  return (
    <div className="redux-inspector-overlay" onClick={onClose}>
      <div
        className="redux-inspector-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="inspector-header">
          <div className="header-brand">
            <Cpu className="accent-icon animate-pulse" size={22} />
            <div>
              <h3>Redux & TanStack Query Inspector</h3>
              <p className="subtitle">Real-time Redux Store, Middleware Logs & TanStack Query Key Methods</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="tab-buttons">
              <button
                className={`tab-btn ${activeTab === 'diagram' ? 'active' : ''}`}
                onClick={() => setActiveTab('diagram')}
              >
                <Workflow size={15} />
                <span>Architecture</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                onClick={() => setActiveTab('logs')}
              >
                <Activity size={15} />
                <span>Action Stream ({logs.length})</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'tanstack' ? 'active' : ''}`}
                onClick={() => setActiveTab('tanstack')}
              >
                <Flame size={15} />
                <span>TanStack Query Keys ({queryCache.length})</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'state' ? 'active' : ''}`}
                onClick={() => setActiveTab('state')}
              >
                <Database size={15} />
                <span>Redux Tree</span>
              </button>
            </div>

            <button onClick={onClose} className="close-btn" title="Close Drawer">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Drawer Content Body */}
        <div className="inspector-content">
          {activeTab === 'diagram' && (
            <div className="diagram-container">
              <div className="diagram-card">
                <h4>TanStack Query Key Methods: `getQueryData` & `setQueryData`</h4>
                <div className="flow-diagram">
                  <div className="node store-node">
                    <Server size={20} />
                    <span className="node-title">QUERY KEY</span>
                    <span className="node-desc">['characters', filters]</span>
                  </div>

                  <div className="flow-arrow">➔</div>

                  <div className="node middleware-node">
                    <Eye size={20} />
                    <span className="node-title">getQueryData()</span>
                    <span className="node-desc">Read Cached State</span>
                  </div>

                  <div className="flow-arrow">➔</div>

                  <div className="node reducer-node">
                    <Edit3 size={20} />
                    <span className="node-title">setQueryData()</span>
                    <span className="node-desc">Write/Mutate Cache</span>
                  </div>

                  <div className="flow-arrow">➔</div>

                  <div className="node state-node">
                    <RefreshCw size={20} />
                    <span className="node-title">invalidateQueries()</span>
                    <span className="node-desc">Force Background Sync</span>
                  </div>
                </div>
              </div>

              <div className="components-grid">
                <div className="component-box">
                  <h5>1. `queryClient.getQueryData(queryKey)`</h5>
                  <p>
                    Reads cached data synchronously from TanStack Query memory without making an HTTP request.
                  </p>
                </div>

                <div className="component-box">
                  <h5>2. `queryClient.setQueryData(queryKey, updater)`</h5>
                  <p>
                    Synchronously updates the cached data for a specific query key, instantly updating UI components.
                  </p>
                </div>

                <div className="component-box">
                  <h5>3. `queryClient.invalidateQueries({ queryKey })`</h5>
                  <p>
                    Marks query as stale and triggers immediate background refetching from the API server.
                  </p>
                </div>

                <div className="component-box">
                  <h5>4. Redux Store Integration</h5>
                  <p>
                    Redux manages client slice state (filters, bookmarks, logs), while TanStack manages server query cache keys!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tanstack' && (
            <div className="state-container">
              <div className="logs-toolbar">
                <span>Active TanStack Query Keys in Memory ({queryCache.length}):</span>
                <button
                  onClick={() => queryClient.refetchQueries()}
                  className="clear-logs-btn"
                >
                  <RefreshCw size={14} />
                  <span>Refetch All Queries</span>
                </button>
              </div>

              <div className="logs-stream">
                {queryCache.length === 0 ? (
                  <div className="empty-logs">
                    No TanStack query keys active yet. Browse pages to see queries cached by key!
                  </div>
                ) : (
                  queryCache.map((query) => (
                    <div key={query.queryHash} className="log-row" style={{ gridTemplateColumns: '180px 180px 1fr' }}>
                      <span className="log-type">Key: {JSON.stringify(query.queryKey)}</span>
                      <span className="log-duration">Status: {query.state.status} ({query.isStale() ? 'Stale' : 'Fresh'})</span>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleGetQueryData(query.queryKey)}
                          className="clear-logs-btn"
                          title="getQueryData(queryKey)"
                        >
                          <Eye size={12} />
                          <span>getQueryData</span>
                        </button>
                        <button
                          onClick={() => handleSetQueryData(query.queryKey)}
                          className="clear-logs-btn"
                          style={{ color: '#00f0ff', borderColor: '#00f0ff' }}
                          title="setQueryData(queryKey, updater)"
                        >
                          <Edit3 size={12} />
                          <span>setQueryData</span>
                        </button>
                        <button
                          onClick={() => handleInvalidateQuery(query.queryKey)}
                          className="clear-logs-btn"
                          style={{ color: '#7000ff', borderColor: '#7000ff' }}
                          title="invalidateQueries(queryKey)"
                        >
                          <RefreshCw size={12} />
                          <span>Invalidate</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedKeyText && (
                <div style={{ marginTop: '1.5rem' }}>
                  <span className="meta-label">Inspected `getQueryData({selectedKeyText})`:</span>
                  <pre className="state-json-view" style={{ maxHeight: '200px', marginTop: '0.5rem' }}>
                    {JSON.stringify(inspectedKeyData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="logs-container">
              <div className="logs-toolbar">
                <span>Intercepted Redux Dispatches:</span>
                <button
                  onClick={() => dispatch(clearLogs())}
                  className="clear-logs-btn"
                >
                  <Trash2 size={14} />
                  <span>Clear History</span>
                </button>
              </div>

              <div className="logs-stream">
                {logs.length === 0 ? (
                  <div className="empty-logs">
                    No actions logged yet. Perform interactions to see dispatches live!
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="log-row">
                      <span className="log-time">{log.timestamp}</span>
                      <span className="log-type">{log.type}</span>
                      <span className="log-duration">{log.duration}</span>
                      <span className="log-payload">
                        <span className="payload-label">Payload:</span> {log.payload}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'state' && (
            <div className="state-container">
              <div className="state-toolbar">
                <span>Live Immutable Redux State Tree (`store.getState()`):</span>
              </div>
              <pre className="state-json-view">
                {JSON.stringify(fullState, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
