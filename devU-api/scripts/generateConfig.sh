#!/bin/bash
tmp_dir=$(mktemp -d -t config-XXXXXXXXXX)
trap 'rm -rf -- "$tmp_dir"' EXIT

renderedFile=${1:-config/newconfig.yml}
templateFile=${2:-config/default.yml.template}

cp ${templateFile} ${renderedFile}

openssl genrsa -out ${tmp_dir}/jwt_private_key.pem 3072 2> /dev/null
openssl rsa -in  ${tmp_dir}/jwt_private_key.pem -pubout -out  ${tmp_dir}/jwt_public_key.pem 2> /dev/null

openssl req -x509 -newkey rsa:4096 -keyout ${tmp_dir}/saml_signing_key.pem -subj "/CN=devu-signing.local/emailAddress=admin@devu-dev.local/C=US/ST=New York/L=Buffalo/O=DevU" -out ${tmp_dir}/saml_signing_cert.pem -nodes -days 900 2> /dev/null
openssl req -x509 -newkey rsa:4096 -keyout ${tmp_dir}/saml_encryption_key.pem -subj "/CN=devu-encryption.local/emailAddress=admin@devu-dev.local/C=US/ST=New York/L=Buffalo/O=DevU" -out ${tmp_dir}/saml_encryption_cert.pem -nodes -days 900 2> /dev/null

yq -Yi --arg jwt_private_key "$(cat ${tmp_dir}/jwt_private_key.pem)" \
  --arg jwt_public_key "$(cat ${tmp_dir}/jwt_public_key.pem)" \
  --arg saml_signing_key "$(cat ${tmp_dir}/saml_signing_key.pem)" \
  --arg saml_signing_cert "$(cat ${tmp_dir}/saml_signing_cert.pem)" \
  --arg saml_encryption_key "$(cat ${tmp_dir}/saml_encryption_key.pem)" \
  --arg saml_encryption_cert "$(cat ${tmp_dir}/saml_encryption_cert.pem)" \
  '.auth.jwt.keys.sk07112021.privateKey=$jwt_private_key |
  .auth.jwt.keys.sk07112021.publicKey=$jwt_public_key |
  .auth.providers.saml.signing.privateKey=$saml_signing_key |
  .auth.providers.saml.signing.certificate=$saml_signing_cert |
  .auth.providers.saml.encryption.privateKey=$saml_encryption_key |
  .auth.providers.saml.encryption.certificate=$saml_encryption_cert |
  .auth.providers.saml.idpCerts=[]' \
  -- ${renderedFile}