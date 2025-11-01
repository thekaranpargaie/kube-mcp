# Kubernetes MCP Server

A powerful MCP (Model Context Protocol) server for Kubernetes operations that allows you to manage your Kubernetes clusters using natural language through AI assistants.

<a href="https://glama.ai/mcp/servers/@thekaranpargaie/kube-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@thekaranpargaie/kube-mcp/badge" alt="Kubernetes Server MCP server" />
</a>

## 🌟 Features

- **📋 Resource Listing**
  - List pods, services, deployments, and namespaces
  - Get detailed resource information
  
- **🔍 Monitoring & Debugging**  
  - View pod logs with customizable line counts
  - Describe pod details for troubleshooting
  - Get cluster events for debugging
  
- **⚡ Operations**
  - Port-forward services to local ports
  - Scale deployments up or down
  - Execute kubectl commands through natural language

- **🎯 Developer Focused**
  - Designed for common Kubernetes developer workflows
  - Easy to extend with additional tools
  - Comprehensive error handling

## 🛠 Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `list-pods` | List pods in a namespace | `namespace` (optional) |
| `list-services` | List services in a namespace | `namespace` (optional) |
| `list-deployments` | List deployments in a namespace | `namespace` (optional) |
| `list-namespaces` | List all namespaces | None |
| `describe-pod` | Get detailed pod information | `pod` (required), `namespace` (optional) |
| `get-logs` | Get pod logs | `pod` (required), `namespace` (optional), `lines` (optional), `follow` (optional) |
| `port-forward` | Port forward a service | `service`, `localPort`, `targetPort` (required), `namespace` (optional) |
| `scale-deployment` | Scale a deployment | `deployment`, `replicas` (required), `namespace` (optional) |
| `get-events` | Get cluster events | `namespace` (optional) |

## 📋 Requirements

- **Node.js** v18+ 
- **kubectl** installed and configured to access your cluster
- **@modelcontextprotocol/cli** (optional, for testing)

```bash
# Verify kubectl works
kubectl get pods

# Install MCP CLI (optional)
npm install -g @modelcontextprotocol/cli
```

## 🔧 Installation

```bash
# Clone or download this repository
cd kube-mcp

# Install dependencies
npm install

# Run tests to verify setup
node test.js
```

## 🏃 Running the Server

```bash
# Start the MCP server
npm start

# Or run directly
node server.js
```

The server runs on stdio transport and will output: `Kubernetes MCP server running on stdio`

## 🔌 Connecting to MCP Clients

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "kubernetes": {
      "command": "node",
      "args": ["/absolute/path/to/kube-mcp/server.js"]
    }
  }
}
```

### Other MCP Clients

For clients that support MCP, configure them to connect to this server using:
- **Command**: `node`
- **Args**: `["/path/to/server.js"]`
- **Transport**: stdio

## 💡 Example Usage

Once connected to an MCP-compatible client, you can use natural language like:

- *"List all pods in the default namespace"*
- *"Show me the logs for the nginx pod"*
- *"Port forward the web service on port 8080 to my local port 3000"*
- *"Scale the api deployment to 3 replicas"*
- *"What events happened recently in the kube-system namespace?"*

## 🧪 Testing

Run the test script to verify everything is working:

```bash
node test.js
```

This will check:
- ✅ kubectl availability
- ✅ Server syntax validation  
- ✅ Server startup capability
- ✅ Cluster connectivity

## 🛠️ Development

To add new tools:

1. Add the tool definition to the `tools` array in `server.js`
2. Add a corresponding case in the `CallToolRequestSchema` handler
3. Implement the kubectl command and response formatting
4. Test with `node test.js`

## ⚠️ Security Notes

- This server executes kubectl commands on your system
- Ensure your kubectl context is set to the correct cluster
- Be cautious when scaling deployments or port-forwarding in production
- Review all operations before execution

## 📜 License

MIT License - feel free to modify and distribute

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

Restart your MCP-enabled client (Cursor AI, Claude Desktop, VS Code MCP extension, etc.)  

Now you can issue natural commands like:
- "Show me all pods in namespace payments"
- "Port forward postgres service to local 5432"
- "Get logs from api-pod"