# Planejamento do Frontend

Em um primeiro momento, os dados serão renderizados de forma estática, sendo possível criar algumas funcionalidades que serão de responsabilidade do `JavaScritp`, por exemplo: responsividade, controle de menus e listas, aparência, etc. O consumo da API e a renderização dinâmica dos dados serão implementados posteriormente.
 
O sistema será composto por três áreas distintas, cada uma com suas próprias interfaces e funcionalidades:

## Área Pública

A Área Pública é acessada por qualquer visitante que ainda não possui conta no sistema. Seu objetivo é apresentar o salão, seus serviços e permitir que o usuário avance para login ou cadastro.

Objetivos:

Apresentar o salão de forma elegante.
Exibir lista de serviços com preços.
Facilitar contato e visualização de informações essenciais.
Encaminhar o usuário para login/cadastro.

Telas previstas:

Home (página principal)
Serviços
Sobre
Contato
Login
Cadastro

Elementos e componentes principais:

Header + navegação
Banner principal (hero)
Cards de serviços
Footer informativo
Formulários simples
Botões de ação clara (Call to Action)

Ação principal do usuário:
Acessar informações básicas e criar conta ou fazer login para agendar serviços.

## Área de Aplicação

A Área de Aplicação é utilizada pelos clientes autenticados. Aqui acontece toda a experiência de agendamentos e gestão de perfil do usuário.

[definir-o-contexto] → preenchido abaixo

Contexto:
O cliente entra após fazer login no Salon Vision e pode visualizar seus agendamentos, marcar novos serviços, editar informações pessoais e receber avisos do salão.

Objetivos:

Facilitar o processo de agendamento.
Exibir horários disponíveis.
Exibir serviços e preços.
Permitir ao cliente acompanhar seus compromissos.

Telas previstas:

Dashboard do cliente
Novo agendamento
Meus agendamentos
Perfil do usuário
Notificações
Configurações

Elementos e componentes principais:

Sidebar de navegação
Barra superior (topbar)
Cards de status (próximo horário, serviços agendados, etc.)
Listas de agendamentos
Formulários
Calendário de horários
Alertas e notificações

Ação principal do usuário:
Agendar serviços e acompanhar seus horários.

## Área Administrativa

A Área Administrativa é destinada aos administradores, recepção e gestores do salão, responsáveis pelo controle total do sistema.

[definir-o-contexto] → preenchido abaixo

Contexto:
É onde ocorre toda a gestão interna: horários, profissionais, clientes e relatórios de desempenho do salão.

Objetivos:

Controlar a agenda geral do salão.
Registrar ou editar agendamentos manualmente.
Cadastrar e gerenciar profissionais.
Configurar serviços, preços e duração.
Consultar relatórios de movimentação.

Telas previstas:

Painel administrativo (dashboard)
Gestão de usuários (clientes)
Gestão de profissionais
Gestão de serviços
Agenda geral
Relatórios (faturamento, volume de atendimentos, capacidade, etc.)

Elementos e componentes principais:

Sidebar avançada
Tabelas com filtros
Formulários
Indicadores numéricos
Gráficos (quando for dinâmica)
Calendário administrativo

Ação principal do usuário:
Gerenciar o funcionamento diário do salão e organizar a agenda completa.