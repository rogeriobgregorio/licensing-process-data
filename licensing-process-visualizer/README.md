Claro! Aqui está o seu **README.md** atualizado com emojis, seguindo o estilo que você mencionou:

---

# 📋 Projeto de Listagem de Processos

Este projeto Angular exibe uma lista de processos extraídos de arquivos JSON. A interface permite ao usuário escolher diferentes arquivos JSON e exibir os dados de maneira interativa e bem estilizada.

---

## 📂 Estrutura do Projeto

```
📁 projeto-processos
│-- 📁 src
│   ├── 📁 app
│   │   ├── 📁 components
│   │   │   └── 📄 process-list.component.ts     # Componente que exibe a lista de processos
│   │   ├── 📁 services
│   │   │   └── 📄 process-data.service.ts       # Serviço que carrega os dados dos arquivos JSON
│   ├── 📁 assets
│   │   └── 📁 data
│   │       ├── 📄 listOfProcesses.json          # Arquivo JSON com dados de processos
│   │       ├── 📄 listOfProcesses2.json         # Outro arquivo JSON com dados de processos
│   │       ├── 📄 listOfProcesses3.json         # Mais um arquivo JSON
│   │       └── 📄 listOfProcesses4.json         # Arquivo JSON com dados completos de processos
│-- 📄 package.json                              # Dependências do projeto
│-- 📄 README.md                                 # Documentação do projeto
```

---

## 🚀 Como Executar

### 1️⃣ **Instalar Dependências**

Antes de rodar o projeto, instale as dependências utilizando o **Node.js**:

```bash
npm install
```

### 2️⃣ **Iniciar o Servidor de Desenvolvimento**

Para iniciar o servidor de desenvolvimento, utilize o comando abaixo:

```bash
ng serve
```

A aplicação ficará disponível em `http://localhost:4200`.

---

## 🧩 Estrutura dos Arquivos JSON

Cada arquivo JSON possui um formato específico para os dados do processo.

### `listOfProcesses.json`

```json
{
  "created_at": "26/09/2024 11:51:50",
  "nP": "11536-24-SP-APO",
  "config_metadata": {
    "title": "Apostilamento"
  }
}
```

### `listOfProcesses2.json`

```json
{
  "nP": "11536-24-SP-APO",
  "created_at": "26/09/2024 11:51:50",
  "title": "Apostilamento",
  "lastDestination": "setorentrada_saopaulosp"
}
```

### `listOfProcesses3.json`

```json
{
  "nP": "11536-24-SP-APO",
  "created_at": "26/09/2024 11:51:50",
  "title": "Apostilamento",
  "lastDestination": "Coordenadoria de Parcelamento do Solo e de Habitação de Interesse Social - PARHIS"
}
```

### `listOfProcesses4.json`

```json
{
  "nP": "11536-24-SP-APO",
  "created_at": "26/09/2024 11:51:50",
  "title": "Apostilamento",
  "lastEvent": "Processo encaminhado para Coordenadoria de Parcelamento do Solo e de Habitação de Interesse Social - PARHIS",
  "lastUser": "Murielle Maffy",
  "lastSector": "Coordenadoria de Parcelamento do Solo e de Habitação de Interesse Social - PARHIS"
}
```

---

## 💻 Funcionalidades

- **Seleção de Arquivo JSON**: O usuário pode escolher entre diferentes arquivos JSON para visualizar os processos.
- **Exibição dos Dados**: As informações dos processos, como número, data de criação, título, evento, usuário, setor e destino, são exibidas de forma clara e organizada.
- **Interface Estilizada**: O layout é responsivo, com efeitos de hover, transições suaves e exibição dinâmica de dados.

---

## 🛠️ Desenvolvimento

### Componentes

- **ProcessListComponent**: Responsável pela exibição da lista de processos.
- **ProcessDataService**: Serviço para carregar os dados dos arquivos JSON.

### Estilização

A interface foi cuidadosamente estilizada utilizando CSS para proporcionar uma boa experiência de usuário. O layout inclui cards com informações dos processos e efeitos de hover interativos.

