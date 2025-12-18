# Proxy do Nginx para Evolution API (Hostinger/VPS)

Se seu site está em **HTTPS** (ex: `https://acessar.click`), o navegador vai bloquear chamadas para a Evolution API em **HTTP** (ex: `http://72.62.9.229:8080`) com erro **Failed to fetch**.

A solução correta é expor a Evolution API pelo **mesmo domínio HTTPS** usando proxy reverso no Nginx.

## 1) Configure o Nginx

No seu server block do domínio (ex: `/etc/nginx/sites-available/acessar`), adicione:

```nginx
location /evo/ {
  proxy_pass http://127.0.0.1:8080/;
  proxy_http_version 1.1;

  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;

  # (Opcional) websockets
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
}
```

Depois:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 2) URL correta no dashboard

Depois do proxy, sua URL da API no dashboard deve ser:

- `https://acessar.click/evo`

E a API Key permanece a mesma.

## 3) Teste rápido

```bash
curl -sS -H "apikey: SUA_API_KEY" https://acessar.click/evo/instance/fetchInstances
```

Se retornar JSON, está tudo certo.
