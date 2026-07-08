# Referência da API — atelier

> **Fonte da verdade**: PHP Resources em `../boilerplate-api/app/Http/Resources/*.php`.
> **AVISO**: O arquivo `api.json` (OpenAPI gerado automaticamente) é **impreciso** — omite campos
> condicionais (`whenLoaded()`), distorce tipos (ex.: `integer` vs `string` em valores calculados
> por services) e está desatualizado. Consulte sempre as PHP Resources.

---

## Convenções gerais

- **URL base**: `/api/v1`
- **Envelope de sucesso** (recurso único): `{ data: { … }, message: string | null }`
- **Envelope de sucesso** (lista paginada): `{ data: [ … ], links: { … }, meta: { … } }`
- **Envelope de erro**: [RFC 7807](https://tools.ietf.org/html/rfc7807) `application/problem+json`
  - `{ type, title, status, detail, errors? }`
- **IDs**: ULIDs (string) em vez de inteiros — a menos que indicado.
- **Valores monetários**: em **centavos** (inteiro). Ex.: R$ 15,00 → `1500`.
- **Autenticação**: `POST /login` → cookie `access_token` (httpOnly) + token no corpo.
- **CSRF**: `GET /sanctum/csrf-cookie` antes de mutações.

---

## Parâmetros de query (listagens)

| Parâmetro   | Tipo         | Descrição                    |
| ----------- | ------------ | ---------------------------- |
| `page`      | int          | Número da página (1-based)   |
| `per_page`  | int          | Itens por página             |
| `search`    | string       | Busca textual multi-campos   |
| `sort`      | string       | Nome do campo para ordenação |
| `direction` | `asc`/`desc` | Direção da ordenação         |

---

## Endpoints

### Health

| Método | Rota         | Descrição          |
| ------ | ------------ | ------------------ |
| GET    | `/v1/health` | Saúde da aplicação |

**Resposta**:

```json
{
  "data": {
    "status": "ok",
    "checks": { "database": "ok", "cache": "ok", "storage": "ok" }
  }
}
```

---

### Autenticação

| Método | Rota                | Descrição                      |
| ------ | ------------------- | ------------------------------ |
| POST   | `/v1/login`         | Login (email + password)       |
| POST   | `/v1/logout`        | Logout                         |
| GET    | `/v1/user`          | Usuário autenticado            |
| PUT    | `/v1/user/password` | Alterar senha                  |
| DELETE | `/v1/user`          | Excluir conta                  |
| GET    | `/v1/user/export`   | Exportar dados (portabilidade) |

**`POST /v1/login`** — corpo:

```json
{
  "email": "user@example.com",
  "password": "secret",
  "code": "123456" // opcional, para 2FA
}
```

**Resposta** (`loginResponseSchema`):

```json
{
  "data": {
    "user": {
      /* UserResource */
    },
    "token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

**`GET /v1/user`** — resposta: sempre envelopada em `{ data: UserResource }`.

---

### Usuários

| Método | Rota                           | Descrição              |
| ------ | ------------------------------ | ---------------------- |
| GET    | `/v1/users`                    | Listar usuários        |
| POST   | `/v1/users`                    | Criar usuário          |
| GET    | `/v1/users/{user}`             | Detalhe do usuário     |
| PATCH  | `/v1/users/{user}`             | Atualizar usuário      |
| DELETE | `/v1/users/{user}`             | Excluir (lógica)       |
| POST   | `/v1/users/{user}/restore`     | Restaurar              |
| POST   | `/v1/users/{user}/erase`       | Eliminar dados (LGPD)  |
| POST   | `/v1/users/{user}/impersonate` | Iniciar personificação |
| POST   | `/v1/users/{user}/avatar`      | Upload avatar          |
| DELETE | `/v1/users/{user}/avatar`      | Remover avatar         |

**`UserResource`** (fonte: `UserResource.php`):

```json
{
  "id": "01ABC...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user|admin|master",
  "is_active": true,
  "admission_date": "2025-01-15",
  "birthday": "1990-05-20",
  "phone": "(11) 99999-9999",
  "has_password": true,
  "avatar_url": "https://storage.exemplo.com/avatars/...",
  "two_factor_enabled": false,
  "email_verified_at": "2025-01-15T12:00:00.000000Z",
  "impersonated_by": null,
  "created_at": "2025-01-15T12:00:00.000000Z",
  "updated_at": "2025-01-15T12:00:00.000000Z"
}
```

---

### Auditoria

| Método | Rota                      | Descrição             |
| ------ | ------------------------- | --------------------- |
| GET    | `/v1/users/audits`        | Auditoria geral       |
| GET    | `/v1/users/{user}/audits` | Auditoria por usuário |

**Parâmetros**: `page`, `perPage`, `event` (filtro por evento).

**`AuditResource`** (fonte: `AuditResource.php`):

```json
{
  "id": 1,
  "event": "created|updated|deleted|restored",
  "auditable_type": "App\\Models\\User",
  "auditable_id": "01ABC...",
  "user_id": "01ABC...",
  "impersonator_id": null,
  "old_values": { "name": "Old Name" },
  "new_values": { "name": "New Name" },
  "ip_address": "192.168.1.1",
  "url": "http://localhost:3000/users",
  "created_at": "2025-01-15T12:00:00.000000Z"
}
```

---

### Catálogo (materiais)

| Método | Rota                              | Descrição                     |
| ------ | --------------------------------- | ----------------------------- |
| GET    | `/v1/clay-suppliers`              | Listar fornecedores de argila |
| POST   | `/v1/clay-suppliers`              | Criar                         |
| GET    | `/v1/clay-suppliers/{id}`         | Detalhe                       |
| PATCH  | `/v1/clay-suppliers/{id}`         | Atualizar                     |
| DELETE | `/v1/clay-suppliers/{id}`         | Excluir                       |
| POST   | `/v1/clay-suppliers/{id}/restore` | Restaurar                     |

_(Mesmo padrão para `clays`, `glaze-suppliers`, `glazes`, `piece-categories`, `firing-cycles`)_

**`ClaySupplierResource`** (fonte: `ClaySupplierResource.php`):

```json
{
  "id": "01ABC...",
  "name": "Fornecedor A",
  "email": "fornecedor@example.com",
  "phone": "(11) 99999-9999",
  "created_at": "...",
  "updated_at": "..."
}
```

**`ClayResource`** (fonte: `ClayResource.php`):

```json
{
  "id": "01ABC...",
  "clay_supplier_id": "01DEF...",
  "name": "Argila Branca",
  "description": "Argila de alta temperatura",
  "price": 2500,
  "created_at": "...",
  "updated_at": "..."
}
```

**`GlazeResource`** — idêntico ao `ClayResource` (com `glaze_supplier_id`).

**`PieceCategoryResource`** (fonte: `PieceCategoryResource.php`):

```json
{
  "id": "01ABC...",
  "name": "Vasos",
  "profit_margin": 1.5,
  "is_available": true,
  "available_until": "2025-12-31",
  "created_at": "...",
  "updated_at": "..."
}
```

**`FiringCycleResource`** (fonte: `FiringCycleResource.php`):

```json
{
  "id": "01ABC...",
  "name": "Alta temperatura",
  "cycle": 1,
  "duration": 480,
  "temperature": 1200.5,
  "price_per_unit": 500,
  "created_at": "...",
  "updated_at": "..."
}
```

---

### Compras de material

| Método | Rota                                  | Descrição |
| ------ | ------------------------------------- | --------- |
| GET    | `/v1/material-purchases`              | Listar    |
| POST   | `/v1/material-purchases`              | Criar     |
| GET    | `/v1/material-purchases/{id}`         | Detalhe   |
| PATCH  | `/v1/material-purchases/{id}`         | Atualizar |
| DELETE | `/v1/material-purchases/{id}`         | Excluir   |
| POST   | `/v1/material-purchases/{id}/restore` | Restaurar |

**`MaterialPurchaseResource`** (fonte: `MaterialPurchaseResource.php`):

```json
{
  "id": "01ABC...",
  "material": { "id": "01DEF...", "name": "Argila X", "type": "clay" },
  "supplier": {
    "id": "01GHI...",
    "name": "Fornecedor A",
    "type": "clay_supplier"
  },
  "description": "Compra mensal",
  "freight": 1500,
  "invoice_number": "NF-12345",
  "is_received": true,
  "lot": "LOT-001",
  "payment_method": "credit_card|pix|bank_transfer",
  "purchase_date": "2025-01-15",
  "quantity": 10.5,
  "receipt_date": "2025-01-20",
  "total_price": 50000,
  "unit_price": 4762,
  "created_at": "...",
  "updated_at": "..."
}
```

---

### Produção e vendas

| Método | Rota                      | Descrição    |
| ------ | ------------------------- | ------------ |
| GET    | `/v1/pieces`              | Listar peças |
| POST   | `/v1/pieces`              | Criar        |
| GET    | `/v1/pieces/{id}`         | Detalhe      |
| PATCH  | `/v1/pieces/{id}`         | Atualizar    |
| DELETE | `/v1/pieces/{id}`         | Excluir      |
| POST   | `/v1/pieces/{id}/restore` | Restaurar    |

**`PieceResource`** (fonte: `PieceResource.php`):

```json
{
  "id": "01ABC...",
  "clay_id": "01DEF...",
  "glaze_id": "01GHI...",
  "piece_category_id": "01JKL...",
  "user_id": "01MNO...",
  "kind": "piece|commission",
  "name": "Vaso Decorativo",
  "clay_amount": 1.5,
  "clay_unit_price": 2500,
  "glaze_amount": 0.3,
  "glaze_unit_price": 1800,
  "base_cost": 2000,
  "price": 15000,
  "production_cost": 8000,
  "profit_margin": 1.5,
  "firing_cycles": [{ "id": "01PQR...", "name": "Alta", "price": 500 }],
  "created_at": "...",
  "updated_at": "..."
}
```

> `firing_cycles` e `glaze_id`/`piece_category_id`/`glaze_amount`/`glaze_unit_price`/`profit_margin`
> são **condicionais** (`whenLoaded()`) ou opcionais — podem ser `null`.

**Mesmo padrão CRUD para**: `commission-orders`, `customers`, `piece-charges`.

**`CommissionOrderResource`** (fonte: `CommissionOrderResource.php`):

```json
{
  "id": "01ABC...",
  "customer": { "id": "01DEF...", "name": "Cliente A" },
  "status": "pending|in_production|ready|delivered",
  "order_date": "2025-01-15",
  "delivery_date": "2025-02-15",
  "is_paid": false,
  "paid_at": null,
  "description": "Encomenda de aniversário",
  "pieces_total": 30000,
  "production_cost_total": 15000,
  "realized_margin": 13000,
  "sale_total": 32000,
  "sale_total_override": null,
  "shipping_charged": 2000,
  "shipping_cost": 1500,
  "pieces": [
    {
      "id": "01GHI...",
      "name": "Vaso",
      "price": 15000,
      "production_cost": 7500
    }
  ],
  "created_at": "...",
  "updated_at": "..."
}
```

> `pieces` é condicional (`whenLoaded('pieces')`).

**`CustomerResource`** (fonte: `CustomerResource.php`):

```json
{
  "id": "01ABC...",
  "name": "Cliente A",
  "email": "cliente@example.com",
  "phone": "(11) 99999-9999",
  "description": "Cliente VIP",
  "created_at": "...",
  "updated_at": "..."
}
```

**`PieceChargeResource`** (fonte: `PieceChargeResource.php`):

```json
{
  "id": "01ABC...",
  "piece_id": "01DEF...",
  "user_id": "01GHI...",
  "amount": 5000,
  "due_date": "2025-02-15",
  "is_paid": true,
  "paid_at": "2025-02-10T12:00:00.000000Z",
  "created_at": "...",
  "updated_at": "..."
}
```

---

### Aulas

| Método | Rota                              | Descrição            |
| ------ | --------------------------------- | -------------------- |
| GET    | `/v1/single-classes`              | Listar aulas avulsas |
| POST   | `/v1/single-classes`              | Criar                |
| GET    | `/v1/single-classes/{id}`         | Detalhe              |
| PATCH  | `/v1/single-classes/{id}`         | Atualizar            |
| DELETE | `/v1/single-classes/{id}`         | Excluir              |
| POST   | `/v1/single-classes/{id}/restore` | Restaurar            |

_(Mesmo padrão para `recurrent-classes`, `enrollments`, `bills`, `tuition-fees`)_

**`SingleClassResource`** (fonte: `SingleClassResource.php`):

```json
{
  "id": "01ABC...",
  "start_datetime": "2025-01-15T14:00:00.000000Z",
  "end_datetime": "2025-01-15T16:00:00.000000Z",
  "is_replacement": false,
  "price": 5000,
  "users": [{ "id": "01DEF...", "name": "Aluno A" }],
  "created_at": "...",
  "updated_at": "..."
}
```

> `users` é condicional (`whenLoaded('users')`).

**`RecurrentClassResource`** (fonte: `RecurrentClassResource.php`):

```json
{
  "id": "01ABC...",
  "day_of_the_week": 1,
  "start_time": "14:00:00",
  "end_time": "16:00:00",
  "users": [{ "id": "01DEF...", "name": "Aluno A" }],
  "created_at": "...",
  "updated_at": "..."
}
```

**`EnrollmentResource`** (fonte: `EnrollmentResource.php`):

```json
{
  "id": "01ABC...",
  "user_id": "01DEF...",
  "annual_fee": 60000,
  "annual_fee_due_date": "2025-03-15",
  "annual_fee_is_paid": false,
  "annual_fee_paid_at": null,
  "is_exempt_from_annual_fee": false,
  "is_exempt_from_piece_charges": false,
  "is_exempt_from_tuition_fee": false,
  "created_at": "...",
  "updated_at": "..."
}
```

---

### Financeiro

| Método | Rota                     | Descrição             |
| ------ | ------------------------ | --------------------- |
| GET    | `/v1/bills`              | Listar contas a pagar |
| POST   | `/v1/bills`              | Criar                 |
| GET    | `/v1/bills/{id}`         | Detalhe               |
| PATCH  | `/v1/bills/{id}`         | Atualizar             |
| DELETE | `/v1/bills/{id}`         | Excluir               |
| POST   | `/v1/bills/{id}/restore` | Restaurar             |

**`BillResource`** (fonte: `BillResource.php`):

```json
{
  "id": "01ABC...",
  "name": "Aluguel",
  "description": "Aluguel do espaço",
  "value": 150000,
  "due_date": "2025-01-10",
  "is_recurrent": true,
  "reference_month": 1,
  "reference_year": 2025,
  "created_at": "...",
  "updated_at": "..."
}
```

**`TuitionFeeResource`** (fonte: `TuitionFeeResource.php`):

```json
{
  "id": "01ABC...",
  "enrollment_id": "01DEF...",
  "amount": 25000,
  "due_date": "2025-02-10",
  "is_paid": true,
  "paid_at": "2025-02-05T12:00:00.000000Z",
  "created_at": "...",
  "updated_at": "..."
}
```

---

### Configurações

| Método | Rota                | Descrição           |
| ------ | ------------------- | ------------------- |
| GET    | `/v1/settings`      | Obter configurações |
| PUT    | `/v1/settings`      | Atualizar           |
| POST   | `/v1/settings/logo` | Upload logo         |
| DELETE | `/v1/settings/logo` | Remover logo        |

**`SettingResource`** (fonte: `SettingResource.php`):

```json
{
  "annual_enrollment_cost": 60000,
  "base_cost": 1000,
  "clay_amount_multiplier": 1.5,
  "default_profit_margin": 2.0,
  "piece_charge_billing_grace_days": 30,
  "tuition_fee_due_day_of_month": 10,
  "tuition_monthly_cost": 25000,
  "logo_url": "https://storage.exemplo.com/logos/...",
  "updated_at": "..."
}
```

---

### Notificações

| Método | Rota                          | Descrição               |
| ------ | ----------------------------- | ----------------------- |
| GET    | `/v1/notifications`           | Listar notificações     |
| POST   | `/v1/notifications/{id}/read` | Marcar como lida        |
| POST   | `/v1/notifications/read-all`  | Marcar todas como lidas |

**`NotificationResource`** (fonte: `NotificationResource.php`):

```json
{
  "id": "abc123...",
  "type": "App\\Notifications\\SomeNotification",
  "data": { "type": "...", "message": "..." },
  "read_at": null,
  "created_at": "..."
}
```

---

### Relatórios

| Método | Rota                  | Descrição        |
| ------ | --------------------- | ---------------- |
| GET    | `/v1/reports/monthly` | Relatório mensal |

**Parâmetros**: `month` (int), `year` (int).

---

### Estudante (extrato)

| Método | Rota                               | Descrição        |
| ------ | ---------------------------------- | ---------------- |
| GET    | `/v1/students/{student}/statement` | Extrato do aluno |

---

## Envelope de erro (RFC 7807)

```json
{
  "type": "https://example.com/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "O campo email é obrigatório.",
  "errors": {
    "email": ["O campo email é obrigatório."]
  }
}
```

| Status | Significado                     |
| ------ | ------------------------------- |
| 401    | Não autenticado                 |
| 403    | Não autorizado                  |
| 404    | Recurso não encontrado          |
| 409    | Conflito (ex.: email duplicado) |
| 422    | Erro de validação               |
| 429    | Muitas requisições              |
