const metricsClient = require('prom-client')

exports.concurrentRequests = new metricsClient.Gauge({
  name: 'dummy_service_concurrent_requests',
  help: 'Incoming requests',
  labelNames: ['name'],
})

exports.incomingRequest = new metricsClient.Counter({
  name: 'dummy_service_requests_total',
  help: 'Incoming requests',
  labelNames: ['name'],
})

exports.requestsStored = new metricsClient.Counter({
  name: 'dummy_service_requests_stored_total',
  help: 'Incoming stored requests',
  labelNames: ['name'],
})
exports.requestsErrorStored = new metricsClient.Counter({
  name: 'dummy_service_requests_error_storing_total',
  help: 'Incoming not stored requests',
  labelNames: ['name'],
})

exports.requestDurationSecondsSummary = new metricsClient.Summary({
  name: "dummy_service_request_duration_seconds",
  help: "request duration summary",
  percentiles: [0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999]
});

exports.getContentType = () => {
  return metricsClient.register.contentType
}

exports.getMetrics = async () => {
  return metricsClient.register.metrics()
}