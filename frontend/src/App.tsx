import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ToastProvider } from './contexts/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
