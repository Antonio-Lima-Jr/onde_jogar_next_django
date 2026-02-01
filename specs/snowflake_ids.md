# Snowflake IDs – Specification

## 1. Objetivo

Esta especificação define o uso de **Snowflake IDs (64-bit)** como identificadores primários para **User** e **Event** no projeto **Onde Jogar**.

Os objetivos principais são:
- Garantir **unicidade global** sem dependência do banco
- IDs **ordenáveis por tempo**
- Boa performance em índices PostgreSQL
- Compatibilidade com arquitetura distribuída (containers / múltiplos workers)

---

## 2. Escopo

### Modelos que utilizarão Snowflake ID

| Modelo | Campo | Tipo |
|------|------|------|
| User | id | BIGINT (Snowflake) |
| Event | id | BIGINT (Snowflake) |
| Participation | id | BIGINT (Snowflake) |
| Invite | id | BIGINT (Snowflake) |

### Fora de escopo (por enquanto)
- Logs
- Tabelas técnicas
- Histórico interno

---

## 3. Implementação oficial

A implementação oficial de Snowflake ID está localizada em:

```
packages/snowflake-id/
```

Essa lib é tratada como **pacote Python independente**, reutilizável e versionável.

Ela fornece:
- `SnowflakeGenerator`
- Providers de `worker_id`
- Campo Django pronto: `DjangoSnowflakeIDField`

---

## 4. Layout do Snowflake ID

Layout adotado (63 bits – positivo em int64):

| Parte | Bits | Descrição |
|----|----|----|
| Timestamp | 41 | Milissegundos desde epoch customizada |
| Worker ID | 10 | Identificador da instância |
| Sequence | 12 | Contador por ms por worker |

Capacidade:
- **4096 IDs / ms / worker**
- ~4 milhões IDs / segundo por worker

Epoch customizada:

```
2024-01-01T00:00:00Z
```

---

## 5. Conceito importante: Sequence

- `sequence` **não é global**
- `sequence` **reseta para 0** quando:
  - o timestamp muda
  - o processo reinicia

Isso é **esperado e correto**.

A unicidade é garantida pela combinação:

```
(timestamp, worker_id, sequence)
```

---

## 6. Worker ID (regra crítica)

Cada **processo que gera IDs** deve ter um `WORKER_ID` único.

### Forma oficial

Via variável de ambiente:

```
WORKER_ID=1
```

### Responsabilidade

- Docker / Compose / Infra definem `WORKER_ID`
- Código **não tenta gerar automaticamente** em produção

Falhas de configuração de `WORKER_ID` podem gerar colisões.

---

## 7. Uso no Django (padrão oficial)

### 7.1 Inicialização do generator

```python
from snowflake_id import SnowflakeGenerator
from snowflake_id.worker import EnvWorkerIdProvider

generator = SnowflakeGenerator(
    worker_id_provider=EnvWorkerIdProvider("WORKER_ID")
)
```

---

### 7.2 User model

```python
from django.contrib.auth.models import AbstractUser
from snowflake_id.django_field import DjangoSnowflakeIDField

class User(AbstractUser):
    id = DjangoSnowflakeIDField()
```

⚠️ Não usar `AutoField` ou `BigAutoField`.

---

### 7.3 Event model

```python
from django.db import models
from snowflake_id.django_field import DjangoSnowflakeIDField

class Event(models.Model):
    id = DjangoSnowflakeIDField()
    name = models.CharField(max_length=255)
```

---

### 7.4 Participation model

```python
from django.db import models
from snowflake_id.django_field import DjangoSnowflakeIDField

class Participation(models.Model):
    id = DjangoSnowflakeIDField()
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    event = models.ForeignKey("Event", on_delete=models.CASCADE)
```

---

### 7.5 Invite model

```python
from django.db import models
from snowflake_id.django_field import DjangoSnowflakeIDField

class Invite(models.Model):
    id = DjangoSnowflakeIDField()
    event = models.ForeignKey("Event", on_delete=models.CASCADE)
    invited_by = models.ForeignKey("User", on_delete=models.CASCADE, related_name="sent_invites")
    invited_user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="received_invites")
```

