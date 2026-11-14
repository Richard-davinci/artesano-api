import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from './pages/Menu.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
      </Routes>
    </BrowserRouter>
  );
}
