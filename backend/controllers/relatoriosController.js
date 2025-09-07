import { readAll } from '../config/database.js';

const relatoriosController = {
  async gerarRelatorioChamados(req, res) {
    try {
      // Busca todos os dados necessários em paralelo
      const [chamados, usuarios, pools] = await Promise.all([
        readAll('chamados'),
        readAll('usuarios'),
        readAll('pool')
      ]);

      // Processa os dados para gerar as estatísticas
      const stats = {
        totalChamados: chamados.length,
        porStatus: {},
        porTipo: {},
        performanceTecnicos: {}
      };

      const tecnicos = usuarios.filter(u => u.funcao === 'tecnico');

      // Inicializa contadores
      chamados.forEach(chamado => {
        // Contagem por status
        stats.porStatus[chamado.status] = (stats.porStatus[chamado.status] || 0) + 1;

        // Contagem por tipo
        const tipo = pools.find(p => p.id === chamado.tipo_id)?.titulo || 'Desconhecido';
        stats.porTipo[tipo] = (stats.porTipo[tipo] || 0) + 1;
      });
      
      tecnicos.forEach(tecnico => {
          const chamadosDoTecnico = chamados.filter(c => c.tecnico_id === tecnico.id && c.status === 'concluido');
          stats.performanceTecnicos[tecnico.nome] = chamadosDoTecnico.length;
      });


      res.status(200).json(stats);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      res.status(500).json({ erro: 'Erro ao gerar relatório de chamados' });
    }
  }
};

export default relatoriosController;