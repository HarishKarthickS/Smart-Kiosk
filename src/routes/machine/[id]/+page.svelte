<!-- src/routes/machine/[id]/+page.svelte -->
<script>
  import { page } from '$app/stores';
  import { machineStore } from '$lib/stores/machineStore';
  import { fade } from 'svelte/transition';

  $: machine = $machineStore.find(m => m.id === parseInt($page.params.id));
  $: lowStock = machine?.stockLevel < 20;

  let maintenanceDate = '';

  function handleMaintenanceSchedule() {
    if (maintenanceDate) {
      machineStore.scheduleMaintenance(machine.id, maintenanceDate);
      maintenanceDate = '';
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
  }
</script>

{#if machine}
  <div class="space-y-6" transition:fade>
    <!-- Machine Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{machine.name}</h1>
          <p class="mt-1 text-gray-500">Location: {machine.location}</p>
        </div>
        <span
          class={`px-3 py-1 rounded-full text-sm font-medium ${
            machine.status === 'operational'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {machine.status}
        </span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Stock Level -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900">Stock Level</h2>
        <div class="mt-2 flex items-baseline">
          <p class={`text-4xl font-semibold ${lowStock ? 'text-red-600' : 'text-gray-900'}`}>
            {machine.stockLevel}
          </p>
          <p class="ml-2 text-sm text-gray-500">/ {machine.maxStock}</p>
        </div>
        <button
          on:click={() => machineStore.restock(machine.id)}
          class="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Restock
        </button>
      </div>

      <!-- Orders -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900">Total Orders</h2>
        <p class="mt-2 text-4xl font-semibold text-gray-900">{machine.totalOrders}</p>
        <button
          on:click={() => machineStore.placeOrder(machine.id)}
          disabled={machine.stockLevel === 0}
          class="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Orders
        </button>
      </div>

      <!-- Likes -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900">Likes</h2>
        <p class="mt-2 text-4xl font-semibold text-gray-900">{machine.likes}</p>
        <button
          on:click={() => machineStore.addLike(machine.id)}
          class="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Like
        </button>
      </div>
    </div>

    <!-- Maintenance Schedule -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Schedule Maintenance</h2>
      <div class="flex space-x-4">
        <input
          type="datetime-local"
          bind:value={maintenanceDate}
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          on:click={handleMaintenanceSchedule}
          disabled={!maintenanceDate}
          class="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Schedule
        </button>
      </div>
      {#if machine.maintenanceSchedule}
        <p class="mt-2 text-sm text-gray-500">
          Next maintenance scheduled for: {formatDate(machine.maintenanceSchedule)}
        </p>
      {/if}
    </div>

    <!-- Order History -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
      {#if machine.orderHistory.length > 0}
        <div class="flow-root">
          <ul class="-my-5 divide-y divide-gray-200">
            {#each machine.orderHistory as order}
              <li class="py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      Order #{order.id}
                    </p>
                    <p class="text-sm text-gray-500">
                      {formatDate(order.timestamp)}
                    </p>
                  </div>
                  <div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Quantity: {order.quantity}
                    </span>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {:else}
        <p class="text-gray-500">No recent orders</p>
      {/if}
    </div>
  </div>
{:else}
  <div class="text-center py-12">
    <p class="text-xl text-gray-600">Machine not found</p>
  </div>
{/if}