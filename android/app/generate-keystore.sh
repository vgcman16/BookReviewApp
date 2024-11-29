#!/bin/bash

# Define the password (you should change these)
KEYSTORE_PASSWORD="bookreview123"
KEY_PASSWORD="bookreview123"

# Generate the keystore
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore release.keystore \
  -alias bookreviewapp \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "$KEYSTORE_PASSWORD" \
  -keypass "$KEY_PASSWORD" \
  -dname "CN=BookReviewApp, OU=Mobile, O=YourCompany, L=YourCity, ST=YourState, C=US"
