# Configuração Evolution API para WhatsApp CRM

## Requisitos
- Docker e Docker Compose instalados
- Portas 8080, 5432 e 6379 disponíveis

## Instalação na VPS

### 1. Atualizar o repositório
```bash
cd /var/www/acessar
git pull origin main
```

### 2. Parar containers antigos (se existirem)
```bash
docker compose down
# ou se estiver usando o compose antigo:
docker-compose down
```

### 3. Subir os novos containers
```bash
docker compose up -d
```

### 4. Verificar se está tudo rodando
```bash
docker compose ps
docker logs evolution-evolution-api-1 --tail 50
```

### 5. Testar a API
```bash
EVO_URL="http://localhost:8080"
EVO_KEY="lov_evo_2024_X7kM9pL2qR5tY8wZ"

# Verificar se Redis está conectado (não deve ter erros de redis disconnected)
docker logs evolution-evolution-api-1 2>&1 | grep -i redis | tail -5

# Listar instâncias
curl -sS -H "apikey: $EVO_KEY" "$EVO_URL/instance/fetchInstances" | head -c 200

# Criar nova instância
INSTANCE="teste_$(date +%s)"
curl -sS -X POST -H "apikey: $EVO_KEY" -H "Content-Type: application/json" \
  -d "{\"instanceName\":\"$INSTANCE\",\"qrcode\":true,\"integration\":\"WHATSAPP-BAILEYS\"}" \
  "$EVO_URL/instance/create"

# Aguardar 5 segundos e pegar QR Code
sleep 5
curl -sS -H "apikey: $EVO_KEY" "$EVO_URL/instance/connect/$INSTANCE"
# Deve retornar: {"code":"2@...", "base64":"data:image/png;base64,...", "pairingCode":"..."}
```

## Variáveis Importantes

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `AUTHENTICATION_API_KEY` | `lov_evo_2024_X7kM9pL2qR5tY8wZ` | Chave de autenticação da API |
| `CACHE_REDIS_ENABLED` | `true` | **Crítico!** Sem Redis o QR fica em `count:0` |
| `CACHE_REDIS_URI` | `redis://redis:6379/6` | URI do Redis |
| `QRCODE_LIMIT` | `30` | Máximo de tentativas de QR antes de expirar |

## Solução de Problemas

### QR Code não aparece (count:0)
1. Verificar se Redis está rodando:
   ```bash
   docker exec evolution-redis redis-cli ping
   # Deve retornar: PONG
   ```

2. Ver logs da Evolution:
   ```bash
   docker logs evolution-evolution-api-1 --tail 100 | grep -E "(redis|QRCODE|error)"
   ```

3. Se ainda tiver `redis disconnected`, reinicie tudo:
   ```bash
   docker compose down
   docker compose up -d
   ```

### Instância fica em "connecting" para sempre
```bash
# Deletar a instância problemática
curl -X DELETE -H "apikey: $EVO_KEY" "$EVO_URL/instance/delete/NOME_DA_INSTANCIA"

# Criar nova
curl -X POST -H "apikey: $EVO_KEY" -H "Content-Type: application/json" \
  -d '{"instanceName":"nova_instancia","qrcode":true,"integration":"WHATSAPP-BAILEYS"}' \
  "$EVO_URL/instance/create"
```

### Limpar tudo e começar do zero
```bash
docker compose down -v  # -v remove os volumes (dados)
docker compose up -d
```

## Endpoints Principais

| Ação | Método | Endpoint |
|------|--------|----------|
| Listar instâncias | GET | `/instance/fetchInstances` |
| Criar instância | POST | `/instance/create` |
| Obter QR Code | GET | `/instance/connect/{instance}` |
| Status conexão | GET | `/instance/connectionState/{instance}` |
| Logout | DELETE | `/instance/logout/{instance}` |
| Deletar instância | DELETE | `/instance/delete/{instance}` |
| Enviar mensagem | POST | `/message/sendText/{instance}` |

## Suporte
- [Documentação Evolution API v2](https://doc.evolution-api.com/v2)
- [GitHub Evolution API](https://github.com/EvolutionAPI/evolution-api)
