#!/bin/bash


kubectl --kubeconfig .kubeconfig exec mongo-replicaset-0 mongo /init/replicaset.js