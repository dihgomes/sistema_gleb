tunnel: d1dfca62-2c9f-466b-935c-61da56c11ef4
credentials-file: C:\Users\diego\.cloudflared\d1dfca62-2c9f-466b-935c-61da56c11ef4.json

ingress:
  - hostname: api.controle-hrrb.com.br
    service: http://localhost:5001
  - hostname: controle-hrrb.com.br
    service: http://localhost:5173
  - service: http_status:404
