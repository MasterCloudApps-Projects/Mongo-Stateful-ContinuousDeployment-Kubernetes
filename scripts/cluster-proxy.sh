#!/bin/bash

source .env

ssh  $K8S_CLUSTER_SSH_USER@$K8S_CLUSTER_URL -L 16443:localhost:16443 -N -f