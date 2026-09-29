import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { selectLogs, clearLogs } from '../features/logs/logsSlice';
import { X, Trash2, Cpu, Database, Activity, Workflow, Server, RefreshCw, Zap, Flame } from 'lucide-react';

export default function ReduxStateInspector({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('diagram'); // 'diagram' | 'logs' | 'state' | 'tanstack'
  const logs = useSelector(selectLogs);
  const fullState = useSelector((state) => state);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const queryCache = queryClient.getQueryCache().getAll();

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
              <h3>Redux & TanStack Query State Inspector</h3>
              <p className="subtitle">Real-time Redux Store, Middleware Logs & TanStack Query Cache</p>
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
                <span>TanStack Cache ({queryCache.length})</span>
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
                <h4>Combined Architecture: Redux Store + TanStack Query Cache</h4>
                <div className="flow-diagram">
                  <div className="node store-node">
                    <Server size={20} />
                    <span className="node-title">REDUX STORE</span>
                    <span className="node-desc">Client State & Vault</span>
                  </div>

                  <div className="flow-arrow">➔</div>

                  <div className="node middleware-node">
                    <Activity size={20} />
                    <span className="node-title">MIDDLEWARE</span>
                    <span className="node-desc">Logger & Persistence</span>
                  </div>

                  <div className="flow-arrow">➔</div>

                  <div className="node reducer-node">
                    <Flame size={20} />
                    <span className="node-title">TANSTACK QUERY</span>
                    <span className="node-desc">Server Cache & Refetch</span>
                  </div>

                  <div className="flow-arrow">➔</div>

                  <div className="node state-node">
                    <Database size={20} />
                    <span className="node-title">IMMUTABLE UI</span>
                    <span className="node-desc">Synchronized Pages</span>
                  </div>
                </div>
              </div>

              <div className="components-grid">
                <div className="component-box">
                  <h5>1. Redux Store (`store.js`)</h5>
                  <p>
                    Manages UI slice states, user bookmarks, filter controls, and custom middleware dispatches.
                  </p>
                </div>

                <div className="component-box">
                  <h5>2. TanStack Query (`queryClient.js`)</h5>
                  <p>
                    Manages server-state caching (5-min <code>staleTime</code>), automatic refetching, background data sync, and instant cache retrieval.
                  </p>
                </div>

                <div className="component-box">
                  <h5>3. Custom Middleware</h5>
                  <p>
                    Intercepts actions to format colored console logs, sync favorites to <code>localStorage</code>, and calculate action latency.
                  </p>
                </div>

                <div className="component-box">
                  <h5>4. React Router (Pages 1 & 2)</h5>
                  <p>
                    Pages consume both Redux selectors (`useSelector`) and TanStack Query hooks (`useQuery`) seamlessly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tanstack' && (
            <div className="state-container">
              <div className="logs-toolbar">
                <span>Active TanStack Query Cache Items ({queryCache.length}):</span>
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
                    No TanStack queries executed yet. Browse pages to see queries automatically cached in memory!
                  </div>
                ) : (
                  queryCache.map((query) => (
                    <div key={query.queryHash} className="log-row" style={{ gridTemplateColumns: '120px 220px 140px 1fr' }}>
                      <span className="log-time">Status: {query.state.status}</span>
                      <span className="log-type">Key: {JSON.stringify(query.queryKey)}</span>
                      <span className="log-duration">Updated: {new Date(query.state.dataUpdatedAt).toLocaleTimeString()}</span>
                      <span className="log-payload">
                        <span className="payload-label">Stale:</span> {query.isStale() ? 'Yes' : 'Fresh (Cached)'}
                      </span>
                    </div>
                  ))
                )}
              </div>
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
