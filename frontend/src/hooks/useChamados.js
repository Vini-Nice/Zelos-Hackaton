import { useState, useEffect, useCallback } from 'react';
import { chamadosService } from '../services/chamados';

export function useChamados() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarChamados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chamadosService.listarChamados();
      setChamados(response);
    } catch (err) {
      setError(err.message || 'Erro ao carregar chamados');
      console.error('Erro ao carregar chamados:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const criarChamado = useCallback(async (dados) => {
    try {
      setLoading(true);
      setError(null);
      const novoChamado = await chamadosService.criarChamado(dados);
      setChamados(prev => [novoChamado, ...prev]);
      return novoChamado;
    } catch (err) {
      setError(err.message || 'Erro ao criar chamado');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarChamado = useCallback(async (id, dados) => {
    try {
      setLoading(true);
      setError(null);
      await chamadosService.atualizarChamado(id, dados);
      setChamados(prev => 
        prev.map(chamado => 
          chamado.id === id ? { ...chamado, ...dados } : chamado
        )
      );
    } catch (err) {
      setError(err.message || 'Erro ao atualizar chamado');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const excluirChamado = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await chamadosService.excluirChamado(id);
      setChamados(prev => prev.filter(chamado => chamado.id !== id));
    } catch (err) {
      setError(err.message || 'Erro ao excluir chamado');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarStatus = useCallback(async (id, status) => {
    try {
      setError(null);
      await chamadosService.atualizarStatus(id, status);
      setChamados(prev => 
        prev.map(chamado => 
          chamado.id === id ? { ...chamado, status } : chamado
        )
      );
    } catch (err) {
      setError(err.message || 'Erro ao atualizar status');
      throw err;
    }
  }, []);

  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  // Carregar chamados automaticamente
  useEffect(() => {
    carregarChamados();
  }, [carregarChamados]);

  return {
    chamados,
    loading,
    error,
    carregarChamados,
    criarChamado,
    atualizarChamado,
    excluirChamado,
    atualizarStatus,
    limparErro
  };
}
