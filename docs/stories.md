# User Stories (Histórias de usuário)

Terms in English, with the Portuguese translation in parentheses.
(Termos em inglês, com a tradução em português entre parênteses.)

## PROJMDL-1 · Login (Login)

### S1. Log in with valid credentials (Entrar com credenciais válidas)

As a user (admin or resident), I want to log in with my credentials, so that I can access the features available for my role.
(Como usuário (administrador ou morador), quero entrar com minhas credenciais, para acessar as funcionalidades disponíveis para o meu perfil.)

**Acceptance Criteria (Critérios de aceite)**
- AC1: An Admin with valid credentials is redirected to the admin dashboard. (Um administrador com credenciais válidas é redirecionado ao painel administrativo.)
- AC2: A Resident with valid credentials is redirected to the resident home page. (Um morador com credenciais válidas é redirecionado à página inicial do morador.)
- AC3: The session persists after reloading the page. (A sessão persiste após recarregar a página.)

### S2. Handle invalid credentials and account lockout (Tratar credenciais inválidas e bloqueio de conta)

As a community manager, I want invalid login attempts to be rejected and repeated failures to lock the account, so that residents' accounts are protected from unauthorized access.
(Como gestor do condomínio, quero que tentativas de login inválidas sejam rejeitadas e falhas repetidas bloqueiem a conta, para proteger as contas dos moradores contra acesso não autorizado.)

**Acceptance Criteria (Critérios de aceite)**
- AC1: An incorrect password shows a generic message ("Invalid username or password") without revealing which field is wrong. (Uma senha incorreta mostra uma mensagem genérica ("Usuário ou senha inválidos"), sem revelar qual campo está errado.)
- AC2: Empty fields show validation errors and do not call the API. (Campos vazios mostram erros de validação e não chamam a API.)
- AC3: After 3 consecutive failed attempts, the account is locked for 5 minutes. (Após 3 tentativas falhas consecutivas, a conta é bloqueada por 5 minutos.)
- AC4: While the account is locked, even the correct password is rejected with a lockout message. (Enquanto a conta está bloqueada, até a senha correta é rejeitada, com uma mensagem de bloqueio.)

### S3. Enforce role-based access (Aplicar controle de acesso por perfil)

As an admin, I want each role to access only its own pages and endpoints, so that residents cannot reach administrative features.
(Como administrador, quero que cada perfil acesse apenas suas próprias páginas e endpoints, para que moradores não alcancem funcionalidades administrativas.)

**Acceptance Criteria (Critérios de aceite)**
- AC1: A Resident who navigates to an admin route is blocked (403 from the API, redirect in the UI). (Um morador que acessa uma rota de administrador é barrado (403 na API, redirecionamento na interface).)
- AC2: A user without a session who navigates to a protected route is redirected to the login page. (Um usuário sem sessão que acessa uma rota protegida é redirecionado para a página de login.)
- AC3: Logging out invalidates the session, and the browser's back button does not reopen protected pages. (Sair invalida a sessão, e o botão "voltar" do navegador não reabre páginas protegidas.)

## PROJMDL-2 · Notices (Avisos)

### S4. Admin publishes a notice (Administrador publica um aviso)

As an admin, I want to publish a notice with a title and a body, so that residents are informed about community matters.
(Como administrador, quero publicar um aviso com título e corpo, para que os moradores sejam informados sobre assuntos do condomínio.)

**Acceptance Criteria (Critérios de aceite)**
- AC1: The title is required and limited to 100 characters. (O título é obrigatório e limitado a 100 caracteres.)
- AC2: The body is required. (O corpo é obrigatório.)
- AC3: A published notice appears at the top of the list with an automatic publication date. (Um aviso publicado aparece no topo da lista, com data de publicação automática.)

### S5. Admin edits and deletes a notice (Administrador edita e exclui um aviso)

As an admin, I want to edit or delete a notice I published, so that the information shown to residents stays accurate and up to date.
(Como administrador, quero editar ou excluir um aviso que publiquei, para que as informações mostradas aos moradores permaneçam corretas e atualizadas.)

**Acceptance Criteria (Critérios de aceite)**
- AC1: Editing a notice updates its title and body in the list. (Editar um aviso atualiza seu título e corpo na lista.)
- AC2: Deleting a notice requires confirmation. (Excluir um aviso exige confirmação.)
- AC3: Canceling the confirmation keeps the notice. (Cancelar a confirmação mantém o aviso.)
- AC4: A deleted notice disappears from the resident's list. (Um aviso excluído desaparece da lista do morador.)

### S6. Resident views notices (Morador visualiza avisos)

As a resident, I want to see the latest notices in a paginated list, so that I can stay informed without being able to change them.
(Como morador, quero ver os avisos mais recentes em uma lista paginada, para me manter informado sem poder alterá-los.)

**Acceptance Criteria (Critérios de aceite)**
- AC1: Notices are sorted from newest to oldest. (Os avisos são ordenados do mais recente para o mais antigo.)
- AC2: The list is paginated with 10 notices per page. (A lista é paginada, com 10 avisos por página.)
- AC3: The resident does not see the create, edit, or delete buttons. (O morador não vê os botões de criar, editar ou excluir.)
- AC4: Write requests to the API made by a resident return 403. (Requisições de escrita à API feitas por um morador retornam 403.)

### S7. Resident filters notices (Morador filtra avisos)

As a resident, I want to filter notices by text, so that I can quickly find the information I need.
(Como morador, quero filtrar avisos por texto, para encontrar rapidamente a informação de que preciso.)

**Acceptance Criteria (Critérios de aceite)**
- AC1: The text filter searches the title and is case-insensitive. (O filtro de texto busca no título e não diferencia maiúsculas de minúsculas.)
- AC2: When there are no results, the message "No notices found" is displayed. (Quando não há resultados, a mensagem "Nenhum aviso encontrado" é exibida.)
- AC3: Clearing the filter restores the full list. (Limpar o filtro restaura a lista completa.)

## PROJMDL-3 · Reservations (Reservas)

### S8. Resident books a common area (Morador reserva uma área comum)

As a resident, I want to book a common area for a specific date and time slot, so that I can use it for my event.
(Como morador, quero reservar uma área comum para uma data e horário específicos, para usá-la no meu evento.)

**Acceptance Criteria (Critérios de aceite)**
- AC1: The resident selects the area (Party Room or BBQ Area), the date, and the time slot. (O morador seleciona a área (Salão de Festas ou Churrasqueira), a data e o horário.)
- AC2: The reservation is created with status "Confirmed" and appears under "My reservations". (A reserva é criada com status "Confirmada" e aparece em "Minhas reservas".)
- AC3: All fields are required. (Todos os campos são obrigatórios.)

### S9. System prevents invalid reservations (Sistema impede reservas inválidas)

As a resident, I want the system to reject conflicting or invalid bookings, so that common areas are never double-booked or reserved in the past.
(Como morador, quero que o sistema rejeite reservas conflitantes ou inválidas, para que as áreas comuns nunca sejam reservadas em duplicidade ou no passado.)

**Acceptance Criteria (Critérios de aceite)**
- AC1: Booking an area and time slot that are already taken is rejected with a conflict message. (Reservar uma área e horário já ocupados é rejeitado, com mensagem de conflito.)
- AC2: Booking a date in the past is rejected. (Reservar uma data no passado é rejeitado.)
- AC3: Each resident is limited to 2 active reservations; the third is rejected. (Cada morador é limitado a 2 reservas ativas; a terceira é rejeitada.)

### S10. Resident cancels a reservation (Morador cancela uma reserva)

As a resident, I want to cancel a reservation I no longer need, so that the time slot becomes available for my neighbors.
(Como morador, quero cancelar uma reserva de que não preciso mais, para que o horário fique disponível para meus vizinhos.)

**Acceptance Criteria (Critérios de aceite)**
- AC1: Canceling more than 24 hours in advance is allowed, and the status changes to "Canceled". (Cancelar com mais de 24 horas de antecedência é permitido, e o status muda para "Cancelada".)
- AC2: Canceling less than 24 hours in advance is rejected. (Cancelar com menos de 24 horas de antecedência é rejeitado.)
- AC3: A canceled time slot becomes available again for other residents. (Um horário cancelado volta a ficar disponível para outros moradores.)
- AC4: Canceling frees one slot in the 2-reservation limit. (Cancelar libera uma vaga no limite de 2 reservas.)

## Project name (Nome do projeto)

"Mdl" comes from Morada da Lagoa. Since it means nothing to an English-speaking reader, a descriptive name is suggested:
("Mdl" vem de Morada da Lagoa. Como não significa nada para um leitor de língua inglesa, sugere-se um nome descritivo:)

- **Lagoon Community Simplified**: keeps the reference to the Lagoon (preferred). (mantém a referência à Lagoa; preferido.)
- **Community Portal QA Sandbox**: makes the QA-study purpose clear. (deixa claro o propósito de estudo de QA.)
- **Simplified Community App**: literal translation of the current name. (tradução literal do nome atual.)

Repository name in kebab-case: `lagoon-community-simplified`. The Jira key (PROJMDL) shows on every ticket; if it should change (e.g. to `LCS`), do it in the space settings before creating more tickets.
(Nome do repositório em kebab-case: `lagoon-community-simplified`. A chave do Jira (PROJMDL) aparece em todos os tickets; se for mudar, por exemplo para `LCS`, faça nas configurações do espaço antes de criar mais tickets.)
