# Documentacao das Rotas da API

Este documento foi feito com base nas rotas registradas em `api/index.php`.

Rotas protegidas precisam receber token JWT no header:

```http
Authorization: Bearer SEU_TOKEN
```

Tipos de usuario usados no projeto:

| Tipo | Usuario |
|---|---|
| 3 | Admin |
| 4 | Cliente |
| 5 | Funcionario |

---

# Categorias de FAQ

Grupo: `/faqsCategories`

Controller: `Faqs\FaqsCategories`

## GET /faqsCategories/list

Lista todas as categorias de FAQ.

Se der certo, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Lista de FAQs Categories",
  "data": [
    {
      "id": 1,
      "name": "Pagamentos",
      "active": 1
    }
  ]
}
```

## GET /faqsCategories/listById/{faqCategorieId}

Busca uma categoria de FAQ pelo ID.

Parametro:

| Parametro | Tipo | Descricao |
|---|---|---|
| faqCategorieId | inteiro | ID da categoria |

Se o ID for invalido ou nao for enviado, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do FAQ Category e obrigatorio e deve ser um numero inteiro"
}
```

Se o ID for valido, mas nao existir categoria com esse ID, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "FAQ nao encontrado"
}
```

Se encontrar, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "FAQ Category encontrado",
  "data": {
    "id": 1,
    "name": "Pagamentos"
  }
}
```

## POST /faqsCategories/create

Cria uma nova categoria de FAQ.

Precisa de token de admin.

Body:

```json
{
  "name": "Pagamentos"
}
```

Se nao enviar token valido de admin, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se o campo `name` nao for enviado ou estiver vazio, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Preencha tudo."
}
```

Se acontecer erro ao salvar no banco, retorna:

```json
{
  "code": 500,
  "type": "error",
  "status": "internal_server_error",
  "message": "Mensagem do erro retornada pelo model"
}
```

Se criar com sucesso, retorna:

```json
{
  "code": 201,
  "type": "success",
  "status": "created",
  "message": "FAQ Category inserido com sucesso",
  "data": {
    "id": 1,
    "name": "Pagamentos"
  }
}
```

## PUT /faqsCategories/update/{faqCategorieId}

Atualiza uma categoria de FAQ.

Precisa do token de cliente.

Parametro:

| Parametro | Tipo | Descricao |
|---|---|---|
| faqCategorieId | inteiro | ID da categoria |

Body:

```json
{
  "name": "Pagamentos e Cobrancas"
}
```

Se nao enviar token valido, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do FAQ e obrigatorio e deve ser um numero inteiro"
}
```

Se o campo `name` nao for enviado ou estiver vazio, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "O campo name e obrigatorio"
}
```

Se a categoria nao existir, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "FAQ Category nao encontrada"
}
```

Se atualizar com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "FAQ Category atualizado com sucesso",
  "data": {
    "id": 1,
    "name": "Pagamentos e Cobrancas",
    "active": 1
  }
}
```

## DELETE /faqsCategories/delete/{faqCategorieId}

Remove uma categoria de FAQ usando soft delete.

Precisa de token de admin.

Se nao enviar token valido de admin, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do FAQ Category e obrigatorio e deve ser um numero inteiro"
}
```

Se a categoria nao existir, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "FAQ Category nao encontrado"
}
```

Se a categoria ja estiver removida, retorna:

```json
{
  "code": 409,
  "type": "error",
  "status": "conflict",
  "message": "FAQ Category ja esta removido"
}
```

Se remover com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "FAQ Category removido com sucesso"
}
```

---

# FAQs

Grupo: `/faqs`

Controller: `Faqs\Faqs`

## GET /faqs/list

Lista todas as FAQs.

Se der certo, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Lista de FAQs",
  "data": [
    {
      "id": 1,
      "faqs_category_id": 1,
      "question": "Como cancelo um pedido?",
      "answer": "Acesse seus pedidos.",
      "active": 1
    }
  ]
}
```

## GET /faqs/listFaq

Lista FAQs com nome da categoria e nome do usuario.

Se der certo, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Lista de FAQs",
  "data": [
    {
      "id": 1,
      "question": "Como cancelo um pedido?",
      "answer": "Acesse seus pedidos.",
      "created_at": "2026-06-30 10:00:00",
      "category_name": "Pedidos",
      "user_name": "Maria"
    }
  ]
}
```

## GET /faqs/list/{faq_id}

Busca uma FAQ pelo ID.

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do FAQ e obrigatorio e deve ser um numero inteiro"
}
```

Se nao existir FAQ com esse ID, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "FAQ nao encontrado"
}
```

Se encontrar, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "FAQ encontrado",
  "data": {
    "id": 1,
    "faqsCategoryId": 1,
    "question": "Como cancelo um pedido?",
    "answer": "Acesse seus pedidos.",
    "createdAt": "2026-06-30 10:00:00"
  }
}
```

## POST /faqs/create

Cria uma nova FAQ.

Precisa de token de cliente.

Body:

```json
{
  "faqsCategoryId": 1,
  "question": "Como cancelo um pedido?",
  "answer": "Acesse seus pedidos e clique em cancelar."
}
```

Se nao enviar token valido de cliente, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se faltar `faqsCategoryId`, `question` ou `answer`, retorna porque todos esses campos sao obrigatorios:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Preencha tudo."
}
```

Se acontecer erro ao inserir no banco, retorna:

```json
{
  "code": 500,
  "type": "error",
  "status": "internal_server_error",
  "message": "Mensagem do erro retornada pelo model"
}
```

Se criar com sucesso, retorna:

```json
{
  "code": 201,
  "type": "success",
  "status": "created",
  "message": "faq inserido com sucesso",
  "data": {
    "id": 1,
    "faqsCategoryId": 1,
    "question": "Como cancelo um pedido?",
    "answer": "Acesse seus pedidos e clique em cancelar."
  }
}
```

## PUT /faqs/update/{faq_id}

Atualiza uma FAQ.

Precisa do token de cliente.

Body:

```json
{
  "faqsCategoryId": 1,
  "question": "Como altero meu pedido?",
  "answer": "Entre em contato com o atendimento."
}
```

Se nao enviar token valido de cliente, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do FAQ e obrigatorio e deve ser um numero inteiro"
}
```

Se faltar `faqsCategoryId`, `question` ou `answer`, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Os campos faqsCategoryId, question e answer sao obrigatorios"
}
```

Se a FAQ nao existir, o controller atual retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Erro a achar faq atual."
}
```

Se atualizar com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "FAQ atualizado com sucesso",
  "data": {
    "id": 1,
    "faqsCategoryId": 1,
    "question": "Como altero meu pedido?",
    "answer": "Entre em contato com o atendimento.",
    "active": 1
  }
}
```

## DELETE /faqs/delete/{faq_id}

Remove uma FAQ usando soft delete.

Precisa de token de admin.

Se nao enviar token valido de admin, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do FAQ e obrigatorio e deve ser um numero inteiro"
}
```

Se a FAQ nao existir ou nao puder ser removida, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "FAQ nao encontrado"
}
```

Se remover com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "FAQ removido com sucesso"
}
```

---

# Usuarios

Grupo: `/users`

Controller: `Users\Users`

## GET /users/profile

Retorna o perfil do usuario autenticado.

Se nao enviar token valido, retorna erro porque a rota precisa saber qual usuario esta logado:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se encontrar o perfil, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Perfil encontrado",
  "data": {
    "id": 1,
    "name": "Maria",
    "email": "maria@email.com"
  }
}
```

## GET /users/listAll

Lista todos os usuarios.

Precisa de token de admin.

Se nao enviar token valido de admin, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se der certo, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Lista de usuarios",
  "data": []
}
```

## GET /users/list/employee

Lista funcionarios.

Se der certo, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Lista de Funcionarios",
  "data": []
}
```

## GET /users/list/cliente

Lista clientes.

Se der certo, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Lista de Clientes",
  "data": []
}
```

## GET /users/list/admin

Lista admins.

Precisa de token de admin.

Se nao enviar token valido de admin, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se der certo, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Lista de Admins",
  "data": []
}
```

## POST /users/register/cliente

Cadastra cliente.

Body:

```json
{
  "name": "Maria",
  "email": "maria@email.com",
  "password": "123456",
  "telephone": "51999999999",
  "photo": "foto.png"
}
```

Se `name` ou `email` nao forem enviados, ou se o e-mail for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Nome e e-mail sao obrigatorios. O e-mail deve ser valido."
}
```

Se a senha nao for enviada, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "A senha e obrigatoria."
}
```

Se a senha tiver menos de 6 ou mais de 20 caracteres, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "A senha deve ter entre 6 e 20 caracteres."
}
```

Se acontecer erro ao criar usuario, retorna:

```json
{
  "code": 500,
  "type": "error",
  "status": "internal_server_error",
  "message": "Mensagem do erro retornada pelo model"
}
```

Se criar com sucesso, retorna:

```json
{
  "code": 201,
  "type": "success",
  "status": "created",
  "message": "Usuario criado com sucesso",
  "data": {
    "id": 1,
    "name": "Maria",
    "email": "maria@email.com"
  }
}
```

## POST /users/register/admin

Cadastra admin.

Usa os mesmos campos e os mesmos erros de `/users/register/cliente`.

Body:

```json
{
  "name": "Admin",
  "email": "admin@email.com",
  "password": "123456",
  "telephone": "51999999999",
  "photo": "foto.png"
}
```

## POST /users/register/employee

Cadastra funcionario.

Usa os mesmos campos e os mesmos erros de `/users/register/cliente`.

Body:

```json
{
  "name": "Funcionario",
  "email": "funcionario@email.com",
  "password": "123456",
  "telephone": "51999999999",
  "photo": "foto.png"
}
```

## POST /users/login/cliente

Faz login de cliente.

Body:

```json
{
  "email": "maria@email.com",
  "password": "123456"
}
```

Se `email` ou `password` nao forem enviados, ou se o e-mail for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "E-mail e senha sao obrigatorios. O e-mail deve ser valido."
}
```

Se o login falhar, retorna erro porque as credenciais nao conferem ou o usuario nao tem permissao para esse tipo de login:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Mensagem do erro retornada pelo model"
}
```

Se logar com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Login realizado com sucesso",
  "data": {
    "id": 1,
    "name": "Maria",
    "photo": "foto.png",
    "userType": "cliente",
    "token": "jwt"
  }
}
```

## POST /users/login/admin

Faz login de admin.

Usa o mesmo body e os mesmos erros de `/users/login/cliente`, mas valida usuario do tipo admin.

## POST /users/login/employee

Faz login de funcionario.

Usa o mesmo body e os mesmos erros de `/users/login/cliente`, mas valida usuario do tipo funcionario.

## PUT /users/update/cliente

Atualiza o proprio cliente autenticado.

Precisa de token de cliente.

Body:

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "123456",
  "telephone": "51999999999",
  "photo": "foto.png"
}
```

Se nao enviar token valido de cliente, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se `name` ou `email` nao forem enviados, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Os campos name e email sao obrigatorios."
}
```

Se a senha for invalida, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "A senha deve ter entre 6 e 20 caracteres."
}
```

Se atualizar com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Usuario atualizado com sucesso",
  "data": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@email.com",
    "telephone": "51999999999",
    "photo": "foto.png",
    "userTypeId": 4,
    "active": 1
  }
}
```

## PUT /users/update/admin

Atualiza o proprio admin autenticado.

Precisa de token de admin.

Usa os mesmos campos e respostas de `/users/update/cliente`.

Observacao: para admin, a senha e opcional, mas se for enviada precisa ter entre 6 e 20 caracteres.

## PUT /users/update/employee

Atualiza o proprio funcionario autenticado.

Precisa de token de funcionario.

Usa os mesmos campos e respostas de `/users/update/cliente`.

Observacao: para funcionario, a senha e opcional, mas se for enviada precisa ter entre 6 e 20 caracteres.

## PUT /users/role/employee/{user_id}

Altera o papel de um usuario para funcionario.

Precisa de token de admin.

Se nao enviar token valido de admin, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Sem permissao."
}
```

Se nao enviar `user_id`, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID invalido"
}
```

Se o usuario nao existir, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "Usuario nao encontrado."
}
```

Se o usuario ja for funcionario, retorna:

```json
{
  "code": 400,
  "type": "warning",
  "status": "bad_request",
  "message": "Usuario ja e funcionario."
}
```

Se atualizar com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Role atualizada com sucesso"
}
```

## PUT /users/role/cliente/{user_id}

Altera o papel de um usuario para cliente.

Usa a mesma regra de `/users/role/employee/{user_id}`.

Se o usuario ja for cliente, retorna:

```json
{
  "code": 400,
  "type": "warning",
  "status": "bad_request",
  "message": "Usuario ja e cliente."
}
```

## PUT /users/role/admin/{user_id}

Altera o papel de um usuario para admin.

Usa a mesma regra de `/users/role/employee/{user_id}`.

Se o usuario ja for admin, retorna:

```json
{
  "code": 400,
  "type": "warning",
  "status": "bad_request",
  "message": "Usuario ja e admin."
}
```

## DELETE /users/delete/{user_id}

Remove usuario por soft delete.

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do usuario e obrigatorio"
}
```

Se o usuario nao existir, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "Usuario nao encontrado"
}
```

Se nao conseguir remover, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Nao foi possivel remover o usuario"
}
```

Se remover com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Usuario removido com sucesso"
}
```

---

# Agendamentos

Grupo: `/appointments`

Controller: `Appointments\Appointments`

## GET /appointments/history

Lista o historico do cliente autenticado.

Precisa de token de cliente.

Se nao enviar token valido de cliente, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se o usuario nao tiver agendamentos, retorna:

```json
{
  "code": 404,
  "type": "warning",
  "status": "not_found",
  "message": "Usuario sem agendamentos"
}
```

Se encontrar historico, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Historico encontrado",
  "data": []
}
```

## GET /appointments/listAll

Lista todos os agendamentos.

Se der certo, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Lista de agendamentos",
  "data": []
}
```

## GET /appointments/list/{appointmentId}

Busca agendamento pelo ID.

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do appointment e obrigatorio e deve ser um numero inteiro"
}
```

Se o agendamento nao existir, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "FAQ nao encontrado"
}
```

Se encontrar, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "appointment encontrado",
  "data": {
    "id": 1,
    "clientId": 1,
    "employeeId": 3,
    "serviceId": 1,
    "dateTime": "2026-07-01 14:00:00",
    "rating": 5,
    "comment": "Cliente frequente",
    "status": "scheduled"
  }
}
```

## POST /appointments/create

Cria agendamento.

Body:

```json
{
  "clientId": 1,
  "employeeId": 3,
  "serviceId": 1,
  "dateTime": "2026-07-01 14:00:00",
  "rating": 5,
  "comment": "Observacao opcional"
}
```

Se faltar `clientId`, `employeeId`, `serviceId` ou `dateTime`, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Preencha tudo."
}
```

Se o cliente nao existir ou nao for do tipo cliente, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Cliente invalido."
}
```

Se o funcionario nao existir ou nao for do tipo funcionario, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Funcionario invalido."
}
```

Se a data estiver em formato invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Formato invalido. Use YYYY-MM-DD HH:MM:SS."
}
```

Se a data for menor que a data atual, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "A data do agendamento deve ser maior que a data atual."
}
```

Se ja existir agendamento para o funcionario no mesmo horario, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Ja existe um agendamento para este funcionario neste horario."
}
```

Se acontecer erro ao inserir, retorna:

```json
{
  "code": 500,
  "type": "error",
  "status": "internal_server_error",
  "message": "Mensagem do erro retornada pelo model"
}
```

Se criar com sucesso, retorna:

```json
{
  "code": 201,
  "type": "success",
  "status": "created",
  "message": "appointment inserido com sucesso",
  "data": {
    "id": 1,
    "clientId": 1,
    "employeeId": 3,
    "serviceId": 1,
    "dateTime": "2026-07-01 14:00:00",
    "comment": "Observacao opcional",
    "status": "scheduled"
  }
}
```

## PUT /appointments/update/{appointmentId}

Atualiza agendamento.

Body:

```json
{
  "clientId": 1,
  "employeeId": 3,
  "serviceId": 1,
  "dateTime": "2026-07-01 15:00:00",
  "rating": 5,
  "comment": "Atualizado",
  "status": "confirmed"
}
```

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do appointment e obrigatorio e deve ser um numero inteiro"
}
```

Se o agendamento nao existir, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "Agendamento nao encontrado"
}
```

Se o cliente for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Cliente invalido."
}
```

Se o funcionario for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Funcionario invalido."
}
```

Se o status nao for permitido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Status invalido."
}
```

Status permitidos: `scheduled`, `confirmed`, `in_progress`, `completed`, `canceled`.

Se a data estiver em formato invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Formato invalido. Use YYYY-MM-DD HH:MM:SS."
}
```

Se atualizar com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "appointment atualizado com sucesso",
  "data": {
    "id": 1,
    "clientId": 1,
    "employeeId": 3,
    "serviceId": 1,
    "dateTime": "2026-07-01 15:00:00",
    "rating": 5,
    "comment": "Atualizado",
    "status": "confirmed"
  }
}
```

## DELETE /appointments/delete/{appointmentId}

Remove ou cancela agendamento.

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do appointment e obrigatorio e deve ser um numero inteiro"
}
```

Se o agendamento nao existir, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "Appointment nao existe"
}
```

Se o agendamento ja estiver cancelado, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "O appointment ja foi removido"
}
```

Se nao conseguir remover, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "O appointment nao pode ser removido"
}
```

Se remover com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "appointment removido com sucesso"
}
```

---

# Servicos

Grupo: `/services`

Controller: `Services\Services`

## GET /services/list

Lista servicos.

Se der certo, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Lista de service",
  "data": []
}
```

## GET /services/list/{serviceId}

Busca servico pelo ID.

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do service e obrigatorio e deve ser um numero inteiro"
}
```

Se o servico nao existir, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "service nao encontrado"
}
```

Se encontrar, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "service encontrado",
  "data": {
    "id": 1,
    "name": "Corte",
    "description": "Corte feminino",
    "durationMinutes": 60,
    "active": 1
  }
}
```

## POST /services/create

Cria servico.

Precisa de token de admin.

Body:

```json
{
  "name": "Corte",
  "description": "Corte feminino",
  "price": 80,
  "durationMinutes": 60
}
```

Se nao enviar token valido de admin, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se faltar algum campo obrigatorio, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "Preencha tudo."
}
```

Se acontecer erro ao inserir, retorna:

```json
{
  "code": 500,
  "type": "error",
  "status": "internal_server_error",
  "message": "Mensagem do erro retornada pelo model"
}
```

Se criar com sucesso, retorna:

```json
{
  "code": 201,
  "type": "success",
  "status": "created",
  "message": "service inserido com sucesso",
  "data": {
    "id": 1,
    "name": "Corte",
    "description": "Corte feminino",
    "price": 80,
    "durationMinutes": 60
  }
}
```

## PUT /services/update/{serviceId}

Atualiza servico.

Precisa de token de admin.

Body:

```json
{
  "name": "Corte e Escova",
  "description": "Corte com finalizacao",
  "price": 120,
  "durationMinutes": 90
}
```

Se nao enviar token valido de admin, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID invalido"
}
```

Se o servico nao existir, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "Service nao encontrado"
}
```

Se atualizar com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "Service atualizado com sucesso",
  "data": {
    "id": 1,
    "name": "Corte e Escova",
    "description": "Corte com finalizacao",
    "price": 120,
    "durationMinutes": 90
  }
}
```

## DELETE /services/delete/{serviceId}

Remove servico por soft delete.

Precisa de token de admin.

Se nao enviar token valido de admin, retorna:

```json
{
  "code": 401,
  "type": "error",
  "status": "unauthorized",
  "message": "Usuario nao autenticado"
}
```

Se o ID for invalido, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "ID do service e obrigatorio e deve ser um numero inteiro"
}
```

Se o servico nao existir, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "service nao existe"
}
```

Se nao conseguir remover, retorna:

```json
{
  "code": 400,
  "type": "error",
  "status": "bad_request",
  "message": "O service nao pode ser cancelado"
}
```

Se remover com sucesso, retorna:

```json
{
  "code": 200,
  "type": "success",
  "status": "success",
  "message": "service removido com sucesso"
}
```

---

# Rota nao encontrada

Se acessar uma rota que nao existe no `index.php`, retorna:

```json
{
  "code": 404,
  "type": "error",
  "status": "not_found",
  "message": "O recurso solicitado nao existe."
}
```
