# 📌 Teste Técnico - Aprova Digital

Este projeto é um teste técnico para extração e manipulação de dados de processos de licenciamento no sistema **Aprova Digital**. As etapas envolvem consultas otimizadas ao banco de dados, formatação de relatórios e exportação para JSON e Excel.

---

## 📂 Estrutura do Projeto

```
📁 licensing-process-data
│-- 📁 licensing-process-visualizer     # Interface em Angular para visualizar os dados
│-- 📄 database.js                      # Gerencia a conexão com o banco de dados
│-- 📄 databaseUtils.js                 # Funções auxiliares para consultas ao banco de dados
│-- 📄 etapa1.js                        # Implementação da Etapa 1
│-- 📄 etapa2.js                        # Implementação da Etapa 2
│-- 📄 etapa3.js                        # Implementação da Etapa 3
│-- 📄 etapa4.js                        # Implementação da Etapa 4
│-- 📄 fileUtils.js                     # Funções para salvar os dados em JSON e Excel
│-- 📄 package.json                     # Dependências do projeto
│-- 📄 README.md                        # Documentação do projeto
```

---

## 🚀 Como Executar

### 1️⃣ **Instalar Dependências**

Antes de começar, certifique-se de ter o **Node.js** instalado. Depois, instale as dependências do projeto:

```sh
npm install
```

### 2️⃣ **Executar as Etapas**

Cada etapa pode ser executada separadamente rodando o comando:

```sh
node EtapaX.js
```

Substitua **X** pelo número da etapa desejada.

Por exemplo, para executar a **Etapa 1**:

```sh
node Etapa1.js
```

Os arquivos de saída serão gerados no formato **JSON** e **Excel** dentro da pasta do projeto.

---

## 🛠️ Estrutura Modular

Para evitar repetição de código, o projeto foi modularizado em:

- **databaseUtils.js** → Contém funções para buscar usuários e setores
- **fileUtils.js** → Responsável por salvar os dados extraídos

Cada **etapa** define:

✅ Como transformar os processos 🔄  
✅ Quais colunas incluir no Excel 📊  



