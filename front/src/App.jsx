import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon, MoonIcon, SunIcon, ChartBarIcon, Squares2X2Icon, ListBulletIcon, ArrowUpIcon, ArrowDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

// URL da API do backend
const API_URL = 'http://localhost:5000/produtos';

function App() {
  // Estados para gerenciar os dados e a interface
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [sortOrder, setSortOrder] = useState('asc');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Valores de motion para animações
  const scrollY = useMotionValue(0);
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);
  const scale = useTransform(scrollY, [0, 100], [1, 0.8]);
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const backgroundOpacity = useTransform(scrollY, [0, 500], [1, 0.5]);

  // Efeito para carregar produtos e configurar o listener de scroll
  useEffect(() => {
    carregarProdutos();
    window.addEventListener('scroll', () => scrollY.set(window.scrollY));
    return () => window.removeEventListener('scroll', () => scrollY.set(window.scrollY));
  }, []);

  // Função para carregar produtos da API
  const carregarProdutos = async () => {
    try {
      const response = await axios.get(API_URL);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      showMessage('Erro ao carregar produtos.', 'error');
    }
  };

  // Função para adicionar ou atualizar um produto
  const adicionarProduto = async (e) => {
    e.preventDefault();
    try {
      const produtoData = { 
        nome, 
        preco: parseFloat(price), 
        quantidade: parseInt(quantity)
      };

      if (editandoId) {
        await axios.put(`${API_URL}/${editandoId}`, produtoData);
        showMessage('Produto atualizado com sucesso!', 'success');
      } else {
        await axios.post(API_URL, produtoData);
        showMessage('Produto adicionado com sucesso!', 'success');
      }
      setNome('');
      setPrice('');
      setQuantity('');
      setEditandoId(null);
      carregarProdutos();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar/atualizar produto:', error);
      showMessage('Erro ao adicionar/atualizar produto.', 'error');
    }
  };

  // Função para preparar a edição de um produto
  const editarProduto = (produto) => {
    setNome(produto.nome);
    setPrice(produto.preco.toString());
    setQuantity(produto.quantidade.toString());
    setEditandoId(produto.id);
    setIsModalOpen(true);
  };

  // Função para excluir um produto
  const excluirProduto = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      showMessage('Produto excluído com sucesso!', 'success');
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      showMessage('Erro ao excluir produto.', 'error');
    }
  };

  // Função para exibir mensagens temporárias
  const showMessage = (text, type) => {
    setMensagem({ text, type });
    setTimeout(() => setMensagem(''), 5000);
  };

  // Função para alternar o modo escuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Função para alternar a exibição de estatísticas
  const toggleStats = () => {
    setShowStats(!showStats);
  };

  // Função para filtrar e ordenar produtos
  const filteredAndSortedProducts = useCallback(() => {
    return produtos
      .filter(produto => 
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [produtos, searchTerm, sortBy, sortOrder]);

  // Função para baixar relatorio em XLS
  const exportToXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(produtos.map(p => ({
      Nome: p.nome,
      Quantidade: p.quantidade,
      Preço: p.preco
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");
    XLSX.writeFile(workbook, "relatorio_produtos.xlsx");
  };

  // Cálculos para estatísticas
  const totalValue = produtos.reduce((sum, product) => sum + product.preco * product.quantidade, 0);
  const averagePrice = produtos.length > 0 ? totalValue / produtos.length : 0;

  // Dados para os gráficos
  const chartData = produtos.map(product => ({
    name: product.nome,
    value: product.quantidade,
    preco: product.preco
  }));

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      {/* Fundo animado */}
      <motion.div
        className="fixed inset-0 z-[-1]"
        style={{
          backgroundImage: 'url(https://source.unsplash.com/random/1920x1080?abstract)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: backgroundY,
          opacity: backgroundOpacity,
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Título animado */}
        <motion.h1
          className="text-5xl font-bold mb-8 text-center"
          style={{ opacity, scale }}
        >
          Catálogo de Produtos - Pedro Rodrigues
        </motion.h1>

        {/* Barra de controles */}
        <motion.div 
          className={`flex justify-between items-center mb-6 bg-opacity-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.button
            className={`p-3 rounded-full ${darkMode ? 'bg-yellow-300 text-gray-900' : 'bg-gray-800 text-white'} transition-colors duration-300`}
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </motion.button>

          <motion.button
            className={`p-3 rounded-full ${darkMode ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'} transition-colors duration-300`}
            onClick={toggleStats}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChartBarIcon className="h-6 w-6" />
          </motion.button>

          <motion.button
            className={`p-3 rounded-full ${darkMode ? 'bg-green-500 text-white' : 'bg-green-600 text-white'} transition-colors duration-300`}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {viewMode === 'grid' ? <ListBulletIcon className="h-6 w-6" /> : <Squares2X2Icon className="h-6 w-6" />}
          </motion.button>

          <motion.button
            className={`p-3 rounded-full ${darkMode ? 'bg-purple-500 text-white' : 'bg-purple-600 text-white'} transition-colors duration-300`}
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <PlusIcon className="h-6 w-6" />
          </motion.button>
        </motion.div>

        {/* Seção de estatísticas */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              className={`mb-8 p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Estatísticas</h2>
              <button 
                onClick={exportToXLS}
                className={`mb-4 px-4 py-2 rounded ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors duration-300`}
              >
                Exportar Relatório XLS
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <StatCard title="Total de Produtos" value={produtos.length} darkMode={darkMode} />
                <StatCard title="Valor Total do Estoque" value={`R$ ${totalValue.toFixed(2)}`} darkMode={darkMode} />
                <StatCard title="Preço Médio" value={`R$ ${averagePrice.toFixed(2)}`} darkMode={darkMode} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard
                  title="Quantidade por Produto"
                  darkMode={darkMode}
                  chart={
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Quantidade" />
                      </BarChart>
                    </ResponsiveContainer>
                  }
                />

                <ChartCard
                  title="Distribuição de Estoque"
                  darkMode={darkMode}
                  chart={
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barra de pesquisa */}
        <motion.div 
          className="mb-6"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Controles de ordenação */}
        <div className="mb-6 flex flex-wrap gap-4">
          <motion.select
            className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            whileHover={{ scale: 1.05 }}
          >
            <option value="nome">Nome</option>
            <option value="preco">Preço</option>
            <option value="quantidade">Quantidade</option>
          </motion.select>
          <motion.button
            className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sortOrder === 'asc' ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />}
          </motion.button>
        </div>

               {/* Adicionar/editar produto */}
               <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`rounded-lg p-8 w-96 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <h2 className="text-2xl font-bold mb-4">{editandoId ? 'Editar Produto' : 'Adicionar Produto'}</h2>
                <form onSubmit={adicionarProduto}>
                  <div className="mb-4">
                    <label className="block mb-2">Nome:</label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Preço:</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Quantidade:</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      type="submit"
                      className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {editandoId ? 'Atualizar' : 'Adicionar'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className={`${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} text-gray-800 font-bold py-2 px-4 rounded transition duration-300 ease-in-out`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de produtos */}
        <motion.div
          className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}
          layout
        >
          <AnimatePresence>
            {filteredAndSortedProducts().map((produto) => (
              <motion.div
                key={produto.id}
                className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
                whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
              >
                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{produto.nome}</h3>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Preço: R$ {produto.preco.toFixed(2)}</p>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Quantidade: {produto.quantidade}</p>
                  <div className="mt-4 flex justify-between">
                    <motion.button
                      onClick={() => editarProduto(produto)}
                      className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition duration-300 ease-in-out`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => setConfirmDelete(produto.id)}
                      className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} transition duration-300 ease-in-out`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Confirmação de exclusão */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`rounded-lg p-8 w-96 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4 text-center">Confirmar Exclusão</h2>
                <p className="mb-6 text-center">Tem certeza que deseja excluir este produto?</p>
                <div className="flex justify-center space-x-4">
                  <motion.button
                    onClick={() => {
                      excluirProduto(confirmDelete);
                      setConfirmDelete(null);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Confirmar
                  </motion.button>
                  <motion.button
                    onClick={() => setConfirmDelete(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notificação */}
        <AnimatePresence>
          {mensagem && (
            <motion.div
              className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
                mensagem.type === 'success'
                  ? darkMode
                    ? 'bg-green-600 text-white'
                    : 'bg-green-500 text-white'
                  : darkMode
                  ? 'bg-red-600 text-white'
                  : 'bg-red-500 text-white'
              }`}
              initial={{ opacity: 0, y: -50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.5 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              {mensagem.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Componente de card para estatísticas
const StatCard = ({ title, value, darkMode }) => (
  <motion.div
    className={`p-6 rounded-xl shadow-lg ${
      darkMode 
        ? 'bg-gray-700 bg-opacity-50 text-white' 
        : 'bg-white bg-opacity-50 text-gray-900'
    } backdrop-filter backdrop-blur-sm`}
    whileHover={{ scale: 1.05, rotate: 1 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

// Componente de card para gráficos
const ChartCard = ({ title, darkMode, chart }) => (
  <motion.div
    className={`p-6 rounded-xl shadow-lg ${
      darkMode 
        ? 'bg-gray-700 bg-opacity-50 text-white' 
        : 'bg-white bg-opacity-50 text-gray-900'
    } backdrop-filter backdrop-blur-sm`}
    whileHover={{ scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {chart}
  </motion.div>
);

export default App;