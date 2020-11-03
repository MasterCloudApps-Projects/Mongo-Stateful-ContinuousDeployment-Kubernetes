# MongoDB replicaset en Kubernetes

Este repositorio analiza las diferentes opciones que podemos usar en Kubernetes para desplegar aplicaciones con estado. Usaremos MongoDB para crear un cluster en modo [ReplicaSet](https://docs.mongodb.com/manual/replication/).

## Asunciones

Partimos de la base de que disponemos de un cluster Kubernetes en cualquiera de sus variantes. Se puede usar Minikube o Microk8s para trabajar en local o bien cualquier servicio Kubernetes que ofrecen proveedores cloud como Amazon Web Services o Google Platform.

El sistema de monitorización compuesto por Grafana y Prometheus y su instalación quedan fuera del ámbito de este proyecto.

Vaya a [Infra](infra/README.md) para los detalles de la infraestructura usada para estas pruebas.

## Servicios

### Dummy Service

Se pretende observar el comportamiento del cluster de MongoDB en un entorno de simulación con carga de trabajo.

Para ello se desarrolla una aplicación en NodeJs que expone una simple API REST con un solo endpoint `POST /` que almacena en la base de datos cualquier objeto JSON que se incluya en el *body* de la petición.

El servicio expone métricas en formato Prometheus en `/metrics` para poder obtener información sobre el rendimiendo de la aplicación.

```bash
# HELP dummy_service_concurrent_requests Incoming requests
# TYPE dummy_service_concurrent_requests gauge
dummy_service_concurrent_requests 0

# HELP dummy_service_requests_total Incoming requests
# TYPE dummy_service_requests_total counter
dummy_service_requests_total 0

# HELP dummy_service_requests_stored_total Incoming stored requests
# TYPE dummy_service_requests_stored_total counter
dummy_service_requests_stored_total 0

# HELP dummy_service_requests_error_storing_total Incoming not stored requests
# TYPE dummy_service_requests_error_storing_total counter
dummy_service_requests_error_storing_total 0

# HELP dummy_service_request_duration_seconds request duration summary
# TYPE dummy_service_request_duration_seconds summary
dummy_service_request_duration_seconds{quantile="0.01"} 0
dummy_service_request_duration_seconds{quantile="0.05"} 0
dummy_service_request_duration_seconds{quantile="0.5"} 0
dummy_service_request_duration_seconds{quantile="0.9"} 0
dummy_service_request_duration_seconds{quantile="0.95"} 0
dummy_service_request_duration_seconds{quantile="0.99"} 0
dummy_service_request_duration_seconds{quantile="0.999"} 0
dummy_service_request_duration_seconds_sum 0
dummy_service_request_duration_seconds_count 0
```

### Replicaset Exporter

Replicaset Exporter es un *Exporter* de Prometheus que se encarga de monitorizar el cluster de MongoDB y exponer métricas sobre su estado.

```bash
# HELP mongodb_replset_member_health MongoDB replicaSet Member Health
# TYPE mongodb_replset_member_health gauge
mongodb_replset_member_health{name="mongo-0.mongo-svc.tfm.svc.cluster.local:27017"} 1
mongodb_replset_member_health{name="mongo-1.mongo-svc.tfm.svc.cluster.local:27017"} 1
mongodb_replset_member_health{name="mongo-2.mongo-svc.tfm.svc.cluster.local:27017"} 1

# HELP mongodb_replset_member_state MongoDB replicaSet Member state
# TYPE mongodb_replset_member_state gauge
mongodb_replset_member_state{name="mongo-0.mongo-svc.tfm.svc.cluster.local:27017"} 2
mongodb_replset_member_state{name="mongo-1.mongo-svc.tfm.svc.cluster.local:27017"} 2
mongodb_replset_member_state{name="mongo-2.mongo-svc.tfm.svc.cluster.local:27017"} 1

# HELP mongodb_replset_member_downtime_total MongoDB replicaSet Member total down time
# TYPE mongodb_replset_member_downtime_total gauge
mongodb_replset_member_downtime_total{name="mongo-0.mongo-svc.tfm.svc.cluster.local:27017"} 0
mongodb_replset_member_downtime_total{name="mongo-1.mongo-svc.tfm.svc.cluster.local:27017"} 0
mongodb_replset_member_downtime_total{name="mongo-2.mongo-svc.tfm.svc.cluster.local:27017"} 0
```

## Despliegue de MongoDB

### Despliegue con Statefulset

En el directorio [k8s-mongo-statefulset](k8s-mongo-statefulset) se encuentran los recursos para crear un cluster de MongoDB en modo *ReplicaSet* haciendo uso del recurso **StatefulSet** de Kubernetes.

[Despliegue con Statefulset](k8s-mongo-statefulset/README.md)


### Despliegue con Mongo Operator

En el directorio [k8s-mongo-operator](k8s-mongo-operator) se encuentran los recursos para crear un cluster haciendo uso del operador de MongoDB para Kubernetes [MongoDB Community Kubernetes Operator](https://github.com/mongodb/mongodb-kubernetes-operator)


## Referencias

* https://kubernetes.io/es/docs/concepts/workloads/controllers/statefulset/#estrategias-de-actualizaci%C3%B3n
* https://github.com/mongodb/mongodb-kubernetes-operator