import { useState, useEffect } from 'react';
import Pronto from './components/prontosadm';
import './CSS/admin.css';
import { getData, insertDocument, updateDocument, updateFila, updateVoltar, deleteDocument, insertPrint, chamarFila } from './api.js';

// Importação do ipcRenderer
const { ipcRenderer } = window.require('electron');

function AdminPage() {
  const [itens, setItens] = useState([]);
  const [dadosPrint, setDadosPrint] = useState(null);
  const [shortcutEnabled, setShortcutEnabled] = useState(true);
  const [verChamados, setVerChamados] = useState(false);
  
  useEffect(() => {
    fetchData();

    ipcRenderer.on('screenshot-captured', (event, resultObject) => {
      setDadosPrint(resultObject);
      insertPrint(resultObject);
      fetchData();
    });

    return () => ipcRenderer.removeAllListeners('screenshot-captured');
  }, []);

  const fetchData = async () => {
    const data = await getData();
    // Ordena os itens para que aqueles com status venham primeiro
    setItens(data);
  };

  const toggleChamados = () => {
    setVerChamados(!verChamados);
  };

  const toggleShortcut = () => {
    const newStatus = !shortcutEnabled;
    setShortcutEnabled(newStatus);
    ipcRenderer.send('toggle-shortcut', newStatus);
  };

  // Filtra os itens por status
  const itensStatus1 = itens.filter(item => item.status === 1);
  const itensStatus2 = itens.filter(item => item.status === 2);
  const itensStatus3 = itens.filter(item => item.status === 3);

  return (
    <div className="wrapper">
      <div className="container-proximos">
        <h1 className="titulo-adm">FILA CATUAI</h1>

        <div className="filtros">
          <button className="btn btn-novo" onClick={() => insertDocument().then(fetchData)}>Inserir Novo</button>
          <button className="btn btn-novo" onClick={fetchData}>Atualizar</button>
        </div>

        {dadosPrint && (
          <div className="container-print">
            <p>Código: {dadosPrint.codigo}</p>
            <p>{dadosPrint.ordem}</p>
            <img src={dadosPrint.imageBase64} alt="Captura de tela" />
          </div>
        )}

        <button onClick={toggleShortcut} className="btn btn-toggle-shortcut">
          {shortcutEnabled ? 'Desativar Captura' : 'Ativar Captura'}
        </button>

        {/* Exibe os itens separados por status */}
        <div className="lista-itens">
          {itensStatus1.length > 0 && (
            <ul>
              <h2>
                Chamando
              </h2>
              {itensStatus1.map(item => (
                <Pronto
                  key={item._id}
                  item={item}
                  updateDocument={updateDocument}
                  deleteDocument={deleteDocument}
                  updateFila={updateFila}
                  updateVoltar={updateVoltar}
                  chamarFila={chamarFila}
                  fetchData={fetchData}
                />
              ))}
            </ul>
          )}
          
          {itensStatus2.length > 0 && (
            <div>
            <button onClick={toggleChamados} className='btn btn-chamados'>
              {verChamados ? 'Esconder chamados' : 'Ver já chamados'}
            </button>
            {verChamados && (
              <ul>
                {itensStatus2.map(item => (
                  <Pronto
                    key={item._id}
                    item={item}
                    updateDocument={updateDocument}
                    deleteDocument={deleteDocument}
                    updateFila={updateFila}
                    updateVoltar={updateVoltar}
                    chamarFila={chamarFila}
                    fetchData={fetchData}
                  />
                ))}
              </ul>
            )}
          </div>
          )}

          {itensStatus3.length > 0 && (
            <ul>
              {itensStatus3
              .sort((a, b) => a.posicao - b.posicao)
              .map(item => (
                <Pronto
                  key={item._id}
                  item={item}
                  updateDocument={updateDocument}
                  deleteDocument={deleteDocument}
                  updateFila={updateFila}
                  updateVoltar={updateVoltar}
                  chamarFila={chamarFila}
                  fetchData={fetchData}
                />
              ))}
            </ul>
          )}
        </div>

        {itens.length === 0 && <p className="p-fila">Nenhum item encontrado</p>}
      </div>
    </div>
  );
}

export default AdminPage;
