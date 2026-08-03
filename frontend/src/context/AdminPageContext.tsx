'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

interface AdminPageContextValue {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const AdminPageContext = createContext<AdminPageContextValue>({
  pageTitle: 'Dashboard',
  setPageTitle: () => {},
});

export function AdminPageProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState('Dashboard');
  return (
    <AdminPageContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </AdminPageContext.Provider>
  );
}

export function useAdminPage() {
  return useContext(AdminPageContext);
}

/**
 * Drop this in any admin page to set the topbar title.
 * Usage: <AdminPageTitle title="Manage Faculty" />
 */
export function AdminPageTitle({ title }: { title: string }) {
  const { setPageTitle } = useAdminPage();
  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle('Dashboard');
  }, [title, setPageTitle]);
  return null;
}
