import React, { useState, useEffect } from 'react';
import './CSS/alert.css';
import './CSS/styles.css';
import './CSS/prontos.css';
import './CSS/proximos.css';
import './CSS/admin.css';

import Alert from './components/Alert';
import Pronto from './components/prontos';
import Proximo from './components/proximos';
import Chamando from './components/Chamando';

// Teste para ver se ta funcionando o commit

function App() {
  const [itens, setItens] = useState([]);
  function getData() {
    fetch('http://localhost:3000/fila/list', { method: 'GET' })
      .then(response => response.json())
      .then(data => setItens(data));
  }

  const [jaAbriu, setJaAbriu] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  }

  const [singleton, setSingleton] = useState(false)
  const [highlightedSenha, setHighlightedSenha] = useState(null);
  const [highlightedStatus, setHighlightedStatus] = useState(null);
  const handleConfirmAlert = (foundItem) => {
    setHighlightedSenha(foundItem.codigo);
    setIsAlertOpen(false);
    setHighlightedStatus(foundItem.status);
    setJaAbriu(true)
    if (!singleton) {
      setSingleton(true);
    }
  };

  const [mostrandoProntos, setMostrandoProntos] = useState(false);
  function VerChamados() {
    setMostrandoProntos(!mostrandoProntos);
  };

  const [verMais, setVerMais] = useState(true);
  const [mostrandoTodos, setMostrandoTodos] = useState(false);
  function VerTodos() {
    setVerMais(!verMais);
    setMostrandoTodos(!mostrandoTodos);
  };

  useEffect(() => {
    getData()
    if (!jaAbriu) {
      setIsAlertOpen(true)
    }

    if (highlightedStatus === 2) {
      setMostrandoProntos(true);
    }
  }, [singleton]);

  return (
    <div className="App">
      <div>
        <Alert
          isOpen={isAlertOpen}
          onClose={handleCloseAlert}
          onConfirm={handleConfirmAlert}
          lista={itens}
        />
      </div>

      <div className="container-principal">
        <header>
          <nav className="navigation">
            <div class="left-group">
            <a href="http://localhost:8000" className="logo-link">
              <img className="seta" src="./img/arrow.png" alt="voltar" />
              <h1 className="logo">FILA</h1>
            </a>
            </div>
            <a href='https://www.burgerking.com.br' className="rest" target='blank'>Restaurante</a>
          </nav>
        </header>
        <div className="container-prontos">
          <div>
            {itens.map(cadaItem => (
              (cadaItem.status === 1) ? (
                <Chamando
                  item={cadaItem}
                  highlighted={Number(highlightedSenha) === Number(cadaItem.codigo)}
                />
              ) : null
            ))}
          </div>
          <button onClick={VerChamados}>
              <label>{mostrandoProntos ? "Ver Menos" : "Ver Já Chamados"}</label>
          </button>
          <div className='naoveio'>
              {mostrandoProntos && (
                <div className="prontos-scroll">
                    <p>Já Chamados:</p>
                    <ul className="prontos">
                      {itens.map(cadaItem => (
                        (cadaItem.status === 2) ? (
                          <li key={cadaItem.codigo}>
                            <Pronto
                              item={cadaItem}
                              highlighted={String(highlightedSenha) === String(cadaItem.codigo)}
                            />
                          </li>
                        ) : null
                      ))}
                    </ul>
                </div>
              )}
          </div>
        </div>
        {highlightedSenha ? (
          <div className="container-proximos">
            <ul className="proximo">
              <div className="container-proximos">
                <div className="senha-user">
                  <button className="ver-tudo" onClick={VerTodos}>
                    <label>{verMais ? "Ver Todos da Fila" : "Ver menos"}</label>
                  </button>
                  {!mostrandoTodos && (
                    <p>Sua senha</p>
                  )}

                </div>

                {itens.map(cadaItem => (
                  (cadaItem.status === 3) && !mostrandoTodos ? (
                    highlightedSenha === cadaItem.codigo ? (
                      <Proximo
                        item={cadaItem}
                        highlighted={String(highlightedSenha) === String(cadaItem.codigo)}
                        log={() => console.log(`highlightedSenha: ${highlightedSenha}, cadaItem.codigo: ${cadaItem.codigo}`)}
                      />
                    ) : null
                  ) : null
                ))}
              </div>

              <div className="container-proximos">
                {itens.map(cadaItem => (
                  (cadaItem.status === 3) && mostrandoTodos ? (
                    <Proximo
                      item={cadaItem}
                      highlighted={String(highlightedSenha) === String(cadaItem.codigo)}
                      log={() => console.log(`highlightedSenha: ${highlightedSenha}, cadaItem.codigo: ${cadaItem.codigo}`)}
                    />
                  ) : null
                ))}
              </div>
            </ul>
          </div>

        ) : (

          <div className="container-proximos">
            <ul className="proximo">
              {itens.map(cadaItem => (
                cadaItem.ordem !== 0 && cadaItem.ordem !== -1 ? (
                  <Proximo
                    item={cadaItem}
                    highlighted={String(highlightedSenha) === String(cadaItem.codigo)}
                    log={() => console.log(`highlightedSenha: ${highlightedSenha}, cadaItem.codigo: ${cadaItem.codigo}`)}
                  />
                ) : null
              ))}
            </ul>
          </div>

        )}
      </div>
      <script src="/script.js"></script>
    </div>
  );
}

export default App;
