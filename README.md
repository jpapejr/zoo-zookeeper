# zoo-zookeeper
Responsible for registering/removing/listig zoo inhabitants

## Running
```
kubectl apply -f kubernetes-manifests/deployment-mongo.yaml
kubectl apply -f kubernetes-manifests/deployment-prod.yaml
```

> Note: make sure you update the container image in `deployment-prod.yaml` before applying to the cluster


## Building
```
skaffold run --default-repo repository/namespace
or
skaffold dev --default-repo repository/namespace --port-forward
```

> Note: Set `--default-repo` to the registry where you'll put the built images. Make sure your cluster has pullSecrets that allow it to pull from the chosen registry.


