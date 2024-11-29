#!/bin/bash

# Create private key and CSR
openssl genrsa -out ios_distribution.key 2048
openssl req -new -key ios_distribution.key -out ios_distribution.csr -subj "/emailAddress=your-email@example.com/CN=BookReviewApp/O=Your Company/C=US"
