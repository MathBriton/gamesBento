import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { TelaGaleria } from './telas/TelaGaleria';

// Ferramenta de desenvolvimento: ?galeria mostra todas as espécies e armaduras.
const galeria = new URLSearchParams(location.search).has('galeria');
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {galeria ? <TelaGaleria /> : <App />}
  </StrictMode>,
);
