# Detalles de instalación de infraestructura

Se utilizar Microk8s instalado en una máquina virtual de Google Platform con los siguentes recursos:

- n1-standard-2 (2 vCPUs, 7,5 GB de memoria)

## Microk8s

Instalación de Microk8s en Ubuntu:

```Bash
sudo apt-get update; sudo apt-get install -yq; sudo snap install microk8s --classic; sudo usermod -a -G microk8s $(whoami); sudo chown -f -R $(whoami) ~/.kube
```

Habilitación de addons:

```bash
sudo microk8s.enable dns
sudo microk8s.enable ingress
sudo microk8s.enable storage
```

Como alternativa al addon `storage` de microk8s, podemos usar **Local path provisioner**.

```bash
kubectl --kubeconfig .kubeconfig apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/master/deploy/local-path-storage.yaml

kubectl --kubeconfig .kubeconfig patch storageclass local-path -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

Ejecutamos el siguiente comando para obtener el fichero `kubeconfig` para poder conectar y autenticar contra el API del cluster.

```bash
sudo microk8s config
```

La salida del comando la podemos poner en un fichero en el directorio local (mi caso `.kubeconfig`) o ponerlo en la ruta por defecto de **kubectl** `~/.kube/config`

## Cert manager

Se utiliza **Cert manager** para generar y administrar certificados firmados por **Let's Encrypt**.

```bash
kubectl --kubeconfig .kubeconfig create namespace cert-manager

helm --kubeconfig=.kubeconfig repo add jetstack https://charts.jetstack.io

helm --kubeconfig=.kubeconfig repo update

helm --kubeconfig=.kubeconfig install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v0.16.1 \
  --set installCRDs=true

kubectl --kubeconfig .kubeconfig apply -f letsencrypt-prod.yaml -f letsencrypt-staging.yaml
```

## Monitoring

El sistema de monitorización está compuesto por la tupla **Prometheus** y **Grafana**.

Se usa **Helm** para instalar el sistema completo de una forma sencilla.

Instalar [prometheus-operator](https://github.com/prometheus-community/helm-charts) en el **namespace** *monitoring*:

```
kubectl --kubeconfig=.kubeconfig create namespace monitoring

helm --kubeconfig=.kubeconfig repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm --kubeconfig=.kubeconfig repo update

helm --kubeconfig=.kubeconfig -n monitoring install prometheus-community/prometheus-operator  stable/prometheus-operator -f monitoring/prom-values.yaml
```

Se ha creado un [*dashboard*](monitoring/mongodb-dashboard.json) para Grafana en el que se visualizan las métricas expuestas por los servicios.
