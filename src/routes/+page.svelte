<script>
  import { authStore } from '$lib/stores/authStore';
  import { machineStore } from '$lib/stores/machineStore';
  import { notificationStore } from '$lib/stores/notificationStore';
  import { fade } from 'svelte/transition';
  
  let searchTerm = '';
  let filteredMachines = [];
  let showAddMachineModal = false;
  let newMachine = {
    name: '',
    location: '',
    type: 'snack'
  };

  function handleAddMachine() {
    if (newMachine.name && newMachine.location) {
      machineStore.addMachine(newMachine);
      showAddMachineModal = false;
      newMachine = {
        name: '',
        location: '',
        type: 'snack'
      };
    }
  }
  
  $: {
    if (searchTerm) {
      filteredMachines = $machineStore.filter(machine =>
        machine.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      filteredMachines = $machineStore;
    }
  }
</script>

{#if $authStore.isAuthenticated}
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Machines Overview</h2>
        <div class="flex space-x-4">
          <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search machines..."
            class="w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <button
            on:click={() => showAddMachineModal = true}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            Add Machine
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredMachines as machine (machine.id)}
          <div
            transition:fade
            class="bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{machine.name}</h3>
                <span
                  class={`px-2 py-1 rounded-full text-sm font-medium ${
                    machine.stockLevel < 20
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      : machine.stockLevel < 50
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  }`}
                >
                  Stock: {machine.stockLevel}
                </span>
              </div>
              
              <div class="space-y-2">
                <p class="text-gray-600 dark:text-gray-300">Location: {machine.location}</p>
                <p class="text-gray-600 dark:text-gray-300">Orders: {machine.totalOrders}</p>
                <p class="text-gray-600 dark:text-gray-300">Likes: {machine.likes}</p>
                <p class="text-gray-600 dark:text-gray-300">Status: {machine.status}</p>
              </div>
              
              <div class="mt-4 flex space-x-2">
                <a
                  href="/machine/{machine.id}"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                >
                  View Details
                </a>
                <button
                  on:click={() => machineStore.placeOrder(machine.id, {
                    method: 'card',
                    amount: machine.pricePerItem,
                    currency: 'USD',
                    timestamp: new Date().toISOString()
                  })}
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                  disabled={machine.stockLevel === 0}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Add Machine Modal -->
    {#if showAddMachineModal}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Machine</h3>
          <div class="space-y-4">
            <div>
              <label for="machine-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                id="machine-name"
                type="text"
                bind:value={newMachine.name}
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter machine name"
              />
            </div>
            <div>
              <label for="machine-location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input
                id="machine-location"
                type="text"
                bind:value={newMachine.location}
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter location"
              />
            </div>
            <div>
              <label for="machine-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                id="machine-type"
                bind:value={newMachine.type}
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="snack">Snack Machine</option>
                <option value="drink">Drink Machine</option>
                <option value="coffee">Coffee Machine</option>
              </select>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              on:click={() => showAddMachineModal = false}
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              on:click={handleAddMachine}
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Machine
            </button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Low Stock Alert Section -->
    {#if filteredMachines.some(m => m.stockLevel < 20)}
      <div class="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-600 p-4 rounded-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Low Stock Alert</h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <ul class="list-disc pl-5 space-y-1">
                {#each filteredMachines.filter(m => m.stockLevel < 20) as machine}
                  <li>{machine.name} - {machine.stockLevel} items remaining</li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
      Welcome to Smart Kiosk
    </h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
      The future of vending is here! Our smart kiosks offer real-time inventory tracking, personalized recommendations, and a seamless payment experience.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full mb-12">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div class="text-blue-600 dark:text-blue-400 text-4xl mb-4">🔍</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Tracking</h3>
        <p class="text-gray-600 dark:text-gray-400">Real-time inventory monitoring and analytics for optimal stock management.</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div class="text-blue-600 dark:text-blue-400 text-4xl mb-4">🌡️</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Weather Smart</h3>
        <p class="text-gray-600 dark:text-gray-400">Get personalized recommendations based on weather conditions.</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div class="text-blue-600 dark:text-blue-400 text-4xl mb-4">🏆</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Rewards Program</h3>
        <p class="text-gray-600 dark:text-gray-400">Earn points with every purchase and unlock exclusive rewards.</p>
      </div>
    </div>
    <a
      href="/auth"
      class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
    >
      Get Started →
    </a>
  </div>
{/if}
