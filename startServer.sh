serve \
  -s dist/ \
  -p 3000 \
  --ssl-cert /opt/certs/cert.crt \
  --ssl-key /opt/certs/cert.key \
  -C -n --no-port-switching
