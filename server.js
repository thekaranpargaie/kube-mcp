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
        }
      },
      required: ["pod"]
    }
  },
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

      case "describe-pod": {
        const { pod, namespace } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl describe pod ${pod} ${nsArg}`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No pod details found" }]
        };
      }

      case "get-logs": {
        const { pod, namespace, lines = 100, follow = false } = args;
        const nsArg = namespace ? `-n ${namespace}` : "";
        const followArg = follow ? "-f" : "";
        const cmd = `kubectl logs ${pod} ${nsArg} --tail=${lines} ${followArg}`.trim();
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No logs found" }]
        };
      }

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

      case "get-events": {
        const { namespace } = args || {};
        const nsArg = namespace ? `-n ${namespace}` : "";
        const cmd = `kubectl get events ${nsArg} --sort-by='.lastTimestamp'`;
        const { stdout } = await execAsync(cmd);
        return {
          content: [{ type: "text", text: stdout || "No events found" }]
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
