#!/bin/bash

EMAIL='ap@example.com'
PASSWORD='ap'

BASE_URL="http://tic-tac-toe.wdibos.com"
URL="${BASE_URL}/sign-in"

url() {

  CONTENT_TYPE="application/x-www-form-urlencoded"

  curl ${URL} \
  --include \
  --request POST \
  --header "Content-Type: ${CONTENT_TYPE}" \
  --data-urlencode "credentials[email]=${EMAIL}" \
  --data-urlencode "credentials[password]=${PASSWORD}"

}
