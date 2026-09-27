import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { TelaGaleria } from './telas/TelaGaleria';
import './estilos.css';

// Ferramenta de desenvolvimento: ?galeria mostra todas as espécies e armaduras.
const galeria = new URLSearchParams(location.search).has('galeria');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {galeria ? <TelaGaleria /> : <App />}
  </StrictMode>,
);
