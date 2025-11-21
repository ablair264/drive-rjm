import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { StudentsProvider } from './contexts/StudentsContext'
import { LessonsProvider } from './contexts/LessonsContext'
import { RecentlyPassedProvider } from './contexts/RecentlyPassedContext'
import { EnquiriesProvider } from './contexts/EnquiriesContext'
import { TestsProvider } from './contexts/TestsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <StudentsProvider>
          <LessonsProvider>
            <RecentlyPassedProvider>
              <EnquiriesProvider>
                <TestsProvider>
                  <App />
                </TestsProvider>
              </EnquiriesProvider>
            </RecentlyPassedProvider>
          </LessonsProvider>
        </StudentsProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
