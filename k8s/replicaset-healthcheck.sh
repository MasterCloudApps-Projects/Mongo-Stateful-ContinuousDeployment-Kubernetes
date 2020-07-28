#!/bin/bash

RS_STATUS=$(mongo 127.0.0.1:27017 --quiet --eval "rs.status().myState" | tail -n1)

if [[ -z $RS_STATUS ]]; then
  echo "Instance not in replicaset cluster"
  exit 1
fi