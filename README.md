# Mongo-Stateful-ContinuousDeployment-Kubernetes

## Asunciones

### Local path provisioner

```
kubectl --kubeconfig .kubeconfig apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml
kubectl --kubeconfig .kubeconfig patch storageclass local-path -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```
### MongoDB repicaset Chart
```
kubectl --kubeconfig .kubeconfig create ns mongodb-tfm
helm --kubeconfig .kubeconfig repo add stable https://kubernetes-charts.storage.googleapis.com/
helm --kubeconfig .kubeconfig -n mongodb-tfm install -f values.yaml mongodb-replicaset stable/mongodb-replicaset
helm --kubeconfig .kubeconfig upgrade -f values.yaml mongodb-replicaset stable/mongodb-replicaset
```

1. After the statefulset is created completely, one can check which instance is primary by running:

    $ for ((i = 0; i < 3; ++i)); do kubectl exec --namespace default mongodb-tfm-mongodb-replicaset-$i -- sh -c 'mongo --eval="printjson(rs.isMaster())"'; done

2. One can insert a key into the primary instance of the mongodb replica set by running the following:
    MASTER_POD_NAME must be replaced with the name of the master found from the previous step.

    $ kubectl exec --namespace default MASTER_POD_NAME -- mongo --eval="printjson(db.test.insert({key1: 'value1'}))"

3. One can fetch the keys stored in the primary or any of the slave nodes in the following manner.
    POD_NAME must be replaced by the name of the pod being queried.

    $ kubectl exec --namespace default POD_NAME -- mongo --eval="rs.slaveOk(); db.test.find().forEach(printjson)"


## Referencias

https://kubernetes.io/es/docs/concepts/workloads/controllers/statefulset/#estrategias-de-actualizaci%C3%B3n
https://github.com/helm/charts/tree/master/stable/mongodb-replicaset
https://github.com/kubernetes-retired/contrib/tree/master/peer-finder