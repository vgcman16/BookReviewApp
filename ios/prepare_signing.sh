#!/bin/bash

# Directory containing your downloaded certificate and provisioning profile
CERT_PATH="./ios_distribution.cer"
PROFILE_PATH="./BookReviewApp.mobileprovision"
P12_PASSWORD="bookreviewapp123"

# Convert certificate to p12
echo "Converting certificate to p12 format..."
openssl x509 -in "$CERT_PATH" -inform DER -out ios_distribution.pem
openssl pkcs12 -export -inkey ios_distribution.key -in ios_distribution.pem -out ios_distribution.p12 -passout pass:$P12_PASSWORD

# Convert certificate and profile to base64
echo "Converting files to base64..."
echo "Certificate base64 (copy this to IOS_CERTIFICATE_BASE64 secret):"
base64 -i ios_distribution.p12 | tr -d '\n'
echo -e "\n\nProvisioning profile base64 (copy this to IOS_PROVISIONING_PROFILE_BASE64 secret):"
base64 -i "$PROFILE_PATH" | tr -d '\n'
echo -e "\n\nP12 password (copy this to IOS_CERTIFICATE_PASSWORD secret):"
echo "$P12_PASSWORD"
