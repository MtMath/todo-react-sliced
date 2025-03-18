# Sistema de Gerenciamento de Tarefas (To-Do List)

Uma aplicação web para gerenciamento de tarefas com autenticação de usuários, desenvolvida como parte do desafio técnico.

## Tecnologias Utilizadas

### Frontend

- **React**: Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript**: Superset tipado de JavaScript
- **Bootstrap**: Framework CSS para desenvolvimento de interfaces responsivas
- **React Bootstrap**: Componentes Bootstrap reimplementados para React
- **React Data Table Component**: Componente de tabela avançado com recursos de ordenação, paginação e filtro
- **React Router DOM**: Biblioteca para gerenciamento de rotas em aplicações React
- **Framer Motion**: Biblioteca para animações em React
- **Axios**: Cliente HTTP baseado em Promises para realizar requisições

## Arquitetura Feature Sliced

Este projeto utiliza a **Feature Sliced Architecture**, uma metodologia de organização de código front-end que segue os princípios de design orientado a domínio.

### Princípios Básicos

- **Camadas (Layers)**: O código é organizado em camadas com diferentes responsabilidades, com dependências permitidas apenas de cima para baixo
- **Fatias (Slices)**: Dentro de cada camada, o código é dividido em fatias (slices) por domínio ou funcionalidade
- **Segmentos (Segments)**: Cada fatia pode ser segmentada em partes menores (ui, model, lib)

### Estrutura de Camadas

1. **app**: Configurações globais da aplicação (providers, styles)
2. **pages**: Páginas/rotas da aplicação
3. **widgets**: Blocos de interface complexos e reutilizáveis
4. **features**: Funcionalidades de negócio (auth, tasks)
5. **entities**: Entidades de negócio (user, task)
6. **shared**: Código compartilhado (api, ui, lib, types)

### Vantagens

- **Desacoplamento**: Cada feature é isolada e pode ser desenvolvida independentemente
- **Escalabilidade**: Fácil adicionar novas features sem afetar as existentes
- **Manutenibilidade**: Organização previsível facilita encontrar e modificar código
- **Reusabilidade**: Componentes são facilmente reutilizáveis

## Como Instalar e Executar

```bash
# Clonar o repositório
git clone [url-do-repositorio]
cd [nome-do-repositorio]

# Instalar dependências
yarn install

# Iniciar o servidor de desenvolvimento
yarn start
```
