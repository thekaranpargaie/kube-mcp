#!/usr/bin/env node
/**
 * Test script for the Kubernetes MCP server
 * This script tests the basic functionality of the MCP server
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testMCPServer() {
  console.log('🔍 Testing Kubernetes MCP Server...\n');
  
  try {
    // Test 1: Check if kubectl is available
    console.log('✅ Test 1: Checking kubectl availability...');
    try {
      await execAsync('kubectl version --client');
      console.log('   ✓ kubectl is available\n');
    } catch (error) {
      console.log('   ⚠️  kubectl not found or not in PATH');
      console.log('   Please install kubectl to use this MCP server\n');
    }

    // Test 2: Check server syntax
    console.log('✅ Test 2: Checking server syntax...');
    try {
      await execAsync('node -c server.js');
      console.log('   ✓ Server syntax is valid\n');
    } catch (error) {
      console.log('   ❌ Server syntax error:');
      console.log('   ', error.message);
      return;
    }

    // Test 3: Check if server can start (basic test)
    console.log('✅ Test 3: Testing server startup...');
    try {
      // Just import the module to check for import errors
      const serverModule = await import('./server.js');
      console.log('   ✓ Server imports successfully\n');
    } catch (error) {
      console.log('   ❌ Server import error:');
      console.log('   ', error.message);
      return;
    }

    // Test 4: Check if cluster is accessible (if kubectl works)
    console.log('✅ Test 4: Testing cluster connectivity...');
    try {
      await execAsync('kubectl cluster-info --request-timeout=5s');
      console.log('   ✓ Kubernetes cluster is accessible\n');
    } catch (error) {
      console.log('   ⚠️  Cannot connect to Kubernetes cluster');
      console.log('   The MCP server will work but kubectl commands will fail\n');
    }

    console.log('🎉 Basic tests completed!');
    console.log('\n📋 Available tools in this MCP server:');
    console.log('   • list-pods - List pods in a namespace');
    console.log('   • list-services - List services in a namespace');
    console.log('   • list-deployments - List deployments in a namespace');
    console.log('   • list-namespaces - List all namespaces');
    console.log('   • describe-pod - Get detailed pod information');
    console.log('   • get-logs - Get pod logs');
    console.log('   • port-forward - Port forward a service');
    console.log('   • scale-deployment - Scale a deployment');
    console.log('   • get-events - Get cluster events');

    console.log('\n🚀 To use this MCP server:');
    console.log('   1. Make sure kubectl is configured for your cluster');
    console.log('   2. Add this server to your MCP client configuration');
    console.log('   3. The server uses stdio transport on: node server.js');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMCPServer();
