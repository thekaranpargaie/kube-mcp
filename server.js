import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const server = new Server({
  name: "kubernetes-mcp",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// Define all tools
const tools = [
  // Basic Resource Listing
  {
    name: "list-pods",
    description: "List Kubernetes pods in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list pods from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-services", 
    description: "List Kubernetes services in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list services from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-deployments", 
    description: "List Kubernetes deployments in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list deployments from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-namespaces",
    description: "List all Kubernetes namespaces",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "list-nodes",
    description: "List all Kubernetes nodes",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "list-configmaps",
    description: "List Kubernetes configmaps in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list configmaps from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-secrets",
    description: "List Kubernetes secrets in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list secrets from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-jobs",
    description: "List Kubernetes jobs in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list jobs from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-cronjobs",
    description: "List Kubernetes cronjobs in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list cronjobs from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-ingresses",
    description: "List Kubernetes ingresses in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list ingresses from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-pv",
    description: "List Kubernetes persistent volumes",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "list-pvc",
    description: "List Kubernetes persistent volume claims in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list PVCs from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-all",
    description: "List all Kubernetes resources in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list all resources from (optional, defaults to current context namespace)"
        }
      }
    }
  },

  // Describe Resources
  {
    name: "describe-pod",
    description: "Describe details of a Kubernetes pod",
    inputSchema: {
      type: "object",
      properties: {
        pod: { 
          type: "string",
          description: "The name of the pod to describe"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the pod (optional, defaults to current context namespace)"
        }
      },
      required: ["pod"]
    }
  },
  {
    name: "describe-deployment",
    description: "Describe details of a Kubernetes deployment",
    inputSchema: {
      type: "object",
      properties: {
        deployment: { 
          type: "string",
          description: "The name of the deployment to describe"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the deployment (optional, defaults to current context namespace)"
        }
      },
      required: ["deployment"]
    }
  },
  {
    name: "describe-service",
    description: "Describe details of a Kubernetes service",
    inputSchema: {
      type: "object",
      properties: {
        service: { 
          type: "string",
          description: "The name of the service to describe"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the service (optional, defaults to current context namespace)"
        }
      },
      required: ["service"]
    }
  },
  {
    name: "describe-node",
    description: "Describe details of a Kubernetes node",
    inputSchema: {
      type: "object",
      properties: {
        node: { 
          type: "string",
          description: "The name of the node to describe"
        }
      },
      required: ["node"]
    }
  },
  {
    name: "describe-configmap",
    description: "Describe details of a Kubernetes configmap",
    inputSchema: {
      type: "object",
      properties: {
        configmap: { 
          type: "string",
          description: "The name of the configmap to describe"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the configmap (optional, defaults to current context namespace)"
        }
      },
      required: ["configmap"]
    }
  },
  {
    name: "describe-secret",
    description: "Describe details of a Kubernetes secret",
    inputSchema: {
      type: "object",
      properties: {
        secret: { 
          type: "string",
          description: "The name of the secret to describe"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the secret (optional, defaults to current context namespace)"
        }
      },
      required: ["secret"]
    }
  },

  // Logs and Debugging
  {
    name: "get-logs",
    description: "Get logs from a Kubernetes pod",
    inputSchema: {
      type: "object",
      properties: {
        pod: { 
          type: "string",
          description: "The name of the pod to get logs from"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the pod (optional, defaults to current context namespace)"
        },
        lines: { 
          type: "number",
          description: "Number of lines to retrieve from the end of the logs (default: 100)"
        },
        follow: {
          type: "boolean",
          description: "Follow the logs (stream new logs as they come in)"
        },
        container: {
          type: "string",
          description: "The container name to get logs from (if pod has multiple containers)"
        }
      },
      required: ["pod"]
    }
  },
  {
    name: "get-events",
    description: "Get Kubernetes events for troubleshooting",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to get events from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "top-pods",
    description: "Show resource usage for pods",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to get pod metrics from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "top-nodes",
    description: "Show resource usage for nodes",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },

  // Networking
  {
    name: "port-forward",
    description: "Port forward a Kubernetes service to a local port",
    inputSchema: {
      type: "object",
      properties: {
        service: { 
          type: "string",
          description: "The name of the Kubernetes service to port-forward"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the service (optional, defaults to current context namespace)"
        },
        localPort: { 
          type: "number",
          description: "The local port to forward to"
        },
        targetPort: { 
          type: "number",
          description: "The target port on the service"
        }
      },
      required: ["service", "localPort", "targetPort"]
    }
  },
  {
    name: "port-forward-pod",
    description: "Port forward a Kubernetes pod to a local port",
    inputSchema: {
      type: "object",
      properties: {
        pod: { 
          type: "string",
          description: "The name of the Kubernetes pod to port-forward"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the pod (optional, defaults to current context namespace)"
        },
        localPort: { 
          type: "number",
          description: "The local port to forward to"
        },
        targetPort: { 
          type: "number",
          description: "The target port on the pod"
        }
      },
      required: ["pod", "localPort", "targetPort"]
    }
  },

  // Resource Management
  {
    name: "scale-deployment",
    description: "Scale a Kubernetes deployment to a specified number of replicas",
    inputSchema: {
      type: "object",
      properties: {
        deployment: { 
          type: "string",
          description: "The name of the deployment to scale"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the deployment (optional, defaults to current context namespace)"
        },
        replicas: { 
          type: "number",
          description: "The number of replicas to scale to"
        }
      },
      required: ["deployment", "replicas"]
    }
  },
  {
    name: "rollout-status",
    description: "Check the rollout status of a deployment",
    inputSchema: {
      type: "object",
      properties: {
        deployment: { 
          type: "string",
          description: "The name of the deployment to check"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the deployment (optional, defaults to current context namespace)"
        }
      },
      required: ["deployment"]
    }
  },
  {
    name: "rollout-restart",
    description: "Restart a deployment by triggering a rollout",
    inputSchema: {
      type: "object",
      properties: {
        deployment: { 
          type: "string",
          description: "The name of the deployment to restart"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the deployment (optional, defaults to current context namespace)"
        }
      },
      required: ["deployment"]
    }
  },
  {
    name: "rollout-history",
    description: "Show the rollout history of a deployment",
    inputSchema: {
      type: "object",
      properties: {
        deployment: { 
          type: "string",
          description: "The name of the deployment to check history for"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the deployment (optional, defaults to current context namespace)"
        }
      },
      required: ["deployment"]
    }
  },
  {
    name: "set-image",
    description: "Update the image of a deployment",
    inputSchema: {
      type: "object",
      properties: {
        deployment: { 
          type: "string",
          description: "The name of the deployment to update"
        },
        container: { 
          type: "string",
          description: "The name of the container to update"
        },
        image: { 
          type: "string",
          description: "The new image to use"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the deployment (optional, defaults to current context namespace)"
        }
      },
      required: ["deployment", "container", "image"]
    }
  },

  // Exec and File Operations
  {
    name: "exec",
    description: "Execute a command in a pod container",
    inputSchema: {
      type: "object",
      properties: {
        pod: { 
          type: "string",
          description: "The name of the pod to execute in"
        },
        command: { 
          type: "string",
          description: "The command to execute"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the pod (optional, defaults to current context namespace)"
        },
        container: { 
          type: "string",
          description: "The container name to execute in (if pod has multiple containers)"
        }
      },
      required: ["pod", "command"]
    }
  },
  {
    name: "cp",
    description: "Copy files to/from a pod",
    inputSchema: {
      type: "object",
      properties: {
        pod: { 
          type: "string",
          description: "The name of the pod"
        },
        source: { 
          type: "string",
          description: "Source path (local:path or pod:path)"
        },
        destination: { 
          type: "string",
          description: "Destination path (local:path or pod:path)"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the pod (optional, defaults to current context namespace)"
        },
        container: { 
          type: "string",
          description: "The container name (if pod has multiple containers)"
        }
      },
      required: ["pod", "source", "destination"]
    }
  },

  // Configuration and Secrets
  {
    name: "get-configmap",
    description: "Get the data from a configmap",
    inputSchema: {
      type: "object",
      properties: {
        configmap: { 
          type: "string",
          description: "The name of the configmap"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the configmap (optional, defaults to current context namespace)"
        }
      },
      required: ["configmap"]
    }
  },
  {
    name: "get-secret",
    description: "Get the data from a secret",
    inputSchema: {
      type: "object",
      properties: {
        secret: { 
          type: "string",
          description: "The name of the secret"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the secret (optional, defaults to current context namespace)"
        }
      },
      required: ["secret"]
    }
  },

  // Cluster Information
  {
    name: "cluster-info",
    description: "Get cluster information",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "version",
    description: "Get Kubernetes version information",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "api-resources",
    description: "Get available API resources",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "api-versions",
    description: "Get available API versions",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },

  // Context and Configuration
  {
    name: "current-context",
    description: "Get the current kubectl context",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "get-contexts",
    description: "List all kubectl contexts",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "use-context",
    description: "Switch to a different kubectl context",
    inputSchema: {
      type: "object",
      properties: {
        context: { 
          type: "string",
          description: "The context name to switch to"
        }
      },
      required: ["context"]
    }
  },

  // Resource Creation/Deletion
  {
    name: "apply",
    description: "Apply a Kubernetes manifest from a file or URL",
    inputSchema: {
      type: "object",
      properties: {
        file: { 
          type: "string",
          description: "Path to the manifest file or URL"
        },
        namespace: { 
          type: "string",
          description: "The namespace to apply to (optional, defaults to current context namespace)"
        }
      },
      required: ["file"]
    }
  },
  {
    name: "delete",
    description: "Delete a Kubernetes resource",
    inputSchema: {
      type: "object",
      properties: {
        resource: { 
          type: "string",
          description: "The resource type (pod, deployment, service, etc.)"
        },
        name: { 
          type: "string",
          description: "The name of the resource"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the resource (optional, defaults to current context namespace)"
        }
      },
      required: ["resource", "name"]
    }
  },
  {
    name: "create-namespace",
    description: "Create a new namespace",
    inputSchema: {
      type: "object",
      properties: {
        name: { 
          type: "string",
          description: "The name of the namespace to create"
        }
      },
      required: ["name"]
    }
  },

  // Debugging Tools
  {
    name: "debug-pod",
    description: "Create a debug container in a pod",
    inputSchema: {
      type: "object",
      properties: {
        pod: { 
          type: "string",
          description: "The name of the pod to debug"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the pod (optional, defaults to current context namespace)"
        },
        image: { 
          type: "string",
          description: "The debug container image to use (optional, defaults to busybox)"
        }
      },
      required: ["pod"]
    }
  },
  {
    name: "run",
    description: "Run a pod with a specific image",
    inputSchema: {
      type: "object",
      properties: {
        name: { 
          type: "string",
          description: "The name of the pod to run"
        },
        image: { 
          type: "string",
          description: "The container image to use"
        },
        namespace: { 
          type: "string",
          description: "The namespace to run in (optional, defaults to current context namespace)"
        },
        command: { 
          type: "string",
          description: "The command to run (optional)"
        }
      },
      required: ["name", "image"]
    }
  },

  // Helm Operations (if Helm is available)
  {
    name: "helm-list",
    description: "List Helm releases",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list releases from (optional, defaults to all namespaces)"
        }
      }
    }
  },
  {
    name: "helm-status",
    description: "Get the status of a Helm release",
    inputSchema: {
      type: "object",
      properties: {
        release: { 
          type: "string",
          description: "The name of the Helm release"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the release (optional, defaults to current context namespace)"
        }
      },
      required: ["release"]
    }
  },

  // Security and RBAC
  {
    name: "list-serviceaccounts",
    description: "List Kubernetes service accounts in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list service accounts from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-roles",
    description: "List Kubernetes roles in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list roles from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-rolebindings",
    description: "List Kubernetes role bindings in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list role bindings from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-clusterroles",
    description: "List Kubernetes cluster roles",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "list-clusterrolebindings",
    description: "List Kubernetes cluster role bindings",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "auth-can-i",
    description: "Check if the current user can perform an action",
    inputSchema: {
      type: "object",
      properties: {
        verb: { 
          type: "string",
          description: "The verb to check (get, list, create, update, delete, etc.)"
        },
        resource: { 
          type: "string",
          description: "The resource type to check"
        },
        namespace: { 
          type: "string",
          description: "The namespace to check (optional)"
        }
      },
      required: ["verb", "resource"]
    }
  },

  // Advanced Networking
  {
    name: "list-networkpolicies",
    description: "List Kubernetes network policies in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list network policies from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-endpoints",
    description: "List Kubernetes endpoints in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list endpoints from (optional, defaults to current context namespace)"
        }
      }
    }
  },

  // Resource Management
  {
    name: "list-resourcequotas",
    description: "List Kubernetes resource quotas in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list resource quotas from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-limitranges",
    description: "List Kubernetes limit ranges in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list limit ranges from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "list-hpa",
    description: "List Kubernetes horizontal pod autoscalers in a namespace",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list HPAs from (optional, defaults to current context namespace)"
        }
      }
    }
  },

  // Custom Resources
  {
    name: "list-crds",
    description: "List Kubernetes custom resource definitions",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "get-crd",
    description: "Get a custom resource definition",
    inputSchema: {
      type: "object",
      properties: {
        name: { 
          type: "string",
          description: "The name of the CRD"
        }
      },
      required: ["name"]
    }
  },

  // Advanced Operations
  {
    name: "wait",
    description: "Wait for a condition on a resource",
    inputSchema: {
      type: "object",
      properties: {
        resource: { 
          type: "string",
          description: "The resource type (pod, deployment, etc.)"
        },
        name: { 
          type: "string",
          description: "The name of the resource"
        },
        condition: { 
          type: "string",
          description: "The condition to wait for (ready, available, etc.)"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the resource (optional, defaults to current context namespace)"
        },
        timeout: { 
          type: "string",
          description: "Timeout duration (default: 300s)"
        }
      },
      required: ["resource", "name", "condition"]
    }
  },
  {
    name: "patch",
    description: "Patch a Kubernetes resource",
    inputSchema: {
      type: "object",
      properties: {
        resource: { 
          type: "string",
          description: "The resource type"
        },
        name: { 
          type: "string",
          description: "The name of the resource"
        },
        patch: { 
          type: "string",
          description: "The patch to apply (JSON or YAML)"
        },
        type: { 
          type: "string",
          description: "The patch type (strategic, merge, json)"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the resource (optional, defaults to current context namespace)"
        }
      },
      required: ["resource", "name", "patch"]
    }
  },
  {
    name: "label",
    description: "Add or update labels on a resource",
    inputSchema: {
      type: "object",
      properties: {
        resource: { 
          type: "string",
          description: "The resource type"
        },
        name: { 
          type: "string",
          description: "The name of the resource"
        },
        labels: { 
          type: "string",
          description: "Labels to add/update (key=value,key2=value2)"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the resource (optional, defaults to current context namespace)"
        }
      },
      required: ["resource", "name", "labels"]
    }
  },
  {
    name: "annotate",
    description: "Add or update annotations on a resource",
    inputSchema: {
      type: "object",
      properties: {
        resource: { 
          type: "string",
          description: "The resource type"
        },
        name: { 
          type: "string",
          description: "The name of the resource"
        },
        annotations: { 
          type: "string",
          description: "Annotations to add/update (key=value,key2=value2)"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the resource (optional, defaults to current context namespace)"
        }
      },
      required: ["resource", "name", "annotations"]
    }
  },

  // Troubleshooting and Diagnostics
  {
    name: "get-pod-metrics",
    description: "Get detailed metrics for a pod",
    inputSchema: {
      type: "object",
      properties: {
        pod: { 
          type: "string",
          description: "The name of the pod"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the pod (optional, defaults to current context namespace)"
        }
      },
      required: ["pod"]
    }
  },
  {
    name: "get-node-metrics",
    description: "Get detailed metrics for a node",
    inputSchema: {
      type: "object",
      properties: {
        node: { 
          type: "string",
          description: "The name of the node"
        }
      },
      required: ["node"]
    }
  },
  {
    name: "cordon-node",
    description: "Mark a node as unschedulable",
    inputSchema: {
      type: "object",
      properties: {
        node: { 
          type: "string",
          description: "The name of the node to cordon"
        }
      },
      required: ["node"]
    }
  },
  {
    name: "uncordon-node",
    description: "Mark a node as schedulable",
    inputSchema: {
      type: "object",
      properties: {
        node: { 
          type: "string",
          description: "The name of the node to uncordon"
        }
      },
      required: ["node"]
    }
  },
  {
    name: "drain-node",
    description: "Drain a node for maintenance",
    inputSchema: {
      type: "object",
      properties: {
        node: { 
          type: "string",
          description: "The name of the node to drain"
        },
        force: { 
          type: "boolean",
          description: "Force drain even if there are unmanaged pods"
        },
        ignore_daemonsets: { 
          type: "boolean",
          description: "Ignore DaemonSet pods during drain"
        }
      },
      required: ["node"]
    }
  },

  // Advanced Helm Operations
  {
    name: "helm-install",
    description: "Install a Helm chart",
    inputSchema: {
      type: "object",
      properties: {
        name: { 
          type: "string",
          description: "The name of the release"
        },
        chart: { 
          type: "string",
          description: "The chart reference (repo/chart or path)"
        },
        namespace: { 
          type: "string",
          description: "The namespace to install into (optional, defaults to current context namespace)"
        },
        values: { 
          type: "string",
          description: "Values to override (YAML string)"
        },
        version: { 
          type: "string",
          description: "Chart version to install"
        }
      },
      required: ["name", "chart"]
    }
  },
  {
    name: "helm-upgrade",
    description: "Upgrade a Helm release",
    inputSchema: {
      type: "object",
      properties: {
        name: { 
          type: "string",
          description: "The name of the release"
        },
        chart: { 
          type: "string",
          description: "The chart reference (repo/chart or path)"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the release (optional, defaults to current context namespace)"
        },
        values: { 
          type: "string",
          description: "Values to override (YAML string)"
        }
      },
      required: ["name", "chart"]
    }
  },
  {
    name: "helm-uninstall",
    description: "Uninstall a Helm release",
    inputSchema: {
      type: "object",
      properties: {
        name: { 
          type: "string",
          description: "The name of the release"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the release (optional, defaults to current context namespace)"
        }
      },
      required: ["name"]
    }
  },

  // ArgoCD Operations (if available)
  {
    name: "argocd-list-apps",
    description: "List ArgoCD applications",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list apps from (optional, defaults to argocd namespace)"
        }
      }
    }
  },
  {
    name: "argocd-app-status",
    description: "Get the status of an ArgoCD application",
    inputSchema: {
      type: "object",
      properties: {
        app: { 
          type: "string",
          description: "The name of the ArgoCD application"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the application (optional, defaults to argocd namespace)"
        }
      },
      required: ["app"]
    }
  },

  // Istio Operations (if available)
  {
    name: "istio-list-virtualservices",
    description: "List Istio virtual services",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list virtual services from (optional, defaults to current context namespace)"
        }
      }
    }
  },
  {
    name: "istio-list-gateways",
    description: "List Istio gateways",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to list gateways from (optional, defaults to current context namespace)"
        }
      }
    }
  },

  // Prometheus/Kube State Metrics
  {
    name: "get-cluster-metrics",
    description: "Get cluster-wide metrics",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },

  // Advanced Debugging
  {
    name: "create-ephemeral-container",
    description: "Create an ephemeral debug container in a pod",
    inputSchema: {
      type: "object",
      properties: {
        pod: { 
          type: "string",
          description: "The name of the pod"
        },
        image: { 
          type: "string",
          description: "The container image to use for debugging"
        },
        name: { 
          type: "string",
          description: "The name of the ephemeral container"
        },
        namespace: { 
          type: "string",
          description: "The namespace of the pod (optional, defaults to current context namespace)"
        },
        command: { 
          type: "string",
          description: "The command to run in the container"
        }
      },
      required: ["pod", "image", "name"]
    }
  },

  // Resource Analysis
  {
    name: "analyze-resource-usage",
    description: "Analyze resource usage across the cluster",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to analyze (optional, analyzes all namespaces if not specified)"
        }
      }
    }
  },

  // Backup and Recovery
  {
    name: "create-backup",
    description: "Create a backup of cluster resources",
    inputSchema: {
      type: "object",
      properties: {
        namespace: { 
          type: "string",
          description: "The namespace to backup (optional, backs up all namespaces if not specified)"
        },
        output: { 
          type: "string",
          description: "Output file path for the backup"
        }
      }
    }
  }
];

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Basic Resource Listing
      case "list-pods": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get pods ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No pods found" }]
        };
      }

      case "list-services": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get svc ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No services found" }]
        };
      }

      case "list-deployments": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get deployments ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No deployments found" }]
        };
      }

      case "list-namespaces": {
        const cmd = `kubectl get namespaces -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No namespaces found" }]
        };
      }

      case "list-nodes": {
        const cmd = `kubectl get nodes -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No nodes found" }]
        };
      }

      case "list-configmaps": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get configmaps ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No configmaps found" }]
        };
      }

      case "list-secrets": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get secrets ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No secrets found" }]
        };
      }

      case "list-jobs": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get jobs ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No jobs found" }]
        };
      }

      case "list-cronjobs": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get cronjobs ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No cronjobs found" }]
        };
      }

      case "list-ingresses": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get ingresses ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No ingresses found" }]
        };
      }

      case "list-pv": {
        const cmd = `kubectl get pv -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No persistent volumes found" }]
        };
      }

      case "list-pvc": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get pvc ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No persistent volume claims found" }]
        };
      }

      case "list-all": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get all ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No resources found" }]
        };
      }

      // Describe Resources
      case "describe-pod": {
        const { pod, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl describe pod ${pod} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No pod details found" }]
        };
      }

      case "describe-deployment": {
        const { deployment, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl describe deployment ${deployment} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No deployment details found" }]
        };
      }

      case "describe-service": {
        const { service, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl describe service ${service} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No service details found" }]
        };
      }

      case "describe-node": {
        const { node } = args;
        const cmd = `kubectl describe node ${node}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No node details found" }]
        };
      }

      case "describe-configmap": {
        const { configmap, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl describe configmap ${configmap} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No configmap details found" }]
        };
      }

      case "describe-secret": {
        const { secret, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl describe secret ${secret} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No secret details found" }]
        };
      }

      // Logs and Debugging
      case "get-logs": {
        const { pod, namespace, lines = 100, follow = false, container } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const followArg = follow ? "-f" : "";
        const containerArg = container ? `-c ${container}` : "";
        const cmd = `kubectl logs ${pod} ${nsArg} --tail=${lines} ${followArg} ${containerArg}`.trim();
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No logs found" }]
        };
      }

      case "get-events": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get events ${nsArg} --sort-by='.lastTimestamp'`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No events found" }]
        };
      }

      case "top-pods": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl top pods ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No pod metrics found" }]
        };
      }

      case "top-nodes": {
        const cmd = `kubectl top nodes`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No node metrics found" }]
        };
      }

      // Networking
      case "port-forward": {
        const { service, namespace, localPort, targetPort } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl port-forward svc/${service} ${localPort}:${targetPort} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Port-forwarding started for ${service}:${targetPort} -> localhost:${localPort}` 
          }]
        };
      }

      case "port-forward-pod": {
        const { pod, namespace, localPort, targetPort } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl port-forward pod/${pod} ${localPort}:${targetPort} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Port-forwarding started for ${pod}:${targetPort} -> localhost:${localPort}` 
          }]
        };
      }

      // Resource Management
      case "scale-deployment": {
        const { deployment, namespace, replicas } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl scale deployment ${deployment} --replicas=${replicas} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Deployment ${deployment} scaled to ${replicas} replicas` 
          }]
        };
      }

      case "rollout-status": {
        const { deployment, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl rollout status deployment/${deployment} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "Unable to get rollout status" }]
        };
      }

      case "rollout-restart": {
        const { deployment, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl rollout restart deployment/${deployment} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Deployment ${deployment} rollout restarted` 
          }]
        };
      }

      case "rollout-history": {
        const { deployment, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl rollout history deployment/${deployment} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No rollout history found" }]
        };
      }

      case "set-image": {
        const { deployment, container, image, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl set image deployment/${deployment} ${container}=${image} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Image updated for deployment ${deployment}` 
          }]
        };
      }

      // Exec and File Operations
      case "exec": {
        const { pod, command, namespace, container } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const containerArg = container ? `-c ${container}` : "";
        const cmd = `kubectl exec ${pod} ${nsArg} ${containerArg} -- ${command}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "Command executed" }]
        };
      }

      case "cp": {
        const { pod, source, destination, namespace, container } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const containerArg = container ? `-c ${container}` : "";
        const cmd = `kubectl cp ${source} ${pod}:${destination} ${nsArg} ${containerArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `File copied from ${source} to ${pod}:${destination}` 
          }]
        };
      }

      // Configuration and Secrets
      case "get-configmap": {
        const { configmap, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get configmap ${configmap} ${nsArg} -o yaml`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No configmap data found" }]
        };
      }

      case "get-secret": {
        const { secret, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get secret ${secret} ${nsArg} -o yaml`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No secret data found" }]
        };
      }

      // Cluster Information
      case "cluster-info": {
        const cmd = `kubectl cluster-info`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "Unable to get cluster info" }]
        };
      }

      case "version": {
        const cmd = `kubectl version --short`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "Unable to get version info" }]
        };
      }

      case "api-resources": {
        const cmd = `kubectl api-resources`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No API resources found" }]
        };
      }

      case "api-versions": {
        const cmd = `kubectl api-versions`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No API versions found" }]
        };
      }

      // Context and Configuration
      case "current-context": {
        const cmd = `kubectl config current-context`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout.trim() || "No current context" }]
        };
      }

      case "get-contexts": {
        const cmd = `kubectl config get-contexts`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No contexts found" }]
        };
      }

      case "use-context": {
        const { context } = args;
        const cmd = `kubectl config use-context ${context}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Switched to context ${context}` 
          }]
        };
      }

      // Resource Creation/Deletion
      case "apply": {
        const { file, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl apply -f ${file} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Applied manifest from ${file}` 
          }]
        };
      }

      case "delete": {
        const { resource, name, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl delete ${resource} ${name} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Deleted ${resource} ${name}` 
          }]
        };
      }

      case "create-namespace": {
        const { name } = args;
        const cmd = `kubectl create namespace ${name}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Created namespace ${name}` 
          }]
        };
      }

      // Debugging Tools
      case "debug-pod": {
        const { pod, namespace, image = "busybox" } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl debug ${pod} ${nsArg} --image=${image} --share-processes --copy-to=${pod}-debug`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Debug pod created for ${pod}` 
          }]
        };
      }

      case "run": {
        const { name, image, namespace, command } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const commandArg = command ? `-- ${command}` : "";
        const cmd = `kubectl run ${name} --image=${image} ${nsArg} ${commandArg}`.trim();
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ 
            type: "text", 
            text: stdout || `Pod ${name} created with image ${image}` 
          }]
        };
      }

      // Helm Operations
      case "helm-list": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `helm list ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No Helm releases found" }]
        };
      }

      case "helm-status": {
        const { release, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `helm status ${release} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "Unable to get Helm release status" }]
        };
      }

      // Security and RBAC
      case "list-serviceaccounts": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get serviceaccounts ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No service accounts found" }]
        };
      }

      case "list-roles": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get roles ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No roles found" }]
        };
      }

      case "list-rolebindings": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get rolebindings ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No role bindings found" }]
        };
      }

      case "list-clusterroles": {
        const cmd = `kubectl get clusterroles -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No cluster roles found" }]
        };
      }

      case "list-clusterrolebindings": {
        const cmd = `kubectl get clusterrolebindings -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No cluster role bindings found" }]
        };
      }

      case "auth-can-i": {
        const { verb, resource, namespace } = args;
        const nsArg = namespace ? `--namespace=${namespace}` : "";
        const cmd = `kubectl auth can-i ${verb} ${resource} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "Authorization check result" }]
        };
      }

      // Advanced Networking
      case "list-networkpolicies": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get networkpolicies ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No network policies found" }]
        };
      }

      case "list-endpoints": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get endpoints ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No endpoints found" }]
        };
      }

      // Resource Management
      case "list-resourcequotas": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get resourcequotas ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No resource quotas found" }]
        };
      }

      case "list-limitranges": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get limitranges ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No limit ranges found" }]
        };
      }

      case "list-hpa": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get hpa ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No horizontal pod autoscalers found" }]
        };
      }

      // Custom Resources
      case "list-crds": {
        const cmd = `kubectl get crds -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No custom resource definitions found" }]
        };
      }

      case "get-crd": {
        const { name } = args;
        const cmd = `kubectl get crd ${name} -o yaml`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "CRD not found" }]
        };
      }

      // Advanced Operations
      case "wait": {
        const { resource, name, condition, namespace, timeout = "300s" } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl wait ${resource}/${name} --for=condition=${condition} --timeout=${timeout} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Wait condition met for ${resource}/${name}` }]
        };
      }

      case "patch": {
        const { resource, name, patch, type = "strategic", namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl patch ${resource} ${name} --type=${type} -p '${patch}' ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `${resource} ${name} patched successfully` }]
        };
      }

      case "label": {
        const { resource, name, labels, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl label ${resource} ${name} ${labels} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Labels updated on ${resource} ${name}` }]
        };
      }

      case "annotate": {
        const { resource, name, annotations, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl annotate ${resource} ${name} ${annotations} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Annotations updated on ${resource} ${name}` }]
        };
      }

      // Troubleshooting and Diagnostics
      case "get-pod-metrics": {
        const { pod, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get pod ${pod} ${nsArg} -o jsonpath='{.spec.containers[*].resources}' | jq .`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "Unable to get pod metrics" }]
        };
      }

      case "get-node-metrics": {
        const { node } = args;
        const cmd = `kubectl describe node ${node}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "Unable to get node metrics" }]
        };
      }

      case "cordon-node": {
        const { node } = args;
        const cmd = `kubectl cordon ${node}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Node ${node} cordoned` }]
        };
      }

      case "uncordon-node": {
        const { node } = args;
        const cmd = `kubectl uncordon ${node}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Node ${node} uncordoned` }]
        };
      }

      case "drain-node": {
        const { node, force = false, ignore_daemonsets = true } = args;
        const forceArg = force ? "--force" : "";
        const ignoreArg = ignore_daemonsets ? "--ignore-daemonsets" : "";
        const cmd = `kubectl drain ${node} ${forceArg} ${ignoreArg} --delete-emptydir-data`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Node ${node} drained successfully` }]
        };
      }

      // Advanced Helm Operations
      case "helm-install": {
        const { name, chart, namespace, values, version } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const versionArg = version ? `--version ${version}` : "";
        const valuesArg = values ? `-f <(echo '${values}')` : "";
        const cmd = `helm install ${name} ${chart} ${nsArg} ${versionArg} ${valuesArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Helm chart ${chart} installed as ${name}` }]
        };
      }

      case "helm-upgrade": {
        const { name, chart, namespace, values } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const valuesArg = values ? `-f <(echo '${values}')` : "";
        const cmd = `helm upgrade ${name} ${chart} ${nsArg} ${valuesArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Helm release ${name} upgraded` }]
        };
      }

      case "helm-uninstall": {
        const { name, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `helm uninstall ${name} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Helm release ${name} uninstalled` }]
        };
      }

      // ArgoCD Operations
      case "argocd-list-apps": {
        const { namespace = "argocd" } = args || {};
        const cmd = `kubectl get applications -n ${namespace} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No ArgoCD applications found" }]
        };
      }

      case "argocd-app-status": {
        const { app, namespace = "argocd" } = args;
        const cmd = `kubectl get application ${app} -n ${namespace} -o yaml`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "ArgoCD application not found" }]
        };
      }

      // Istio Operations
      case "istio-list-virtualservices": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get virtualservices ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No Istio virtual services found" }]
        };
      }

      case "istio-list-gateways": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get gateways ${nsArg} -o wide`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No Istio gateways found" }]
        };
      }

      // Prometheus/Kube State Metrics
      case "get-cluster-metrics": {
        const cmd = `kubectl get --raw /apis/metrics.k8s.io/v1beta1/nodes`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "Unable to get cluster metrics" }]
        };
      }

      // Advanced Debugging
      case "create-ephemeral-container": {
        const { pod, image, name, namespace, command } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const commandArg = command ? `-- ${command}` : "";
        const cmd = `kubectl debug ${pod} ${nsArg} --image=${image} --container=${name} --ephemeral-containers ${commandArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Ephemeral container ${name} created in pod ${pod}` }]
        };
      }

      // Resource Analysis
      case "analyze-resource-usage": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl top pods ${nsArg} --containers`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "Unable to analyze resource usage" }]
        };
      }

      // Backup and Recovery
      case "create-backup": {
        const { namespace, output = "backup.yaml" } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "--all-namespaces";
        const cmd = `kubectl get all ${nsArg} -o yaml > ${output}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || `Backup created in ${output}` }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Kubernetes MCP server running on stdio");
}

main().catch(console.error);
