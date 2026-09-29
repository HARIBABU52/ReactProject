import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectLogs, clearLogs } from '../features/logs/logsSlice';
import { X, Trash2, Cpu, Database, Activity, GitCommit, Workflow, Server } from 'lucide-react';

export default function ReduxStateInspector({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('diagram'); // 'diagram' | 'logs' | 'state'
  const logs = useSelector(selectLogs);
  const fullState = useSelector((state) => state);
  const dispatch = useDispatch();

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
              <h3>Redux Architecture & Middleware Inspector</h3>
              <p className="subtitle">Real-time Redux Store, State Tree & Action Stream</p>
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
                <span>Live Action Logs ({logs.length})</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'state' ? 'active' : ''}`}
                onClick={() => setActiveTab('state')}
              >
                <Database size={15} />
                <span>Current State Tree</span>
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
                <h4>Redux Core Lifecycle</h4>
                <div className="flow-diagram">
                  <div className="node store-node">
                    <Server size={20} />
                    <span className="node-title">STORE</span>
                    <span className="node-desc">Central State Container</span>
                  </div>

                  <div className="flow-arrow">➔</div>

                  <div className="node middleware-node">
                    <Activity size={20} />
                    <span className="node-title">MIDDLEWARE</span>
                    <span className="node-desc">Custom Action Interceptor</span>
                  </div>

                  <div className="flow-arrow">➔</div>

                  <div className="node reducer-node">
                    <GitCommit size={20} />
                    <span className="node-title">REDUCER</span>
                    <span className="node-desc">Pure State Mutator</span>
                  </div>

                  <div className="flow-arrow">➔</div>

                  <div className="node state-node">
                    <Database size={20} />
                    <span className="node-title">STATE</span>
                    <span className="node-desc">Immutable UI State</span>
                  </div>
                </div>
              </div>

              <div className="components-grid">
                <div className="component-box">
                  <h5>1. Redux Store (configureStore)</h5>
                  <p>
                    Single source of truth initialized in <code>src/app/store.js</code>. Combines slices (<code>characters</code>, <code>favorites</code>, <code>logs</code>) and attaches custom middleware.
                  </p>
                </div>

                <div className="component-box">
                  <h5>2. Custom Middleware</h5>
                  <p>
                    Defined in <code>src/app/middleware/customMiddleware.js</code>. Intercepts all actions to output colored console logs, sync favorites with <code>localStorage</code>, and feed this live action stream!
                  </p>
                </div>

                <div className="component-box">
                  <h5>3. Reducers & Async Thunks</h5>
                  <p>
                    Created using Redux Toolkit <code>createSlice</code> & <code>createAsyncThunk</code> for non-blocking HTTP requests to the OpenSource Rick & Morty REST API.
                  </p>
                </div>

                <div className="component-box">
                  <h5>4. State Management</h5>
                  <p>
                    React components access state via <code>useSelector</code> and trigger updates via <code>useDispatch(action)</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="logs-container">
              <div className="logs-toolbar">
                <span>Intercepted Action Dispatches (Captured by Custom Middleware):</span>
                <button
                  onClick={() => dispatch(clearLogs())}
                  className="clear-logs-btn"
                >
                  <Trash2 size={14} />
                  <span>Clear Action History</span>
                </button>
              </div>

              <div className="logs-stream">
                {logs.length === 0 ? (
                  <div className="empty-logs">
                    No actions logged yet. Perform interactions on the UI to see dispatched Redux actions live!
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
                <span>Live Immutable State Tree (`store.getState()`):</span>
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
