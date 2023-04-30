CERT_DIR=/opt/certs

if [ "$GENERATE_CERT" = "true" ]; then
  CERT_DIR=$CERT_DIR/generated
fi

serve \
  -s dist/ \
  -p 3000 \
  --ssl-cert $CERT_DIR/cert.crt \
  --ssl-key $CERT_DIR/cert.key \
  -C -n --no-port-switching
